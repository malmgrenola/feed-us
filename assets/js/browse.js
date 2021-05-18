$(document).ready(function() {
  initData();
  $("#meal-query").keyup(function(event) {
    if (event.which == 13) {
      browseQuery();
    }
  });
});

function render() {
  //console.log("render called");
  if (session.data.meals) {
    const userMeals = session.data.meals;

    // Clear all states to default
    $(`li.qWeek`).css("font-weight", "normal");

    // Set states on page
    for (const date in userMeals) {
      $(
        `li.qWeek[data-weekday='${date}'][data-mealid='${userMeals[date]?.idMeal}']`
      ).css("font-weight", "bold");
    }
  }
}

function browseQuery() {
  var query = $("#meal-query").val();
  mealApiSearch(query)
    .then(response => {
      $("#meal-data").html(mealsResultHTML(response.meals));
      $("#meal-data").on("click", ".qWeek", function(event) {
        browseToggleMealData(event.target.dataset);
      });
      render();
    })
    .catch(errorResponse => {
      $("#meal-data").html(
        `<h2>Error: ${errorResponse.responseJSON.message}</h2>`
      );
    });

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
        <h4><a href="meal.html?m=${meal.idMeal}">${meal.strMeal}</a></h4>
        <p>${ingridients.join(", ")}</p>
        <ul>
          <li data-weekday="Mon" data-mealid="${
            meal.idMeal
          }" data-meal="${encodeURIComponent(JSON.stringify(meal))}" class="qWeek">Mon</li>
          <li data-weekday="Tue" data-mealid="${
            meal.idMeal
          }" data-meal="${encodeURIComponent(JSON.stringify(meal))}" class="qWeek">Tue</li>
          <li data-weekday="Wed" data-mealid="${
            meal.idMeal
          }" data-meal="${encodeURIComponent(JSON.stringify(meal))}" class="qWeek">Wed</li>
          <li data-weekday="Thu" data-mealid="${
            meal.idMeal
          }" data-meal="${encodeURIComponent(JSON.stringify(meal))}" class="qWeek">Thu</li>
          <li data-weekday="Fri" data-mealid="${
            meal.idMeal
          }" data-meal="${encodeURIComponent(JSON.stringify(meal))}" class="qWeek">Fri</li>
          <li data-weekday="Sat" data-mealid="${
            meal.idMeal
          }" data-meal="${encodeURIComponent(JSON.stringify(meal))}" class="qWeek">Sat</li>
          <li data-weekday="Sun" data-mealid="${
            meal.idMeal
          }" data-meal="${encodeURIComponent(JSON.stringify(meal))}" class="qWeek">Sun</li>
          <li>Fav</li>
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
}

// function browseSetMealData(props) {
//   session.data.meals[props.weekday] = JSON.parse(
//     decodeURIComponent(props.meal)
//   );
//
//   fbSetDoc(session.id, session.data).catch(error => {
//     console.error("Error writing document: ", error);
//   });
//   render();
// }

function browseToggleMealData(props) {
  const meal =
    session.data.meals[props.weekday] !== null
      ? null
      : JSON.parse(decodeURIComponent(props.meal));

  session.data.meals[props.weekday] = meal;

  fbSetDoc(session.id, session.data).catch(error => {
    console.error("Error writing document: ", error);
  });
  render();
}
