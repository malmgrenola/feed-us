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
  console.log("find", this);

  mealApiSearch(q)
    .then(response => {
      if (response.meals) {
        this.results = response.meals;
      } else {
        this.results = [];
      }
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

const globalHits = ({ meals }) => {
  console.log("Hits", meals);

  if (!meals) {
    return `
      <div class="container m-0 p-0">
        <div class="row">
          <div class="col">
          </div>
        </div>
      </div>
        `;
  }

  return `
  <div class="row">
    <div class="col text-center">
      <p>${
        meals.length > 0
          ? `${meals.length} meal${meals.length > 1 ? "s" : ""} found`
          : "No meals found"
      }</p>
    </div>
  </div>

  ${meals
    .map(meal => {
      const Image = () => {
        return `<img
                    class="rounded-circle"
                    src="${meal.strMealThumb}"
                    alt="${meal.strMeal} image"
                  />`;
      };

      const Title = () => {
        return `<h3><span class="me-4">${
          !globalInUserFav(meal.idMeal)
            ? `<i class="far fa-heart fav" onclick="globalAddFav({meal: '${encodeURIComponent(
                JSON.stringify(meal)
              )}'})"></i>`
            : `<i class="fas fa-heart fav" onclick="globalRemoveFav(${meal.idMeal})"></i>`
        }
                    </span> <a href="meal.html?m=${meal.idMeal}">${
          meal.strMeal
        }</a> </h3>`;
      };

      const Ingridient = () => {
        let ingridients = [];

        for (let i = 1; i <= 20; i++) {
          const ingridient = meal[`strIngredient${i}`];
          if (ingridient !== "" && ingridient !== null) {
            ingridients.push(meal[`strIngredient${i}`]);
          }
        }
        return `<p><span class="text-muted m-0">${ingridients.join(
          ", "
        )}</span></p>`;
      };

      const Tags = () => {
        return ` ${
          meal.strTags
            ? `<span class="search-tags">${meal.strTags
                .split(",")
                .map(tag => {
                  return `<span class="badge bg-primary m-1">${tag}</span>`;
                })
                .join("")}</span>`
            : `<span class="search-tags">&nbsp;</span>`
        }`;
      };

      const Hamburger = () => {
        return `<div class="dropdown">
                    <a class="" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                      <i class="fas fa-bars"></i>
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                      <li><span class="dropdown-item" onclick="globalSetMeal({weekday: 'Mon', meal: '${encodeURIComponent(
                        JSON.stringify(meal)
                      )}'})">Have this on Monday</span></li>
                      <li><span class="dropdown-item" onclick="globalSetMeal({weekday: 'Tue', meal: '${encodeURIComponent(
                        JSON.stringify(meal)
                      )}'})">Have this on Tuesday</span></li>
                      <li><span class="dropdown-item" onclick="globalSetMeal({weekday: 'Wed', meal: '${encodeURIComponent(
                        JSON.stringify(meal)
                      )}'})">Have this on Wednesday</span></li>
                      <li><span class="dropdown-item" onclick="globalSetMeal({weekday: 'Thu', meal: '${encodeURIComponent(
                        JSON.stringify(meal)
                      )}'})">Have this on Thursday</span></li>
                      <li><span class="dropdown-item" onclick="globalSetMeal({weekday: 'Fri', meal: '${encodeURIComponent(
                        JSON.stringify(meal)
                      )}'})">Have this on Friday</span></li>
                      <li><span class="dropdown-item" onclick="globalSetMeal({weekday: 'Sat', meal: '${encodeURIComponent(
                        JSON.stringify(meal)
                      )}'})">Have this on Saturday</span></li>
                      <li><span class="dropdown-item" onclick="globalSetMeal({weekday: 'Sun', meal: '${encodeURIComponent(
                        JSON.stringify(meal)
                      )}'})">Have this on Sunday</span></li>
                    </ul>
                  </div>`;
      };

      return `
        <div id="search" class="container m-0 p-0">
          <div class="row">
            <div class="col">
                <div class="d-flex flex-row flex-nowrap flex-grow-1 bd-highlight justify-content-start align-items-center background-grey search-row">
                  <div class="flex-shrink-0">${Image()}</div>
                  <div class="flex-grow-1">
                    <div>${Title()}</div>
                    <div>${Tags()}</div>
                  </div>
                  <div class="me-3">${Hamburger()}</div>
                </div>
            </div>
          </div>
        </div>
          `;
    })
    .join("\n")}
  `;
};
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
