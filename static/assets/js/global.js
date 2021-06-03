let session = {};

function initData() {
  //console.log("initUserData - Loading");
  fbInit();
  const fpPromise = FingerprintJS.load();

  fpPromise
    .then(fp => fp.get())
    .then(result => {
      //console.log("initUserData - Fingerprint Sucess");
      session.id = result.visitorId;
      fbSignInAnonymously(session.id)
        .then(args => {
          //console.log("initUserData - Signed In");
          const user = {
            isAnonymous: args.user.isAnonymous,
            displayName: args.user.displayName,
            email: args.user.email,
            metadata: args.user.metadata
          };
          session.user = user;
          fbGetUserDocument(session.id)
            .then(doc => {
              if (doc.exists) {
                //console.log("initUserData - Stored Data Found");
                session.data = doc.data();
              } else {
                //console.log("initUserData - Stored Data Not Found");
                session.data = {
                  meals: {
                    Mon: null,
                    Tue: null,
                    Wed: null,
                    Thu: null,
                    Fri: null,
                    Sat: null,
                    Sun: null
                  },
                  shoppingChecked: [],
                  favlist: [],
                  additionalItems: []
                };
              }
              //console.log("initUserData - Done Loading");
              render();
            })
            .catch(error => {
              console.error("Error getting document:", error);
            });
        })
        .catch(error => {
          var errorCode = error.code;
          var errorMessage = error.message;
          // ...
        });
    });
}
const globalInUserFav = idMeal => {
  if (!session.data) return null;

  return session.data.favlist
    .map(meal => meal.idMeal)
    .includes(typeof idMeal !== "string" ? idMeal.toString() : idMeal);
};

const globalIndexOfUserFav = idMeal => {
  if (!session.data) return null;
  return session.data.favlist
    .map(meal => meal.idMeal)
    .indexOf(typeof idMeal !== "string" ? idMeal.toString() : idMeal);
};

const globalInUserWeek = ({ weekday, idMeal }) => {
  if (!session.data) return null;
  if (idMeal === session.data.meals[weekday].idMeal) return true;
  return false;
};

const globalAddFav = props => {
  //TODO: Fix error Uncaught SyntaxError: Unexpected identifier when adding f.ex. Recheado Masala Fish
  const meal = JSON.parse(decodeURIComponent(props.meal));

  if (!globalInUserFav(meal.idMeal)) {
    session.data.favlist.push(meal);
    fbSetDoc(session.id, session.data).catch(error => {
      console.error("Error writing document: ", error);
    });
    render();
  }
};

const globalRemoveFav = idMeal => {
  const elem = globalIndexOfUserFav(idMeal);
  if (elem >= 0) {
    session.data.favlist.splice(elem, 1);
    fbSetDoc(session.id, session.data).catch(error => {
      console.error("Error writing document: ", error);
    });
    render();
  }
};
const globalSetMeal = props => {
  const meal = JSON.parse(decodeURIComponent(props.meal));
  const weekday = props.weekday;

  session.data.meals[weekday] = meal;
  fbSetDoc(session.id, session.data).catch(error => {
    console.error("Error writing document: ", error);
  });
  render();
};

const globalWeekdays = [
  { abbr: "Mon", name: "Monday" },
  { abbr: "Tue", name: "Tuesday" },
  { abbr: "Wed", name: "Wednesday" },
  { abbr: "Thu", name: "Thursday" },
  { abbr: "Fri", name: "Friday" },
  { abbr: "Sat", name: "Saturday" },
  { abbr: "Sun", name: "Sunday" }
];

// --------------------------------------------Search features
// let globalSearchResults = [];

let GlobalSearch = function() {
  this.q = "";
  this.results = [];
};

GlobalSearch.prototype.find = function(q) {
  this.q = q;
  this.setUrlParam("q", q);

  mealApiSearch(q)
    .then(response => {
      this.results = [];
      if (response.meals) this.results = response.meals;
      render();
    })
    .catch(error => {
      console.error(error);
    });
};

GlobalSearch.prototype.getUrlParam = param => {
  return new URL(window.location).searchParams.get(param) ?? "";
};

GlobalSearch.prototype.setUrlParam = (key, value) => {
  // use history as state provider
  const url = new URL(window.location);
  url.searchParams.set(key, value);
  window.history.pushState({}, "", url);
};

let gs = new GlobalSearch();

// const globalGetUrlParam = param => {
//   // use history as state provider
//   return new URL(window.location).searchParams.get(param) ?? "";
// };
//
// const globalSetUrlParam = (key, value) => {
//   // use history as state provider
//   const url = new URL(window.location);
//   url.searchParams.set(key, value);
//   window.history.pushState({}, "", url);
// };

// const globalSearchDo = query => {
//   globalSetUrlParam("q", query);
//
//   mealApiSearch(query)
//     .then(response => {
//       if (response.meals) {
//         globalSearchResults = response.meals;
//       } else {
//         globalSearchResults = [];
//       }
//       render();
//     })
//     .catch(errorResponse => {
//       $("#search-content").html(
//         `<h2>Error: ${errorResponse.responseJSON.message}</h2>`
//       );
//     });
// };
