function query() {
  var query = $("#meal-query").val();

  $.when(
    $.getJSON(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
  ).then(
    function(response) {
      $("#meal-data").html(mealsResultHTML(response.meals));
      $("#meal-data").on("click", ".qWeek li", function(event) {
        console.log(
          event.target.dataset.weekday,
          event.target.dataset.mealid,
          event.target.dataset
        );
        setMealData(event.target.dataset);
      });
      render();
    },
    function(errorResponse) {
      console.log(errorResponse);
      $("#meal-data").html(
        `<h2>Error: ${errorResponse.responseJSON.message}</h2>`
      );
    }
  );
}

function mealsResultHTML(meals) {
  if (meals == null) {
    return `No meals found`;
  }
  var mealItemsHTML = meals.map(function(meal, i) {
    //<a href="meal.html?id=${meal.idMeal}" >${meal.strMeal}</a>

    function ingString(ingredient) {
      const pm = meals.length - 1 !== i ? ", " : "";
      return ingredient !== "" ? ingredient + pm : "";
    }
    let ingridients = [];

    for (let i = 1; i <= 20; i++) {
      if (meal[`strIngredient${i}`] !== "") {
        ingridients.push(meal[`strIngredient${i}`]);
      }
    }
    return `<li>
      <img
        src="${meal.strMealThumb}"
        alt="${meal.strMeal} image"
      />
      <h4><a href="/meal.html?m=${meal.idMeal}">${meal.strMeal}</a></h4>
      <p>${ingridients.join(", ")}</p>
      <ul class="qWeek">
        <li data-weekday="Mon" data-mealid="${
          meal.idMeal
        }" data-meal="${encodeURIComponent(JSON.stringify(meal))}">Mon</li>
        <li data-weekday="Tue" data-mealid="${
          meal.idMeal
        }" data-meal="${encodeURIComponent(JSON.stringify(meal))}">Tue</li>
        <li data-weekday="Wed" data-mealid="${
          meal.idMeal
        }" data-meal="${encodeURIComponent(JSON.stringify(meal))}">Wed</li>
        <li data-weekday="Thu" data-mealid="${
          meal.idMeal
        }" data-meal="${encodeURIComponent(JSON.stringify(meal))}">Thu</li>
        <li data-weekday="Fri" data-mealid="${
          meal.idMeal
        }" data-meal="${encodeURIComponent(JSON.stringify(meal))}">Fri</li>
        <li data-weekday="Sat" data-mealid="${
          meal.idMeal
        }" data-meal="${encodeURIComponent(JSON.stringify(meal))}">Sat</li>
        <li data-weekday="Sun" data-mealid="${
          meal.idMeal
        }" data-meal="${encodeURIComponent(JSON.stringify(meal))}">Sun</li>
        <li data-weekday="Fav" data-mealid="${
          meal.idMeal
        }" data-meal="${encodeURIComponent(JSON.stringify(meal))}">Fav</li>
      </ul>
    </li>`;
  });

  return `<div">
  <p><strong>${meals.length} meals found:</strong></p>
  <ul>
    ${mealItemsHTML.join("\n")}
  </ul>
  </div>`;
}

$(document).ready(function() {
  $("#meal-query").keyup(function(event) {
    if (event.which == 13) {
      query();
    }
  });
});

function getMeal(id) {
  //www.themealdb.com/api/json/v1/1/lookup.php?i=52772
  return $.getJSON(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
}
