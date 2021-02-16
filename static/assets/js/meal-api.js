function query() {
  var query = $("#meal-query").val();

  $.when(
    $.getJSON(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
  ).then(
    function(response) {
      $("#meal-data").html(mealsResultHTML(response.meals));
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
  console.log(meals);
  var mealItemsHTML = meals.map(function(meal) {
    //<a href="meal.html?id=${meal.idMeal}" >${meal.strMeal}</a>
    return `<li>
              ${meal.strMeal}
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
