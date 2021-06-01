$(document).ready(function() {
  initData();
  render();
});

const render = () => {
  $("#favourites").html(IndexFavCard());
};

let indexFavListAll;

const indexToggleFavListAll = () => {
  indexFavListAll = !indexFavListAll;
  render();
};
const IndexFavCard = () => {
  const favourites = session.data ? session.data.favlist : [];

  const FavList = () => {
    return favourites
      .sort((a, b) => {
        const sA = a.strMeal.toUpperCase(),
          sB = b.strMeal.toUpperCase(); // ignore upper and lowercase
        if (sA < sB) return -1;
        if (sA > sB) return 1;
        return 0;
      })
      .slice(0, indexFavListAll ? favourites.length : 8)
      .map(meal => {
        return FavItem(meal);
      })
      .join("\n");
  };

  const FavItem = meal => {
    return `
    <div class="d-flex flex-row">
      <p class="w-100 bd-highlight"><a href="meal.html?m=${meal.idMeal}">${
      meal.strMeal
    }</a></p>
      <div class="dropdown flex-shrink-1 bd-highlight">
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
          <li><span class="dropdown-item" onclick="globalRemoveFav(${
            meal.idMeal
          })"><i class="fas fa-trash-alt"></i> Remove From Favourites</a></li>
        </ul>
      </div>
  </div>`;
  };

  if (!favourites)
    return `
      <div class="col-12 col-lg-3">
      <div class="card h-100">
      <div class="card-header text-center">
        <h3>Favourites <i class="fas fa-heart fav"></i></h3>
      </div>
      <div class="card-body">
        <p class="card-text text-muted">No favs yet</p>
      </div>
    </div>
    </div>
      `;

  return `
    <div class="card h-100" >
      <div class="card-header text-center">
        <h3>Favourites <i class="fas fa-heart fav"></i></h3>
      </div>
      <div class="card-body favs">
        <div class="d-flex flex-row text-muted">
          <p class="w-100 bd-highlight">You have ${
            favourites.length
          } favourites</p>
          <div class="flex-shrink-1 bd-highlight" onclick="indexToggleFavListAll()"><i class="fas ${
            !indexFavListAll ? "fa-expand-alt" : "fa-compress-alt"
          }"></i></div>
        </div>
      ${FavList()}
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
    } image"></div>
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
