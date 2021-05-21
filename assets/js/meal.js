let meal;

$(document).ready(function() {
  initData();
  const m = globalGetUrlParam("m");
  if (m !== "") mealGet(m);
  render();
});

const mealGet = id => {
  globalSetUrlParam("m", id);

  mealApiLookup(id)
    .then(data => {
      if (data.meals) {
        meal = data.meals[0];
        console.log(meal);
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
  $("#meal-data").html(Meal);
};

const Meal = () => {
  const m = globalGetUrlParam("m");

  const Title = () => {
    return `<h3><span class="me-4">${
      !globalInUserFav(meal.idMeal)
        ? `<i class="far fa-heart fav" onclick="globalAddFav({meal: '${encodeURIComponent(
            JSON.stringify(meal)
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
    <h4>Ingridients</h4>
    <ul>${ingridients
      .map(({ ingridient, messure }) => {
        return `<li><strong>${ingridient}</strong> - ${messure}</li>`;
      })
      .join("\n")} </ul>`;
  };

  const Image = () => {
    return `<img
                class="rounded-circle"
                src="${meal.strMealThumb}"
                alt="${meal.strMeal} image"
              />`;
  };

  const Instructions = () => {
    return `
    <div class="container">
      <div class="row">
        <div class="col-9">
          <div class=""><h4>Instructions</h4></div>
          <div class="">
            ${
              meal.strYoutube != ""
                ? `<p><a href="${meal.strYoutube}" target="_blank">Watch video</a></p>`
                : "<p>&nbsp;<p>"
            }
          </div>
        </div>
        <div class="col-3">${Image()}</div>
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
  <div class="row">
    <div class="col">${Title()}</div>
  </div>
  <div class="row">
    <div class="col">${Category()}</div>
  </div>
  <div class="row">
    <div class="col">${Tags()}</div>
  </div>
  <div class="row">
    <div class="col-3 meal-border mx-2 py-4">${Ingridients()}</div>
    <div class="col-8 meal-border mx-2 py-4">${Instructions()}</div>
  </div>
  `;
};
