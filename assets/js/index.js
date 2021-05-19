$(document).ready(function() {
  initData();
  render();
});

const render = () => {
  $("#meal-data").html(Index);
};

const indexRemoveMealData = ({ weekday }) => {
  session.data.meals[weekday] = null;
  fbSetDoc(session.id, session.data).catch(error => {
    console.error("Error writing document: ", error);
  });
  render();
};

const Index = () => {
  const weekdays = [
    { abbr: "Mon", name: "Monday" },
    { abbr: "Tue", name: "Tuesday" },
    { abbr: "Wed", name: "Wednesday" },
    { abbr: "Thu", name: "Thursday" },
    { abbr: "Fri", name: "Friday" },
    { abbr: "Sat", name: "Saturday" },
    { abbr: "Sun", name: "Sunday" }
  ];

  return `
    <div class="row row-cols-1 row-cols-md-2 g-4">
        ${weekdays
          .map(weekday => {
            return IndexCard({ weekday: weekday });
          })
          .join("\n")}
    </div>`;
};

const IndexCard = ({ weekday }) => {
  const userMeals = session.data ? session.data.meals : null;

  if (!userMeals) {
    return `
      <div class="col-12 col-md-3">
      <div class="card h-100">
      <div class="card-header text-center">
        <h3>${weekday.name}</h3>
      </div>
      <div class="card-body">
        <p class="card-text text-muted">Loading...</p>
      </div>
    </div>
    </div>
      `;
  }

  const meal = weekday.abbr in userMeals ? userMeals[weekday.abbr] : null;

  if (!meal) {
    return `
    <div class="col-12 col-md-3">
      <div class="card h-100">
      <div class="card-header text-center">
        <h3>${weekday.name}</h3>
      </div>
      <div class="card-body">
        <p class="card-text text-muted">No dish selected</p>
      </div>
    </div>
    </div>
      `;
  }

  let ingridients = [];
  if (meal) {
    for (let i = 1; i <= 20; i++) {
      if (meal[`strIngredient${i}`] !== "") {
        ingridients.push(meal[`strIngredient${i}`]);
      }
    }
  }

  return `<div class="col-12 col-md-3">
  <div class="card h-100" >
  <div class="card-header text-center">
    <h3>${weekday.name}</h3>
  </div>
  <img src="${meal.strMealThumb}" class="card-img-top" alt="${
    meal.strMeal
  } image">
  <div class="card-body">
    <h5 class="card-title"><a href="#">${
      meal.strMeal
    }</a>  <i class="far fa-times-circle" onclick="indexRemoveMealData({mealid: '${
    meal.idMeal
  }', weekday: '${weekday.abbr}'})"></i></h5>
    <p class="card-text text-muted">${ingridients.join(", ")}</p>
  </div>
</div>
</div>
`;
};
