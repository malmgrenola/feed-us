$(document).ready(function() {
  initData();
  const q = gs.getUrlParam("q");
  //if (q !== "") gs.find(q);
  gs.find(q);
  render();
});

let indexRequestedRandom = false;

const render = () => {
  //console.log("Render", session);
  $("#index").html(`<div class="container">${Index()}</div>`);
  $("#search-input").focus();
};

const searchOnEnter = e => {
  if (event.which == 13) {
    gs.find(event.target.value);
  }
};

const indexRemoveMealData = ({ weekday }) => {
  session.data.meals[weekday] = null;
  fbSetDoc(session.id, session.data).catch(error => {
    console.error("Error writing document: ", error);
  });
  render();
};

const indexSetRandomMeal = weekday => {
  indexRequestedRandom = true;
  console.log("indexRequestedRandom");
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

const Index = () => {
  const q = gs.getUrlParam("q");
  console.log("index", gs);

  // Todo: Fix HTMLFormElement: submit event
  return `
  <div class="row">
    <div class="col text-center">
      <h1>Feed Us!</h1>
    </div>
  </div>
  <div class="row">
    <div class="col text-center">
      <h2>What's for dinner this week?</h2>
    </div>
  </div>
  <div class="row">
    <div class="col text-center">
        <input type="text" id="search-input" value="${q}" onkeyup="searchOnEnter()"/>
    </div>
  </div>
  <div class="row">
        <div class="col-12 col-md-10 m-0 p-0">${
          gs.results.length > 0
            ? globalHits({ meals: gs.results })
            : Suggestion()
        }</div>
        <div class="col-12 col-md-2 m-0 p-0">${IndexWidget()}</div>
  </div>
  `;
};

const IndexSearchResults = () => {
  return Suggestion();
};

const Suggestion = () => {
  const randomDish = () => {
    console.log("call random");
    indexRequestedRandom = true;
    mealApiRandom()
      .then(data => {
        session.data.suggestion = data.meals[0];
        render();
      })
      .catch(error => {
        console.error("Error getting meal: ", error);
      });
  };

  const Loading = () => {
    return `
      <div class="container">
        <div class="row">
            <div class="col">dinner Suggestion</div>
        </div>
        <div class="row">
            <div class="col">Loading...</div>
        </div>
      </div>
    `;
  };

  if (!session.data) return Loading();

  if (!indexRequestedRandom) randomDish();

  const meal = session.data ? session.data.suggestion : null;

  if (!meal) return Loading();

  console.log(meal);

  return `
  <div class="container">
    <div class="card mb-3">
    <div class="row g-0">
      <div class="col-md-4">
      <img class="card-img-top" src="${meal.strMealThumb}" alt="${
    meal.strMeal
  } image">
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title"><a href="meal.html?m=${meal.idMeal}">${
    meal.strMeal
  }</a> <span>${
    !globalInUserFav(meal.idMeal)
      ? `<i class="far fa-heart fav" onclick="globalAddFav({meal: '${encodeURIComponent(
          JSON.stringify(meal)
        )}'})"></i>`
      : `<i class="fas fa-heart fav" onclick="globalRemoveFav(${meal.idMeal})"></i>`
  }
          </span></h5>
          <p class="card-text">This ${meal.strCategory} dish is from the ${
    meal.strArea
  } area </p>
          <p class="card-text">${
            meal.strTags
              ? `<p class="card-text">${meal.strTags
                  .split(",")
                  .map(tag => {
                    return `<span class="badge bg-primary m-1">${tag}</span>`;
                  })
                  .join("")}</p>`
              : ""
          }</p>
          <p class="card-text my-1">
          <span class="btn btn-primary btn-sm" onclick="globalSetMeal({weekday: 'Mon', meal: '${encodeURIComponent(
            JSON.stringify(meal)
          )}'})">Monday</span>
          <span class="btn btn-primary btn-sm" onclick="globalSetMeal({weekday: 'Tue', meal: '${encodeURIComponent(
            JSON.stringify(meal)
          )}'})">Tuesday</span>
          <span class="btn btn-primary btn-sm" onclick="globalSetMeal({weekday: 'Wed', meal: '${encodeURIComponent(
            JSON.stringify(meal)
          )}'})">Wednesday</span>
          <span class="btn btn-primary btn-sm" onclick="globalSetMeal({weekday: 'Thu', meal: '${encodeURIComponent(
            JSON.stringify(meal)
          )}'})">Thursday</span>
          <span class="btn btn-primary btn-sm" onclick="globalSetMeal({weekday: 'Fri', meal: '${encodeURIComponent(
            JSON.stringify(meal)
          )}'})">Friday</span>
          <span class="btn btn-primary btn-sm" onclick="globalSetMeal({weekday: 'Sat', meal: '${encodeURIComponent(
            JSON.stringify(meal)
          )}'})">Saturday</span>
          <span class="btn btn-primary btn-sm" onclick="globalSetMeal({weekday: 'Sun', meal: '${encodeURIComponent(
            JSON.stringify(meal)
          )}'})">Sunday</span>
          </p>
        </div>
      </div>
    </div>
  </div>
  </div>
    `;
};

const IndexWidget = () => {
  const IndexWidgetDay = ({ weekday }) => {
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

    const userMeals = session.data ? session.data.meals : null;
    if (!userMeals) return Loading();
    const meal = weekday.abbr in userMeals ? userMeals[weekday.abbr] : null;
    if (!meal) return "EmptyCard();";

    return `
        <div>
          <div class="header"><h3>${weekday.name}</h3></div>
          <div class="d-flex flex-row align-items-center w-card">
            <div class="image"><img src="${meal.strMealThumb}" class="" alt="${
      meal.strMeal
    } image" /></div>
            <div class="content text"><h5 class=""><a href="meal.html?m=${
              meal.idMeal
            }">${meal.strMeal}</a></h5></div>
            <div class="content icon">
            <span>${
              !globalInUserFav(meal.idMeal)
                ? `<i class="far fa-heart fav" onclick="globalAddFav({meal: '${encodeURIComponent(
                    JSON.stringify(meal)
                  )}'})"></i>`
                : `<i class="fas fa-heart fav" onclick="globalRemoveFav(${meal.idMeal})"></i>`
            }
            </span>
            </div>
          </div>
        </div>
          `;
  };

  return `
  <div class="container widget">
    <div class="row">
      <div class="col"><h2>Dishes</h2></div>
    </div>
    <div class="row">${globalWeekdays
      .map(weekday => {
        return `
        <div class="col-12 day">
          ${IndexWidgetDay({ weekday: weekday })}
        </div>`;
      })
      .join("\n")}
      </div>
    </div>
    `;
};
