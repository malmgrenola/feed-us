let searchResults = [];

$(document).ready(function() {
  initData();
  const q = searchGetUrlQuery();
  if (q !== "") searchDo(q);
  render();
});

const render = () => {
  $("#search-content").html(Browse);
  $("#search-input").focus();
};

const searchOnEnter = e => {
  if (event.which == 13) {
    searchDo(event.target.value);
  }
};

const searchDo = query => {
  searchSetUrlQuery(query);

  mealApiSearch(query)
    .then(response => {
      if (response.meals) {
        searchResults = response.meals;
      } else {
        searchResults = [];
      }
      render();
    })
    .catch(errorResponse => {
      $("#search-results").html(
        `<h2>Error: ${errorResponse.responseJSON.message}</h2>`
      );
    });
};

const searchGetUrlQuery = () => {
  // use history as state provider
  return new URL(window.location).searchParams.get("q") ?? "";
};

const searchSetUrlQuery = query => {
  // use history as state provider
  const url = new URL(window.location);
  console.log(url);
  url.searchParams.set("q", query);
  window.history.pushState({}, "", url);
};

const Browse = () => {
  const q = searchGetUrlQuery();

  return `
  <div class="row">
    <div class="col text-center">
      <h1>Find meal</h1>
    </col>
    <div class="col text-center">

        <input type="text" id="search-input" value="${q}" onkeyup="searchOnEnter()" />

    </div>
  </div>
  ${BrowseResults()}`;
};

const BrowseResults = () => {
  return `<div class="row"><div class="col"><p>results here: ${
    searchResults.length > 0
      ? `${searchResults.length} meal${
          searchResults.length > 1 ? "s" : ""
        } found`
      : "No meals found"
  }</p></div></div>
  ${searchResults
    .map(meal => {
      let ingridients = [];

      for (let i = 1; i <= 20; i++) {
        const ingridient = meal[`strIngredient${i}`];
        if (ingridient !== "" && ingridient !== null) {
          ingridients.push(meal[`strIngredient${i}`]);
        }
      }

      return `
        <div class="row"><div class="col">
          <div class="search-row d-flex justify-content-start">
          <img
            class="rounded-circle p-2 bd-highlight"
            src="${meal.strMealThumb}"
            alt="${meal.strMeal} image"
          />
          <div>
            <h3><a href="meal.html?m=${meal.idMeal}">${meal.strMeal}</a></h3>
            <p><span class="text-muted m-0">${ingridients.join(", ")}</span></p>
            ${
              meal.strTags
                ? `<p>${meal.strTags
                    .split(",")
                    .map(tag => {
                      return `<span class="badge bg-primary m-1">${tag}</span>`;
                    })
                    .join("")}</p>`
                : ""
            }
          </div>
          <div>
          <span style="font-size: 1.25rem;">${
            !globalInUserFav(meal.idMeal)
              ? `<i class="far fa-heart fav" onclick="globalAddFav({meal: '${encodeURIComponent(
                  JSON.stringify(meal)
                )}'})"></i>`
              : `<i class="fas fa-heart fav" onclick="globalRemoveFav(${meal.idMeal})"></i>`
          }
          </span>
          </div>
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
            </ul>
          </div>

</div>


        </div></div>

        `;
    })
    .join("\n")}
  `;
};

// function mealsResultHTML(meals) {
//   if (meals == null) {
//     return `No meals found`;
//   }
//   var mealItemsHTML = meals.map(function(meal, i) {
//     //<a href="meal.html?id=${meal.idMeal}" >${meal.strMeal}</a>
//
//     function ingString(ingredient) {
//       const pm = meals.length - 1 !== i ? ", " : "";
//       return ingredient !== "" ? ingredient + pm : "";
//     }
//     let ingridients = [];
//
//     for (let i = 1; i <= 20; i++) {
//       if (meal[`strIngredient${i}`] !== "") {
//         ingridients.push(meal[`strIngredient${i}`]);
//       }
//     }
//     return `<li>
//       <img
//         src="${meal.strMealThumb}"
//         alt="${meal.strMeal} image"
//       />
//       <h4><a href="meal.html?m=${meal.idMeal}">${meal.strMeal}</a></h4>
//       <p>${ingridients.join(", ")}</p>
//       <ul>
//         <li data-weekday="Mon" data-mealid="${
//           meal.idMeal
//         }" data-meal="${encodeURIComponent(JSON.stringify(meal))}" class="qWeek">Mon</li>
//         <li data-weekday="Tue" data-mealid="${
//           meal.idMeal
//         }" data-meal="${encodeURIComponent(JSON.stringify(meal))}" class="qWeek">Tue</li>
//         <li data-weekday="Wed" data-mealid="${
//           meal.idMeal
//         }" data-meal="${encodeURIComponent(JSON.stringify(meal))}" class="qWeek">Wed</li>
//         <li data-weekday="Thu" data-mealid="${
//           meal.idMeal
//         }" data-meal="${encodeURIComponent(JSON.stringify(meal))}" class="qWeek">Thu</li>
//         <li data-weekday="Fri" data-mealid="${
//           meal.idMeal
//         }" data-meal="${encodeURIComponent(JSON.stringify(meal))}" class="qWeek">Fri</li>
//         <li data-weekday="Sat" data-mealid="${
//           meal.idMeal
//         }" data-meal="${encodeURIComponent(JSON.stringify(meal))}" class="qWeek">Sat</li>
//         <li data-weekday="Sun" data-mealid="${
//           meal.idMeal
//         }" data-meal="${encodeURIComponent(JSON.stringify(meal))}" class="qWeek">Sun</li>
//         <li>Fav</li>
//       </ul>
//     </li>`;
//   });
//
//   return `<div">
//   <p><strong>${meals.length} meals found:</strong></p>
//   <ul>
//     ${mealItemsHTML.join("\n")}
//   </ul>
//   </div>`;
// }
// function browseQuery(query) {
//   //var query = $("#meal-query").val();
//   mealApiSearch(query)
//     .then(response => {
//       $("#meal-data").html(mealsResultHTML(response.meals));
//       $("#meal-data .qWeek").click(function(event) {
//         browseToggleMealData(event.target.dataset);
//       });
//       render();
//     })
//     .catch(errorResponse => {
//       $("#meal-data").html(
//         `<h2>Error: ${errorResponse.responseJSON.message}</h2>`
//       );
//     });
// }
//
// // function browseSetMealData(props) {
// //   session.data.meals[props.weekday] = JSON.parse(
// //     decodeURIComponent(props.meal)
// //   );
// //
// //   fbSetDoc(session.id, session.data).catch(error => {
// //     console.error("Error writing document: ", error);
// //   });
// //   render();
// // }
//
// function browseToggleMealData(props) {
//   const meal =
//     session.data.meals[props.weekday] !== null
//       ? null
//       : JSON.parse(decodeURIComponent(props.meal));
//
//   session.data.meals[props.weekday] = meal;
//
//   fbSetDoc(session.id, session.data).catch(error => {
//     console.error("Error writing document: ", error);
//   });
//   render();
// }
