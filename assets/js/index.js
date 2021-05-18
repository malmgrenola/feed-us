$(document).ready(function() {
  console.log("document Ready", session);
  render();
});

function render() {
  console.log("render called", session);
  $("#meal-data").html(renderWeek(session.data?.meals));
}

function renderWeek(meals) {
  var mealItemsHTML = [];
  const userMeals = session.data?.meals;

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
    if (!session.data?.meals) return `Loading...`;

    const mealData =
      o.abbr in session.data?.meals ? session.data?.meals[o.abbr] : null;

    const weekdayMeal = mealData
      ? `<img
      src="${mealData.strMealThumb}"
      alt="${mealData.strMeal} image"
    />
    <h4>${mealData.strMeal}</h4>`
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
