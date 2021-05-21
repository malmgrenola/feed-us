$(document).ready(function() {
  initData();
  render();
});

const render = () => {
  //console.log("Render", session);
  $("#meal-data").html(Index);
};

const indexRemoveMealData = ({ weekday }) => {
  session.data.meals[weekday] = null;
  fbSetDoc(session.id, session.data).catch(error => {
    console.error("Error writing document: ", error);
  });
  render();
};

const indexSetRandomMeal = weekday => {
  mealApiRandom()
    .then(response => {
      const meal = response.meals[0];

      session.data.meals[weekday] = meal;
      fbSetDoc(session.id, session.data).catch(error => {
        console.error("Error writing document: ", error);
      });
      render();
    })
    .catch(errorResponse => {
      console.error(errorResponse);
    });
};

function drag(ev) {
  var ghost = document.createElement("canvas");
  ghost.id = "drag-ghost";
  document.body.append(ghost);
  var context = ghost.getContext("2d");

  ghost.width = 200;
  ghost.height = 100;

  context.fillStyle = "white";
  context.fillRect(0, 0, ghost.width, ghost.height);

  context.fillStyle = "black";
  //context.font = "bold 13px Arial";
  context.fillText("DRAGGING...", 0, 15);

  event.dataTransfer.setData("text", "lorem ipsum");
  event.dataTransfer.effectAllowed = "copy";
  event.dataTransfer.setDragImage(ghost, 100, 50);
}
function dragEnd(ev) {
  var ghost = document.getElementById("drag-ghost");
  if (ghost.parentNode) {
    ghost.parentNode.removeChild(ghost);
  }
}

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
  <div class="row">
    <div class="col text-center">
      <h1>Feed Us!</h1>
    </col>
    <div class="col text-center">
      <h2>What's for dinner this week?</h2>
    </div>
  </div>
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
        ${weekdays
          .map(weekday => {
            return IndexCard({ weekday: weekday });
          })
          .join("\n")}
          ${IndexFavCard()}
    </div>`;
};

const IndexCard = ({ weekday }) => {
  const userMeals = session.data ? session.data.meals : null;

  if (!userMeals)
    return `
      <div class="col-12 col-lg-3">
      <div class="card h-100">
      <div class="card-header text-center">
        <h3>${weekday.name}</h3>
      </div>
      <div class="card-body">
        <p class="card-text text-muted">Loading awsome dishes...</p>
      </div>
    </div>
    </div>
      `;

  const meal = weekday.abbr in userMeals ? userMeals[weekday.abbr] : null;

  if (!meal) {
    return `
    <div class="col-12 col-lg-3">
      <div class="card h-100">
      <div class="card-header text-center">
        <h3>${weekday.name}</h3>
      </div>
      <div class="card-body">
        <p class="card-text text-muted">No dish selected</p>
        <p class="card-text text-muted">Set a random dish </p>
        <p><span class="btn btn-primary" onclick="indexSetRandomMeal('${weekday.abbr}')"><i class="fas fa-random"></i></span></p>
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

  return `<div class="col-12 col-lg-3">
  <div class="card h-100" >
  <div class="card-header text-center">
    <h3>${weekday.name}</h3>
  </div>
  <div class="card-image">
  <div class="hidden_icon d-flex flex-row">
    <span onclick="indexSetRandomMeal('${
      weekday.abbr
    }')"><i class="fas fa-random"></i></span>
    <span onclick="indexRemoveMealData({mealid: '${meal.idMeal}', weekday: '${
    weekday.abbr
  }'})"><i class="far fa-times-circle"></i></span>
  </div>


  <img src="${meal.strMealThumb}" class="card-img-top" alt="${
    meal.strMeal
  } image">
  </div>
  <div class="card-body">
    <div class="d-flex flex-row">
    <h5 class="card-title"><a href="meal.html?m=${meal.idMeal}">${
    meal.strMeal
  }</a></h5>
  <span style="font-size: 1.25rem;">${
    !globalInUserFav(meal.idMeal)
      ? `<i class="far fa-heart fav" onclick="globalAddFav({meal: '${encodeURIComponent(
          JSON.stringify(meal)
        )}'})"></i>`
      : `<i class="fas fa-heart fav" onclick="globalRemoveFav(${meal.idMeal})"></i>`
  }
  </span>
  </div>
    <p class="card-text text-muted">This ${meal.strCategory} dish is from the ${
    meal.strArea
  } area </p>

  ${
    meal.strTags
      ? `<p class="card-text">${meal.strTags
          .split(",")
          .map(tag => {
            return `<span class="badge bg-primary m-1">${tag}</span>`;
          })
          .join("")}</p>`
      : ""
  }
  </div>
</div>
</div>
`;
};

const IndexFavCard = () => {
  const favourites = session.data ? session.data.favlist : null;

  if (!favourites)
    return `
      <div class="col-12 col-lg-3">
      <div class="card h-100">
      <div class="card-header text-center">
        <h3>Favourites <i class="fas fa-heart fav"></i></h3>
      </div>
      <div class="card-body">
        <p class="card-text text-muted">No favs yet</p>
      </div>
    </div>
    </div>
      `;

  return `
  <div class="col-12 col-lg-3">
  <div class="card h-100" >
  <div class="card-header text-center">
    <h3>Favourites <i class="fas fa-heart fav"></i></h3>
  </div>
  <div class="card-body favs">
  ${favourites
    .sort((a, b) => {
      const sA = a.strMeal.toUpperCase(),
        sB = b.strMeal.toUpperCase(); // ignore upper and lowercase
      if (sA < sB) return -1;
      if (sA > sB) return 1;
      return 0;
    })
    .map(meal => {
      return `<div class="d-flex flex-row" id="fav${
        meal.idMeal
      }" draggable="true" ondragstart="drag(event)" ondragend="dragEnd(event)">

      <p class="p-2 w-100 bd-highlight"><a href="meal.html?m=${meal.idMeal}">${
        meal.strMeal
      }</a></p>
      <div class="dropdown p-2 flex-shrink-1 bd-highlight">
  <a class="" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
    <i class="fas fa-bars"></i>
  </a>
  <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
    <li><span class="dropdown-item" onclick="globalSetMeal({weekday: 'Mon', meal: '${encodeURIComponent(
      JSON.stringify(meal)
    )}'})">Have this on Monday</span></li>
    <li><span class="dropdown-item" onclick="globalSetMeal({weekday: 'Tue', meal: '${encodeURIComponent(
      JSON.stringify(meal)
    )}'})">Have this on Tuesday</span></li>
    <li><span class="dropdown-item" onclick="globalSetMeal({weekday: 'Wed', meal: '${encodeURIComponent(
      JSON.stringify(meal)
    )}'})">Have this on Wednesday</span></li>
    <li><span class="dropdown-item" onclick="globalSetMeal({weekday: 'Thu', meal: '${encodeURIComponent(
      JSON.stringify(meal)
    )}'})">Have this on Thursday</span></li>
    <li><span class="dropdown-item" onclick="globalSetMeal({weekday: 'Fri', meal: '${encodeURIComponent(
      JSON.stringify(meal)
    )}'})">Have this on Friday</span></li>
    <li><span class="dropdown-item" onclick="globalSetMeal({weekday: 'Sat', meal: '${encodeURIComponent(
      JSON.stringify(meal)
    )}'})">Have this on Saturday</span></li>
    <li><span class="dropdown-item" onclick="globalSetMeal({weekday: 'Sun', meal: '${encodeURIComponent(
      JSON.stringify(meal)
    )}'})">Have this on Sunday</span></li>
    <li><hr class="dropdown-divider"></li>
    <li><span class="dropdown-item" onclick="globalRemoveFav(${
      meal.idMeal
    })"><i class="fas fa-trash-alt"></i> Remove From Favourites</a></li>
  </ul>
</div>

      </div>`;
    })
    .join("\n")}
  </div>
</div>
`;
};
