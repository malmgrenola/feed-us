$(document).ready(function() {
  initData();
  $("#meal-data").html("Loading...");
});

function render() {
  //console.log("render called");
  $("#meal-data").html(renderWeek(session.data.meals));
}

function renderWeek(meals) {
  var mealItemsHTML = [];
  const userMeals = session.data.meals;

  const weekdays = [
    { abbr: "Mon", name: "Monday" },
    { abbr: "Tue", name: "Tuesday" },
    { abbr: "Wed", name: "Wednesday" },
    { abbr: "Thu", name: "Thursday" },
    { abbr: "Fri", name: "Friday" },
    { abbr: "Sat", name: "Saturday" },
    { abbr: "Sun", name: "Sunday" }
  ];

  weekdays.map(o => {
    if (!session.data.meals) return `Loading...`;

    const meal =
      o.abbr in session.data.meals ? session.data.meals[o.abbr] : null;

    let ingridients = [];
    if (meal) {
      for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`] !== "") {
          ingridients.push(meal[`strIngredient${i}`]);
        }
      }
    }

    const weekdayMeal = meal
      ? `<img
      src="${meal.strMealThumb}"
      alt="${meal.strMeal} image"
    />
    <h4><a href="meal.html?m=${meal.idMeal}">${
          meal.strMeal
        }</a> <i class="far fa-times-circle" onclick="indexRemoveMealData({mealid: '${
          meal.idMeal
        }', weekday: '${o.abbr}'})"></i></h4>
<p>${ingridients.join(", ")}</p>
    `
      : `<small>No dish selected</small>`;

    mealItemsHTML.push(`
        <li>
          <h3>${o.name}</h3>
          ${weekdayMeal}
        </li>
        `);
  });
  return `<ul>${mealItemsHTML.join("\n")}</ul>`;
}
function indexRemoveMealData(props) {
  session.data.meals[props.weekday] = null;
  fbSetDoc(session.id, session.data).catch(error => {
    console.error("Error writing document: ", error);
  });
  render();
}
