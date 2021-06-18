$(document).ready(function() {
  initData();
  render();
});

const render = () => {
  $("#week").html(`<div class="container-fluid">${Page()}</div>`);
};

const Page = () => {
  return `
  <header>
    <div class="row">
      <div class="col text-center">
        <h1>Feed Us!</h1>
      </div>
    </div>
    <div class="row">
      <div class="col text-center pb-3">
        <h2>Week schedule</h2>
      </div>
    </div>
  </header>
  <div class="row">
        <div class="col px-0">${Week()}</div>
  </div>
  `;
};

const Week = () => {
  return `
  <div class="container-fluid">
    <div class="row">${globalWeekdays
      .map(weekday => {
        return `
        <div class="col-12 col-lg-3 p-2">
          <article>
            ${IndexCard({ weekday: weekday })}
          </article>
        </div>`;
      })
      .join("\n")}
        <div class="col-12 col-lg-3 p-2">
          <article>
            ${IndexFavCard()}
          </article>
        </div>
      </div>
    </div>
    `;
};

const IndexCard = ({ weekday }) => {
  // Content used while loading data for the current weekday
  const LoadingCard = () => {
    return `
    <div class="card h-100">
      <div class="card-header text-center">
        <h3>${weekday.name}</h3>
      </div>
      <div class="card-body">
        <p class="card-text text-muted">Loading awesome dishes...</p>
      </div>
    </div>
    `;
  };

  // Content used when nothing is selected for the current weekday
  const EmptyCard = () => {
    return `
      <div class="card h-100">
        <div class="card-header text-center">
        <h3>${weekday.name}</h3>
        </div>
        <div class="card-body">
          <div class="d-flex flex-column justify-content-center align-items-center h-100">
            <p>No dish selected yet.</p>
            <button
            type="button"
            class="btn btn-secondary btn-sm"
            onclick="globalSetRandomMeal('${weekday.abbr}')"
            >Set a random dish! <i class="fas fa-random"></i></button>
          </div>
        </div>
      </div>
    `;
  };
  const userMeals = session.data ? session.data.meals : null;
  if (!userMeals) return LoadingCard();
  const meal = weekday.abbr in userMeals ? userMeals[weekday.abbr] : null;
  if (!meal) return EmptyCard();

  const Favicon = () => {
    return !globalInUserFav(meal.idMeal)
      ? `<i class="far fa-heart fav a-icon" onclick="globalAddFav({meal: '${encodeURIComponent(
          JSON.stringify({ ...meal, strInstructions: "" })
        )}'})"></i>`
      : `<i class="fas fa-heart fav a-icon" onclick="globalRemoveFav(${meal.idMeal})"></i>`;
  };

  // Content used when dish is selected for the current weekday
  return `
  <div class="card h-100" >
    <div class="card-header text-center">
      <h3>${weekday.name}</h3>
    </div>
    <div class="card-image">
      <div class="hidden_icon d-flex flex-column justify-content-center align-items-center text-center h-100 w-100">

      <button
      type="button"
      class="btn btn-secondary btn-sm"
      onclick="globalRemoveMealData({
        mealid: '${meal.idMeal}',
        weekday: '${weekday.abbr}'
      })"
      >Clear dish! <i class="far fa-times-circle"></i></button>

      <button
      type="button"
      class="btn btn-secondary btn-sm"
      onclick="globalSetRandomMeal('${weekday.abbr}')"
      >Set a new random dish! <i class="fas fa-random"></i></button>

      </div>
    <img src="${meal.strMealThumb}" class="card-img-top" alt="${
    meal.strMeal
  } image">
    </div>
    <div class="card-body">
      <div class="d-flex flex-row">
      <h5 class="card-title"><a href="meal.html?m=${meal.idMeal}">${
    meal.strMeal
  }</a></h5>
      <span style="font-size: 1.25rem;">${Favicon()}
      </span>
      </div>
      <p class="card-text text-muted">This ${
        meal.strCategory
      } dish is from the ${meal.strArea} area </p>

    ${
      meal.strTags
        ? `<p class="card-text">${meal.strTags
            .split(",")
            .map(tag => {
              return `<span class="badge bg-primary m-1">${tag}</span>`;
            })
            .join("")}</p>`
        : ""
    }
    </div>
  </div>
`;
};

let weekFavListAll; // Page state

const weekToggleFavListAll = () => {
  weekFavListAll = !weekFavListAll;
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
      .slice(0, weekFavListAll ? favourites.length : 8)
      .map(meal => {
        return FavItem(meal);
      })
      .join("\n");
  };

  const FavItem = meal => {
    return `
    <div class="d-flex flex-row">
      <p class="w-100 bd-highlight fav-item"><a href="meal.html?m=${
        meal.idMeal
      }">${meal.strMeal}</a></p>
      <div class="dropdown flex-shrink-1 bd-highlight">
        <a class="" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
          <i class="fas fa-bars"></i>
        </a>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
          <li><span class="dropdown-item" onclick="globalToggleMeal({weekday: 'Mon', meal: '${encodeURIComponent(
            JSON.stringify({ ...meal, strInstructions: "" })
          )}'})">Have this on Monday</span></li>
          <li><span class="dropdown-item" onclick="globalToggleMeal({weekday: 'Tue', meal: '${encodeURIComponent(
            JSON.stringify({ ...meal, strInstructions: "" })
          )}'})">Have this on Tuesday</span></li>
          <li><span class="dropdown-item" onclick="globalToggleMeal({weekday: 'Wed', meal: '${encodeURIComponent(
            JSON.stringify({ ...meal, strInstructions: "" })
          )}'})">Have this on Wednesday</span></li>
          <li><span class="dropdown-item" onclick="globalToggleMeal({weekday: 'Thu', meal: '${encodeURIComponent(
            JSON.stringify({ ...meal, strInstructions: "" })
          )}'})">Have this on Thursday</span></li>
          <li><span class="dropdown-item" onclick="globalToggleMeal({weekday: 'Fri', meal: '${encodeURIComponent(
            JSON.stringify({ ...meal, strInstructions: "" })
          )}'})">Have this on Friday</span></li>
          <li><span class="dropdown-item" onclick="globalToggleMeal({weekday: 'Sat', meal: '${encodeURIComponent(
            JSON.stringify({ ...meal, strInstructions: "" })
          )}'})">Have this on Saturday</span></li>
          <li><span class="dropdown-item" onclick="globalToggleMeal({weekday: 'Sun', meal: '${encodeURIComponent(
            JSON.stringify({ ...meal, strInstructions: "" })
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
        <h3>My Favourites <a href="favourites.html" target="_self"><i class="fas fa-expand-alt a-icon"></i></a></h3>
      </div>
      <div class="card-body favs">
        <div class="d-flex bd-highlight">
          <div class="flex-grow-1 bd-highlight align-self-center text-muted">You have ${
            favourites.length
          } favourites</div>

          ${
            favourites.length > 8
              ? `<div class="bd-highlight align-self-center">
            <button
            type="button"
            class="btn text-muted fav-toggle"
            onclick="weekToggleFavListAll()"
            >${
              !weekFavListAll
                ? 'See all <i class="fas fa-expand-alt a-icon"></i>'
                : 'See less <i class="fas fa-compress-alt a-icon"></i>'
            }</button>

          </div>`
              : ""
          }
        </div>
      ${FavList()}
      </div>
    </div>
`;
};
