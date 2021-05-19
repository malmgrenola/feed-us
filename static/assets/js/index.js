$(document).ready(function() {
  initData();
  render();
});

function render() {
  //console.log("render called");
  $("#meal-data").html(indexRenderWeek());
}

function indexRenderWeek(meals) {
  let mealItemsHTML = [];

  const userMeals = session.data ? session.data.meals : null;

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
    if (!userMeals) {
      mealItemsHTML.push(`
        <li>
          <h3>${o.name}</h3>
          <small>Loading...</small>
        </li>
        `);
      return;
    }

    const meal = o.abbr in userMeals ? userMeals[o.abbr] : null;

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
