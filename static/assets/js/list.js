$(document).ready(function() {
  initData();
  $("#shopping-data").html("Loading...");
});

function render() {
  //console.log("render called");
  const meals = Object.entries(session.data.meals);
  const additionalItems = session.data.additionalItems;
  const shoppingChecked = session.data.shoppingChecked;
  $("#shopping-data").html(`
    <ul>
      ${meals
        .map(([key, meal]) => {
          if (meal) {
            let ingridients = [];

            for (let i = 1; i <= 20; i++) {
              if (meal[`strIngredient${i}`] !== "") {
                const value = `${meal.idMeal}-${meal[`strIngredient${i}`]}`;

                const selected =
                  shoppingChecked.findIndex(item => item === value) >= 0
                    ? true
                    : false;
                ingridients.push(
                  `<li><div onclick="listToggleIngridient({idMeal: '${
                    meal.idMeal
                  }', ingredient: '${meal[`strIngredient${i}`]}'})">${
                    selected
                      ? '<i class="far fa-check-circle"></i>'
                      : '<i class="far fa-circle"></i>'
                  } ${meal[`strIngredient${i}`]} - ${
                    meal[`strMeasure${i}`]
                  }</div></li>`
                );
              }
            }
            return `
          <li><a href="meal.html?m=${meal.idMeal}">${meal.strMeal}</a>
            <ul>
                ${ingridients.join("\n")}
            </ul>
          </li>`;
          }
        })
        .join("\n")}
      <li>My additional Items
        <ul>
        ${additionalItems
          .map((item, i) => {
            const value = `add-${item}`;

            const selected =
              shoppingChecked.findIndex(item => item === value) >= 0
                ? true
                : false;
            return `<li>${
              selected
                ? `<i class="far fa-check-circle" onclick="listToggleIngridient({idMeal: 'add', ingredient: '${item}'})"></i>`
                : `<i class="far fa-circle" onclick="listToggleIngridient({idMeal: 'add', ingredient: '${item}'})"></i>`
            } ${item} <i class="far fa-times-circle" onclick="listDeleteAdditionalItem(${i})"></i></li>`;
          })
          .join("\n")}
          <li><div id="addAdditionalItem"><i class="fas fa-plus-circle"></i><small>Add items</small></div> </li>
        </ul>
      </li>
    </ul>
    `);
  $("#addAdditionalItem").click(add);

  function add() {
    $("#addAdditionalItem").empty();
    $("#addAdditionalItem").append("<input />");
    $("#addAdditionalItem").off();
    $("#addAdditionalItem input").keyup(function(event) {
      if (event.which == 13) {
        listAddAdditionalItem(event.target.value);
      }
    });
  }
}

function listToggleIngridient(props) {
  const value = `${props.idMeal}-${props.ingredient}`;

  const index = session.data.shoppingChecked.findIndex(item => item === value);

  if (index === -1) {
    session.data.shoppingChecked.push(value);
  } else {
    session.data.shoppingChecked.splice(index, 1);
  }
  fbSetDoc(session.id, session.data).catch(error => {
    console.error("Error writing document: ", error);
  });
  render();
}

function listAddAdditionalItem(item) {
  if (item === "") return;

  session.data.additionalItems.push(item);

  fbSetDoc(session.id, session.data).catch(error => {
    console.error("Error writing document: ", error);
  });
  render();
}

function listDeleteAdditionalItem(index) {
  if (index >= 0) {
    session.data.additionalItems.splice(index, 1);
  }
  fbSetDoc(session.id, session.data).catch(error => {
    console.error("Error writing document: ", error);
  });
  render();
}

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
