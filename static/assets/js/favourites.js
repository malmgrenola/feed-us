$(document).ready(function() {
  initData();
  render();
});

const render = () => {
  $("#favourites").html(Page());
};

let indexFavListAll;

const indexToggleFavListAll = () => {
  indexFavListAll = !indexFavListAll;
  render();
};
const Page = () => {
  const favourites = session.data
    ? session.data.favlist.sort((a, b) => {
        const sA = a.strMeal.toUpperCase(),
          sB = b.strMeal.toUpperCase(); // ignore upper and lowercase
        if (sA < sB) return -1;
        if (sA > sB) return 1;
        return 0;
      })
    : [];
  return `
      <div class="row">
        <div class="col text-center">
          <h1>Feed Us!</h1>
        </div>
      </div>
      <div class="row">
        <div class="col text-center">
          <h2>All your favourites</h2>
        </div>
      </div>
      <div class="row">
            <div class="col-12 m-0 p-2">${Favourites({
              meals: favourites
            })}</div>
      </div>
      `;
};

const Favourites = ({ meals }) => {
  if (!session.data)
    return `
      <div class="container-fluid p-0 p-md-3 text-center text-muted">
        <div class="row">
          <div class="col">Loading...</div>
        </div>
      </div>
        `;

  if (meals.length === 0)
    return `
      <div class="container-fluid p-0 p-md-3 text-center text-muted">
        <div class="row">
          <div class="col text-muted">
          <p>No Favourite selected yet!</p>
          <p>You can add any dish to your <i class="fas fa-heart fav"></i> favourites list</p>
          </div>
        </div>
      </div>
        `;

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
          }" onclick="globalSetMeal({weekday: '${
            weekday.abbr
          }', meal: '${encodeURIComponent(
            JSON.stringify(meal)
          )}'})"><p>${weekday.abbr.slice(0, 2)}</p></span>`;
        };

        const WeekListItem = ({ meal, weekday }) => {
          const active = globalInUserWeek({
            weekday: weekday.abbr,
            idMeal: meal.idMeal
          });
          return `<li><span class="dropdown-item" onclick="globalSetMeal({weekday: '${
            weekday.abbr
          }', meal: '${encodeURIComponent(JSON.stringify(meal))}'})">${
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
                          ? `<i class="far fa-heart fav" onclick="globalAddFav({meal: '${encodeURIComponent(
                              JSON.stringify(meal)
                            )}'})"></i>`
                          : `<i class="fas fa-heart fav" onclick="globalRemoveFav(${meal.idMeal})"></i>`
                      }</span></div>
                    </div>
                  </div>`;
      };

      return `
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

// const FavList = () => {
//   const FavItem = meal => {
//     return `
//     <div class="d-flex flex-row">
//       <p class="w-100 bd-highlight"><a href="meal.html?m=${meal.idMeal}">${
//       meal.strMeal
//     }</a></p>
//       <div class="dropdown flex-shrink-1 bd-highlight">
//         <a class="" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
//           <i class="fas fa-bars"></i>
//         </a>
//         <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
//           <li><span class="dropdown-item" onclick="globalSetMeal({weekday: 'Mon', meal: '${encodeURIComponent(
//             JSON.stringify(meal)
//           )}'})">Have this on Monday</span></li>
//           <li><span class="dropdown-item" onclick="globalSetMeal({weekday: 'Tue', meal: '${encodeURIComponent(
//             JSON.stringify(meal)
//           )}'})">Have this on Tuesday</span></li>
//           <li><span class="dropdown-item" onclick="globalSetMeal({weekday: 'Wed', meal: '${encodeURIComponent(
//             JSON.stringify(meal)
//           )}'})">Have this on Wednesday</span></li>
//           <li><span class="dropdown-item" onclick="globalSetMeal({weekday: 'Thu', meal: '${encodeURIComponent(
//             JSON.stringify(meal)
//           )}'})">Have this on Thursday</span></li>
//           <li><span class="dropdown-item" onclick="globalSetMeal({weekday: 'Fri', meal: '${encodeURIComponent(
//             JSON.stringify(meal)
//           )}'})">Have this on Friday</span></li>
//           <li><span class="dropdown-item" onclick="globalSetMeal({weekday: 'Sat', meal: '${encodeURIComponent(
//             JSON.stringify(meal)
//           )}'})">Have this on Saturday</span></li>
//           <li><span class="dropdown-item" onclick="globalSetMeal({weekday: 'Sun', meal: '${encodeURIComponent(
//             JSON.stringify(meal)
//           )}'})">Have this on Sunday</span></li>
//           <li><hr class="dropdown-divider"></li>
//           <li><span class="dropdown-item" onclick="globalRemoveFav(${
//             meal.idMeal
//           })"><i class="fas fa-trash-alt"></i> Remove From Favourites</a></li>
//         </ul>
//       </div>
//   </div>`;
//   };
//
//   if (!favourites)
//     return `
//       <div class="col-12 col-lg-3">
//       <div class="card h-100">
//       <div class="card-header text-center">
//         <h3>Favourites <i class="fas fa-heart fav"></i></h3>
//       </div>
//       <div class="card-body">
//         <p class="card-text text-muted">No favs yet</p>
//       </div>
//     </div>
//     </div>
//       `;
//
//   return `
//     <div class="card h-100" >
//       <div class="card-header text-center">
//         <h3>Favourites <i class="fas fa-heart fav"></i></h3>
//       </div>
//       <div class="card-body favs">
//         <div class="d-flex flex-row text-muted">
//           <p class="w-100 bd-highlight">You have ${
//             favourites.length
//           } favourites</p>
//           <div class="flex-shrink-1 bd-highlight" onclick="indexToggleFavListAll()"><i class="fas ${
//             !indexFavListAll ? "fa-expand-alt" : "fa-compress-alt"
//           }"></i></div>
//         </div>
//       ${FavList()}
//       </div>
//     </div>
// `;
// };
