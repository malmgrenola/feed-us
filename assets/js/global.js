let session = {};

function initData() {
  //console.log("initUserData - Loading");
  fbInit();
  const fpPromise = FingerprintJS.load();

  fpPromise
    .then(fp => fp.get())
    .then(result => {
      session.id = result.visitorId;
      fbSignInAnonymously(session.id)
        .then(args => {
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
                session.data = doc.data();
              } else {
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
  if (!session.data) return false;
  if (!session.data.meals[weekday]) return false;
  if (idMeal === session.data.meals[weekday].idMeal) return true;
  return false;
};
const globalMealInUserWeek = () => {
  if (!session.data) return false;

  for (const weekday in session.data.meals) {
    if (session.data.meals[weekday] !== null) {
      return true;
    }
  }
  return false;
};

const globalRemoveMealData = ({ weekday }) => {
  console.log(weekday);
  session.data.meals[weekday] = null;
  fbSetDoc(session.id, session.data).catch(error => {
    console.error("Error writing document: ", error);
  });
  render();
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

const globalToggleMeal = props => {
  const meal = JSON.parse(decodeURIComponent(props.meal));
  const weekday = props.weekday;

  // Toggle meal on/off or set meal if it is another
  if (!session.data.meals[weekday]) {
    session.data.meals[weekday] = meal;
  } else {
    if (session.data.meals[weekday].idMeal === meal.idMeal) {
      session.data.meals[weekday] = null;
    } else {
      session.data.meals[weekday] = meal;
    }
  }
  fbSetDoc(session.id, session.data).catch(error => {
    console.error("Error writing document: ", error);
  });
  render();
};

const globalSetRandomMeal = weekday => {
  mealApiRandom()
    .then(response => {
      const meal = response.meals[0];

      session.data.meals[weekday] = meal;
      fbSetDoc(session.id, session.data).catch(error => {
        console.error("Error writing document: ", error);
      });
      render();
    })
    .catch(errorResponse => {
      console.error(errorResponse);
    });
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

let gs = new GlobalSearch(); // Global search on all pages

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
