let meal;

$(document).ready(function() {
  initData();
  const m = gs.getUrlParam("m");
  if (m !== "") mealGet(m);
  render();
});

const mealGet = id => {
  gs.setUrlParam("m", id);

  mealApiLookup(id)
    .then(data => {
      if (data.meals) {
        meal = data.meals[0];
      }
      render();
    })
    .catch(errorResponse => {
      $("#search-content").html(
        `<h2>Error: ${errorResponse.responseJSON.message}</h2>`
      );
    });
};

const render = () => {
  $("#meal").html(Page);
};

const Page = () => {
  const m = gs.getUrlParam("m");

  const Title = () => {
    return `<h3><span class="me-4">${
      !globalInUserFav(meal.idMeal)
        ? `<i class="far fa-heart fav" onclick="globalAddFav({meal: '${encodeURIComponent(
            JSON.stringify({ ...meal, strInstructions: "" })
          )}'})"></i>`
        : `<i class="fas fa-heart fav" onclick="globalRemoveFav(${meal.idMeal})"></i>`
    }
                </span> ${meal.strMeal} </h3>`;
  };

  const Ingridients = () => {
    let ingridients = [];

    for (let i = 1; i <= 20; i++) {
      const ingridient = meal[`strIngredient${i}`];
      const messure = meal[`strMeasure${i}`];
      if (ingridient !== "" && ingridient !== null) {
        ingridients.push({
          ingridient: ingridient,
          messure: messure
        });
      }
    }
    return `
    <div class="container-fluid meal-border">
      <div class="row">
        <div class="col my-3">
          <h4>Ingredients</h4>
          <ul>${ingridients
            .map(({ ingridient, messure }) => {
              return `
                <li class="d-flex align-items-center bd-highlight">
                  <div class="w-50 bd-highlight"><strong>${ingridient}</strong></div>
                  <div class="bd-highlight w-50 text-end">${messure}</div>
                </li>`;
            })
            .join("\n")} </ul>
        </div>
      </div>
    </div>

      `;
  };

  const Image = () => {
    return `<img
                class="rounded-circle img-responsive"
                src="${meal.strMealThumb}"
                alt="${meal.strMeal} image"
              />`;
  };

  const Instructions = () => {
    return `
    <div class="container-fluid meal-border">
      <div class="row">
        <div class="col d-flex align-items-center">
          <div class="flex-grow-1">
            <div class=""><h4>Instructions</h4></div>
              <div class="">
                ${
                  meal.strYoutube != ""
                    ? `<p><a href="${meal.strYoutube}" target="_blank">Watch video</a></p>`
                    : "<p>&nbsp;<p>"
                }
              </div>
            </div>
            <div class="flex-shrink-0">${Image()}</div>
          </div>
      </div>
      <div class="row">
        <div class="col-12">
          <p>${meal.strInstructions.replaceAll("\r\n", "<br /><br />")}</p>
        </div>
      </div>
    </div>
    `;
  };
  const Category = () => {
    return `This <strong>${meal.strCategory}</strong> dish is from the <strong>${meal.strArea}</strong> area.`;
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

  if (!meal) return "";

  return `
  <div class="container-fluid">
    <header>
      <div class="row">
        <div class="col">${Title()}</div>
      </div>
      <div class="row">
        <div class="col">${Category()}</div>
      </div>
      <div class="row">
        <div class="col">${Tags()}</div>
      </div>
    </header>
    <article>
      <div class="row">
          <div class="col-12 col-md-4 p-2">${Ingridients()}</div>
          <div class="col-12 col-md-8 p-2">${Instructions()}</div>
      </div>
    </article>
  </div>
  `;
};
