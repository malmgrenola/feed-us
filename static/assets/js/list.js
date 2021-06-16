$(document).ready(function() {
  initData();
  render();
});

function intiEmailjs() {
  $('#mylist-form :button[type="submit"]').prop("disabled", true);
  $('#mylist-form input[type="email"]').keyup(function() {
    if ($(this).val() != "") {
      $('#mylist-form :button[type="submit"]').prop("disabled", false);
    } else {
      $('#mylist-form :button[type="submit"]').prop("disabled", true);
    }
  });

  $("#mylist-form").submit(function(event) {
    const listSetMessage = ({ isSuccess, email, msg }) => {
      $("#mylist-form").empty();
      $("#mylist-form").append(
        isSuccess
          ? `<p>Shopping list sent to: <b>${email}</b>  <span class="a" onclick="render();">Send to another</span></p>`
          : `<p>Failed to send with message: (<b>${msg.status}</b>) <b>${msg.text}</b> <span class="a" onclick="render();">Try again</span></p>`
      );
    };

    const { additionalItems, ingridients } = listShoppinglists();
    const email = $('#mylist-form input[type="email"]').val();
    const columnLength = 30;
    let table = `<table><tr><th>Ingridients</th><th>Messure</th></tr>${ingridients
      .map(
        ({ name, messure }) =>
          `<tr><td>${name}</td><td>${messure.join(" + ")}</td></tr>`
      )
      .join("\n")}<tr><td>${additionalItems.join(
      "</td></tr>"
    )}</td></tr></table>`;

    var templateParams = {
      to_email: email,
      table: table
    };

    emailjsSend({ templateParams: templateParams }, listSetMessage);
    event.preventDefault();
  });
}

function render() {
  $("#list").html(Page());
  intiEmailjs();
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

const listShoppinglists = () => {
  const userMeals = session.data ? Object.entries(session.data.meals) : null;

  let ingridients = [];
  let additionalItems = [];
  let shoppingChecked = [];

  if (userMeals) {
    additionalItems = session.data.additionalItems;
    shoppingChecked = session.data.shoppingChecked;

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
  }

  return {
    additionalItems: additionalItems,
    ingridients: ingridients,
    shoppingChecked: shoppingChecked,
    isLoading: !userMeals
  };
};

const Page = () => {
  return `
  <div class="container-fluid">
    <header>
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
      <div class="row">
        <div class="col text-center pb-1">
          <h3>Send my shopping list</h3>
          <form id="mylist-form" action="list.html">
            <input type="email">
            <button class="btn btn-primary" type="submit" value="Go">Send</button>
          </form>
        </div>
      </div>
    </header>
    <article>
      <div class="row">${List()}</div>
    </article>
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

  const {
    additionalItems,
    ingridients,
    shoppingChecked,
    isLoading
  } = listShoppinglists();

  if (isLoading) return Loading();

  const Ingridients = () => {
    return ingridients
      .map(({ name, selected, messure }, i) => {
        const value = name;

        const active = `${selected ? "active" : ""}`;

        return `
        <li class="liCheck d-flex align-items-center bd-highlight a-icon-revers ${active}" onclick="listToggleIngridient({idMeal: 'add', ingredient: '${name}',event: event})">
          <button
          type="button"
          class="btn btnCheck bd-highlight"
          >${
            selected
              ? `<i class="far fa-check-circle"></i>`
              : `<i class="far fa-circle"></i>`
          }</button>
          <div class="w-50 bd-highlight ms-2">
            <button
            type="button"
            class="btn btnCheck text-left"
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

          const active = `${selected ? "active" : ""}`;

          return `
          <li class="liCheck d-flex align-items-center bd-highlight a-icon-revers ${active}">
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
              class="btn btnRemove text-muted"
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
