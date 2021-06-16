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
  session.data.meals[weekday] = null;
  fbSetDoc(session.id, session.data).catch(error => {
    console.error("Error writing document: ", error);
  });
  render();
};

const globalAddFav = props => {
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

// ---------------------------------------------- Footer
$(document).ready(function() {
  footer();
});

const footer = () => {
  $("footer").html(`
<div class="container-fluid bg-light">
  <div class="row">
    <div class="col text-center mt-4">
      <h2>Feed Us!</h2>
      <p>On this site you can manage the family's weekly meals.<br />
      Find the favourite meals and assign them to any weekday.</p>
      <p>Use the <a href="/list.html">shopping list</a> to tick off the items already in place and add the favourite extra items.</p>
      <p>We love to hear from you</p>
      <p>Follow us: <a href="https://facebook.com" target="_blank"><i class="fab fa-facebook"></i></a> <a href="https://twitter.com" target="_blank"><i class="fab fa-twitter"></i></a> <a href="https://instagram.com" target="_blank"><i class="fab fa-instagram-square"></i></a></p>
    </div>
  </div>
</div>
    `);
};

const GlobalWidget = () => {
  const WidgetDay = ({ weekday }) => {
    const Loading = () => {
      return `
    <div>
      <div class="header"><h3>${weekday.name}</h3></div>
      <div class="d-flex flex-row align-items-center w-card loading">
        <div class="image"></div>
        <div class="content text"></div>
        <div class="content icon"></div>
      </div>
    </div>
      `;
    };
    const Empty = () => {
      return `
    <div>
      <div class="header"><h3>${weekday.name}</h3></div>
      <div class="d-flex flex-row align-items-center w-card">
        <div class="image"></div>
        <div class="content text text-muted">
        <p>No dish selected yet.</p>
        <p><span
        class="a"
        onclick="globalSetRandomMeal('${weekday.abbr}')"
        >I'm lucky! <i class="fas fa-random"></i></span></p></div>
        <div class="content icon"></div>
      </div>
    </div>
      `;
    };
    const userMeals = session.data ? session.data.meals : null;
    if (!userMeals) return Loading();
    const meal = weekday.abbr in userMeals ? userMeals[weekday.abbr] : null;
    if (!meal) return Empty();

    const Favicon = () => {
      return !globalInUserFav(meal.idMeal)
        ? `<i class="far fa-heart fav a-icon" onclick="globalAddFav({meal: '${encodeURIComponent(
            JSON.stringify({ ...meal, strInstructions: "" })
          )}'})"></i>`
        : `<i class="fas fa-heart fav a-icon" onclick="globalRemoveFav(${meal.idMeal})"></i>`;
    };

    return `
        <div>
          <div class="header align-items-center">
            <h3 class="">${weekday.name}</h3>
          </div>
          <div class="d-flex flex-row align-items-center w-card">
            <div class="image"><img src="${meal.strMealThumb}" class="" alt="${
      meal.strMeal
    } image" /></div>
          <div class ="content icon"> ${Favicon()}</div>
            <div class="content text">
              <h5><a href="meal.html?m=${meal.idMeal}">${meal.strMeal}</a></h5>
            </div>
            <div class="content icon">
              <i class="far fa-trash-alt a-icon" onclick="globalRemoveMealData({ weekday: '${
                weekday.abbr
              }' });"></i>
            </div>
          </div>
        </div>
          `;
  };

  return `
  <aside>
    <div class="container widget">
      <div class="row">
        <div class="col"><h2>Week Schedule <a href="week.html" target="_self"><i class="fas fa-expand-alt a-icon"></i></a></h2></div>
      </div>
      <div class="row">${globalWeekdays
        .map(weekday => {
          return `
          <div class="col-12 day">
            ${WidgetDay({ weekday: weekday })}
          </div>`;
        })
        .join("\n")}
      </div>
    </div>
  </aside>
    `;
};
