$(document).ready(function() {
  initData();
  const q = gs.getUrlParam("q");
  gs.find(q);
  render();
});

const render = () => {
  $("#index").html(`<div class="container-fluid">${Index()}</div>`);
  searchSetClear();
  $("#search-input").focus();
};

const searchKeyUp = e => {
  searchSetClear();

  if (event.which == 13) {
    searchFieldDo();
  }
};

const searchFieldDo = () => {
  const query = $("#search-input").val();
  gs.find(query);
};

const searchSetClear = () => {
  $("#search-input").val() !== ""
    ? $(".clear-icon").css("visibility", "visible")
    : $(".clear-icon").css("visibility", "hidden");
};

const searchClearDo = () => {
  $("#search-input").val("");
  $(".clear-icon").css("visibility", "hidden");
};

const indexRemoveMealData = ({ weekday }) => {
  session.data.meals[weekday] = null;
  fbSetDoc(session.id, session.data).catch(error => {
    console.error("Error writing document: ", error);
  });
  render();
};

const Index = () => {
  const q = gs.getUrlParam("q");

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
    <div class="searchbar d-inline-flex ">
      <i class="fas fa-search search-icon" onclick="searchFieldDo()"></i>
      <input class="search" type="search" id="search-input" name="search" value="${q}" onkeyup="searchKeyUp()" placeholder="Find your meal">
      <i class="fas fa-times-circle clear-icon" onclick="searchClearDo()"></i>
    </div>
    </div>
  </div>
  <div class="row">
    <div class="col text-center text-muted">
          ${Stats({
            meals: gs.results
          })}
    </div>
  </div>
  <div class="row">
        <div class="col-12 col-md-9 m-0 p-2">${Hits({
          meals: gs.results
        })}</div>
        <div class="col-12 col-md-3 m-0 p-2">${IndexWidget()}</div>
  </div>
  `;
};

const Stats = ({ meals }) => {
  return `
      <p>${
        meals.length > 0
          ? `${meals.length} meal${meals.length > 1 ? "s" : ""} found`
          : "No meals found"
      }</p>
    `;
};

const Hits = ({ meals }) => {
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
        return `<h3><a href="meal.html?m=${meal.idMeal}">${meal.strMeal}</a></h3>`;
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
        // const idx = Math.floor(
        //   Math.random() * (Number.MAX_SAFE_INTEGER - 1) + 1
        // );

        // return `
        // <nav class="navbar navbar-expand-lg navbar-light bg-light">
        //
        //     <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup-${idx}" aria-controls="navbarNavAltMarkup-${idx}" aria-expanded="false" aria-label="Toggle assignment">
        //       <span class="navbar-toggler-icon"></span>
        //     </button>
        //     <div class="collapse navbar-collapse" id="navbarNavAltMarkup-${idx}">
        //       <div class="navbar-nav">
        //         <a class="nav-link active" aria-current="page" href="#">Home</a>
        //         <a class="nav-link" href="#">Features</a>
        //         <a class="nav-link" href="#">Pricing</a>
        //         <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
        //       </div>
        //     </div>
        //
        // </nav>`;
        const WeekButton = ({ meal, weekday }) => {
          return `
          <span class="btn btn-week${
            globalInUserWeek({
              weekday: weekday,
              idMeal: meal.idMeal
            })
              ? " active"
              : ""
          }" onclick="globalSetMeal({weekday: '${weekday}', meal: '${encodeURIComponent(
            JSON.stringify(meal)
          )}'})"><p>${weekday.slice(0, 2)}</p></span>`;
        };

        return `<div class="dropdown d-md-none">
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
                      <li><hr class="dropdown-divider"></li>
                      <li>${
                        !globalInUserFav(meal.idMeal)
                          ? `<span class="dropdown-item" onclick="globalAddFav({meal: '${encodeURIComponent(
                              JSON.stringify(meal)
                            )}'})">Add to Favourites</<span>`
                          : `<span class="dropdown-item" onclick="globalRemoveFav(${meal.idMeal})">Remove from Favourites</span>`
                      }</li>
                    </ul>
                  </div>

                  <div class="container d-none d-md-block btn-group-week">
                    <div class="row">
                      <div class="col-3 p-0 text-center">${WeekButton({
                        meal: meal,
                        weekday: "Mon"
                      })}</div>
                      <div class="col-3 p-0 text-center">${WeekButton({
                        meal: meal,
                        weekday: "Tue"
                      })}</div>
                      <div class="col-3 p-0 text-center">${WeekButton({
                        meal: meal,
                        weekday: "Wed"
                      })}</div>
                      <div class="col-3 p-0 text-center">${WeekButton({
                        meal: meal,
                        weekday: "Thu"
                      })}</div>
                      <div class="col-3 p-0 text-center">${WeekButton({
                        meal: meal,
                        weekday: "Fri"
                      })}</div>
                      <div class="col-3 p-0 text-center">${WeekButton({
                        meal: meal,
                        weekday: "Sat"
                      })}</div>
                      <div class="col-3 p-0 text-center">${WeekButton({
                        meal: meal,
                        weekday: "Sun"
                      })}</div>
                      <div class="col-3 p-0 text-center"><span class="btn">${
                        !globalInUserFav(meal.idMeal)
                          ? `<i class="far fa-heart fav" onclick="globalAddFav({meal: '${encodeURIComponent(
                              JSON.stringify(meal)
                            )}'})"></i>`
                          : `<i class="fas fa-heart fav" onclick="globalRemoveFav(${meal.idMeal})"></i>`
                      }</span></div>
                    </div>
                  </div>`;
      };

      return `
        <div class="container-fluid">
          <div class="row">
            <div class="col">
                <div class="d-flex flex-row flex-nowrap flex-grow-1 bd-highlight justify-content-start align-items-center background-grey search-row">
                  <div class="flex-shrink-0">${Image()}</div>
                  <div class="flex-grow-1">
                    <div>${Title()}</div>
                    <div>${Tags()}</div>
                    <div>
                      <small><strong>
                      ${meal.strCategory}
                      </strong> dish is from the <strong>${
                        meal.strArea
                      }</strong> area
                      </small>
                    </div>
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
      <div class="col"><h2>My Dinner Week</h2></div>
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
