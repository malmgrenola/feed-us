let mealData = {};

$(document).ready(function() {
  initData();

  let searchParams = new URLSearchParams(window.location.search);
  mealData.param = searchParams.has("m") ? searchParams.get("m") : null;

  if (mealData.param) {
    mealApiLookup(mealData.param).done(data => {
      mealData.meal = data.meals[0];
    });
  }
});

function render() {
  //console.log("render called");
  const meal = mealData.meal;

  if (!meal) {
    return $("#meal-data").html(`<p>Meal can't be loaded</p>`);
  }
  $("#meal-data").html(`
    <div>${meal.strCategory}</div>
    <h1> ${meal.strMeal} <i class="far fa-heart"></i></h1>
    <div>
    <h2>Ingredients</h2>
    ${listIngridients(meal)}
    </div>
    <div>
    <img>
    <h2>Instructions</h2>
    <img
      src="${meal.strMealThumb}"
      alt="${meal.strMeal} image"
    />
        ${
          meal.strYoutube != ""
            ? `<a href="${meal.strYoutube}" target="_blank">Watch video</a>`
            : ""
        }
        <p>${meal.strInstructions.replaceAll("\r\n", "<br />")}</p>
    </div>
    `);
}

function listIngridients(meal) {
  let ingridients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`] !== "") {
      ingridients.push(
        `<li>${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}</li>`
      );
    }
  }

  return `
  <ul>${ingridients.join("\n")}</ul>
  `;
}
