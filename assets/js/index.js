$(document).ready(function() {
  initData();
  const q = gs.getUrlParam("q");
  gs.find(q);
  render();
});

const render = () => {
  $("#index").html(`<div class="container-fluid">${Index()}</div>`);
  searchSetClear();
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

const Index = () => {
  const q = gs.getUrlParam("q");

  const isMeals = globalMealInUserWeek();

  return `
  <header>
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
  </header>
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
  <div class="row d-md-none">
    <div class="col text-center text-muted">
          Goto <a href="#weekly-widget">Weekly Schedule</a>
    </div>
  </div>
  <div class="row">
        <div class="col-12 ${isMeals ? "col-md-9" : ""} m-0 p-2">${Hits({
    meals: gs.results
  })}</div>
        ${
          isMeals
            ? `<div class="col-12 col-md-3 m-0 p-2">${GlobalWidget()}</div>`
            : ""
        }
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
          <div class="col"></div>
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
        const WeekButton = ({ meal, weekday }) => {
          const active = globalInUserWeek({
            weekday: weekday.abbr,
            idMeal: meal.idMeal
          });
          return `
          <span class="btn btn-week${
            active ? " active" : ""
          }" onclick="globalToggleMeal({weekday: '${
            weekday.abbr
          }', meal: '${encodeURIComponent(
            JSON.stringify({ ...meal, strInstructions: "" })
          )}'})"><p>${weekday.abbr.slice(0, 2)}</p></span>`;
        };

        const WeekListItem = ({ meal, weekday }) => {
          const active = globalInUserWeek({
            weekday: weekday.abbr,
            idMeal: meal.idMeal
          });
          return `<li><span class="dropdown-item" onclick="globalToggleMeal({weekday: '${
            weekday.abbr
          }', meal: '${encodeURIComponent(
            JSON.stringify({ ...meal, strInstructions: "" })
          )}'})">${
            active
              ? "<i class='far fa-trash-alt'></i> Remove this from"
              : "<i class='fas fa-plus'></i> Have this on"
          } ${weekday.name}</span></li>`;
        };

        return `<div class="dropdown d-md-none">
                    <a class="" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                      <i class="fas fa-bars"></i>
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                      ${WeekListItem({
                        meal: meal,
                        weekday: { abbr: "Mon", name: "Monday" }
                      })}
                      ${WeekListItem({
                        meal: meal,
                        weekday: { abbr: "Tue", name: "Tuesday" }
                      })}
                      ${WeekListItem({
                        meal: meal,
                        weekday: { abbr: "Wed", name: "Wednesday" }
                      })}
                      ${WeekListItem({
                        meal: meal,
                        weekday: { abbr: "Thu", name: "Thursday" }
                      })}
                      ${WeekListItem({
                        meal: meal,
                        weekday: { abbr: "Fri", name: "Friday" }
                      })}
                      ${WeekListItem({
                        meal: meal,
                        weekday: { abbr: "Sat", name: "Saturday" }
                      })}
                      ${WeekListItem({
                        meal: meal,
                        weekday: { abbr: "Sun", name: "Sunday" }
                      })}
                      <li><hr class="dropdown-divider"></li>
                      <li>${
                        !globalInUserFav(meal.idMeal)
                          ? `<span class="dropdown-item" onclick="globalAddFav({meal: '${encodeURIComponent(
                              JSON.stringify({ ...meal, strInstructions: "" })
                            )}'})">Add to Favourites</<span>`
                          : `<span class="dropdown-item" onclick="globalRemoveFav(${meal.idMeal})">Remove from Favourites</span>`
                      }</li>
                    </ul>
                  </div>

                  <div class="container d-none d-md-block btn-group-week">
                    <div class="row">
                      <div class="col-3 p-0 text-center">${WeekButton({
                        meal: meal,
                        weekday: { abbr: "Mon", name: "Monday" }
                      })}</div>
                      <div class="col-3 p-0 text-center">${WeekButton({
                        meal: meal,
                        weekday: { abbr: "Tue", name: "Tuesday" }
                      })}</div>
                      <div class="col-3 p-0 text-center">${WeekButton({
                        meal: meal,
                        weekday: { abbr: "Wed", name: "Wednesday" }
                      })}</div>
                      <div class="col-3 p-0 text-center">${WeekButton({
                        meal: meal,
                        weekday: { abbr: "Thu", name: "Thursday" }
                      })}</div>
                      <div class="col-3 p-0 text-center">${WeekButton({
                        meal: meal,
                        weekday: { abbr: "Fri", name: "Friday" }
                      })}</div>
                      <div class="col-3 p-0 text-center">${WeekButton({
                        meal: meal,
                        weekday: { abbr: "Sat", name: "Saturday" }
                      })}</div>
                      <div class="col-3 p-0 text-center">${WeekButton({
                        meal: meal,
                        weekday: { abbr: "Sun", name: "Sunday" }
                      })}</div>
                      <div class="col-3 p-0 text-center"><span class="btn">${
                        !globalInUserFav(meal.idMeal)
                          ? `<i class="far fa-heart fav a-icon" onclick="globalAddFav({meal: '${encodeURIComponent(
                              JSON.stringify({ ...meal, strInstructions: "" })
                            )}'})"></i>`
                          : `<i class="fas fa-heart fav a-icon" onclick="globalRemoveFav(${meal.idMeal})"></i>`
                      }</span></div>
                    </div>
                  </div>`;
      };

      return `
      <article>
        <div class="container-fluid p-0 p-md-3">
          <div class="row">
            <div class="col p-0">
                <div class="d-flex flex-row flex-nowrap flex-grow-1 bd-highlight justify-content-start align-items-center background-grey meal-row">
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
                  <div class="me-4">${Hamburger()}</div>
                </div>
            </div>
          </div>
        </div>
      </article>
          `;
    })
    .join("\n")}
  `;
};
