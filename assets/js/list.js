$(document).ready(function() {
  initData();
  render();
});

function render() {
  $("#list").html(Page());
}

const listOnAddClick = () => {
  $("#addAdditionalItem").empty();
  $("#addAdditionalItem").append(
    "<div class='bd-highlight'><i class='far fa-circle'></i></div><div class='flex-grow bd-highlight w-100 ms-2'><input /></div>"
  );
  $("#addAdditionalItem").off();
  $("#addAdditionalItem input").focus();
  $("#addAdditionalItem input").keyup(event => {
    if (event.which == 13) {
      event.preventDefault();
      listAddAdditionalItem(event.target.value);
      $("#btnAdd").focus();
    }
    if (event.which == 27) {
      event.preventDefault();
      render();
      $("#btnAdd").focus();
    }
  });
};

const listToggleIngridient = props => {
  const value = `${props.ingredient}`;

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
};

const listAddAdditionalItem = item => {
  if (item === "") return;

  session.data.additionalItems.push(item);

  fbSetDoc(session.id, session.data).catch(error => {
    console.error("Error writing document: ", error);
  });
  render();
};

const listDeleteAdditionalItem = index => {
  if (index >= 0) {
    const value = `add-${session.data.additionalItems[index]}`;
    const checkedIndex = session.data.shoppingChecked.findIndex(
      item => item === value
    );
    session.data.additionalItems.splice(index, 1);
    if (checkedIndex >= 0) session.data.shoppingChecked.splice(checkedIndex, 1); //Clean up if item was among selected
  }
  fbSetDoc(session.id, session.data).catch(error => {
    console.error("Error writing document: ", error);
  });
  render();
};

const Page = () => {
  return `
  <div class="container-fluid py-2 grid">
    <div class="row">
      <div class="col text-center">
        <h1>Feed Us!</h1>
      </div>
    </div>
    <div class="row">
      <div class="col text-center pb-1">
        <h2>My Shopping list</h2>
      </div>
    </div>
    <div class="row">${List()}</div>
  </div>`;
};

const List = () => {
  // Content used while loading data for the current weekday
  const Loading = () => {
    return `
    <div class="col text-center">
      <p class="card-text text-muted">Fetching your shopping list...</p>
    </div>
      `;
  };

  const userMeals = session.data ? Object.entries(session.data.meals) : null;
  if (!userMeals) return Loading();

  const additionalItems = session.data.additionalItems;
  const shoppingChecked = session.data.shoppingChecked;

  let ingridients = [];
  userMeals.map(([key, meal]) => {
    if (meal) {
      // Note: Api has a fixed list of items (20)
      for (let i = 1; i <= 20; i++) {
        const id = meal.idMeal;
        const name = meal.strMeal;
        const ingridient = meal[`strIngredient${i}`];
        const messure = meal[`strMeasure${i}`];

        if (ingridient !== "" && ingridient) {
          //console.log(ingridient);

          const selected =
            shoppingChecked.findIndex(item => item === ingridient) >= 0
              ? true
              : false;

          const result = ingridients.find(({ name }) => name === ingridient);

          if (result) {
            //console.log(1, result);
            result.messure.push(messure);
          } else {
            //console.log(2, "add new ");
            ingridients.push({
              name: ingridient,
              messure: [messure],
              selected: selected
            });
          }
        }
      }
    }
  });

  ingridients.sort((a, b) => {
    const sA = a.name.toUpperCase(),
      sB = b.name.toUpperCase(); // ignore upper and lowercase
    if (sA < sB) return -1;
    if (sA > sB) return 1;
    return 0;
  });

  const Ingridients = () => {
    return ingridients
      .map(({ name, selected, messure }, i) => {
        const value = name;

        return `
        <li class="liCheck d-flex align-items-center bd-highlight">
          <button
          type="button"
          class="btn btnCheck bd-highlight"
          onclick="listToggleIngridient({idMeal: 'add', ingredient: '${name}',event: event})"
          >${
            selected
              ? `<i class="far fa-check-circle"></i>`
              : `<i class="far fa-circle"></i>`
          }</button>
          <div class="w-50 bd-highlight ms-2">
            <button
            type="button"
            class="btn btnCheck text-left"
            onclick="listToggleIngridient({idMeal: 'add', ingredient: '${name}',event: event})"
            >${name}</button>
          </div>
          <div class="bd-highlight w-50 text-end">
          ${messure.join(" + ")}
          </div>
        </li>`;
      })
      .join("\n");
  };

  const EmptyWeek = () => {
    if (ingridients.length === 0) {
      return `
      <div class="col-12 p-2 text-center text-muted">
        <p>When you select a dish on a weekday the ingredients will available for you here to use when you go shopping in the store.</p>
        <p>You can hit <span class="a" onclick="listOnAddClick();">Add items</span> to add your extras to your shopping list!</p>
      </div>`;
    }
    return "";
  };

  return `
  ${EmptyWeek()}
  <div class="col-12 p-2 p-md-5">
    <ul>
      ${Ingridients()}
      ${additionalItems
        .map((item, i) => {
          const value = `add-${item}`;

          const selected =
            shoppingChecked.findIndex(item => item === value) >= 0
              ? true
              : false;

          return `
          <li class="liCheck d-flex align-items-center bd-highlight">
            <button
            type="button"
            class="btn btnCheck bd-highlight"
            onclick="listToggleIngridient({idMeal: 'add', ingredient: '${value}',event: event})"
            >${
              selected
                ? `<i class="far fa-check-circle"></i>`
                : `<i class="far fa-circle"></i>`
            }</button>
            <div class="flex-grow-1 bd-highlight ms-2">
              <button
              type="button"
              class="btn btnCheck text-left"
              onclick="listToggleIngridient({idMeal: 'add', ingredient: '${value}',event: event})"
              >${item}</button>
            </div>
            <div class="bd-highlight">
              <button
              type="button"
              class="btn text-muted btnRemove"
              onclick="listDeleteAdditionalItem(${i})"
              >Remove <i class="far fa-times-circle"></i></button>
            </div>
          </li>`;
        })
        .join("\n")}
        <li class="liCheck d-flex bd-highlight"><div id="addAdditionalItem" class="d-flex bd-highlight w-100">
        <button
        id="btnAdd"
        type="button"
        class="btn text-muted"
        onclick="listOnAddClick()"
        ><i class="fas fa-plus-circle"></i> Add items</button>
        </div> </li>
    </ul>
  </div>
    `;
};
