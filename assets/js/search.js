let searchResults = [];

$(document).ready(function() {
  initData();
  const q = globalGetUrlParam("q");
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
  globalSetUrlParam("q", query);

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
      $("#search-content").html(
        `<h2>Error: ${errorResponse.responseJSON.message}</h2>`
      );
    });
};

const Browse = () => {
  const q = globalGetUrlParam("q");

  return `
  <div class="row">
    <div class="col text-center"><h1>Find meal</h1></div>
  </div>
  <div class="row">
    <div class="col text-center"><input type="text" id="search-input" value="${q}" onkeyup="searchOnEnter()" /></div>
  </div>
  ${BrowseResults()}
  `;
};

const BrowseResults = () => {
  return `
  <div class="row">
    <div class="col text-center">
      <p>${
        searchResults.length > 0
          ? `${searchResults.length} meal${
              searchResults.length > 1 ? "s" : ""
            } found`
          : "No meals found"
      }</p>
    </div>
  </div>

  ${searchResults
    .map(meal => {
      const Image = () => {
        return `<img
                    class="rounded-circle"
                    src="${meal.strMealThumb}"
                    alt="${meal.strMeal} image"
                  />`;
      };

      const Title = () => {
        return `<h3><span class="me-4">${
          !globalInUserFav(meal.idMeal)
            ? `<i class="far fa-heart fav" onclick="globalAddFav({meal: '${encodeURIComponent(
                JSON.stringify(meal)
              )}'})"></i>`
            : `<i class="fas fa-heart fav" onclick="globalRemoveFav(${meal.idMeal})"></i>`
        }
                    </span> <a href="meal.html?m=${meal.idMeal}">${
          meal.strMeal
        }</a> </h3>`;
      };

      const Ingridient = () => {
        let ingridients = [];

        for (let i = 1; i <= 20; i++) {
          const ingridient = meal[`strIngredient${i}`];
          if (ingridient !== "" && ingridient !== null) {
            ingridients.push(meal[`strIngredient${i}`]);
          }
        }
        return `<p><span class="text-muted m-0">${ingridients.join(
          ", "
        )}</span></p>`;
      };

      const Tags = () => {
        return ` ${
          meal.strTags
            ? `<span class="search-tags">${meal.strTags
                .split(",")
                .map(tag => {
                  return `<span class="badge bg-primary m-1">${tag}</span>`;
                })
                .join("")}</span>`
            : `<span class="search-tags">&nbsp;</span>`
        }`;
      };

      const Hamburger = () => {
        return `<div class="dropdown">
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
                  </div>`;
      };

      return `
        <div class="row">
          <div class="col">
              <div class="d-flex flex-row flex-nowrap flex-grow-1 bd-highlight justify-content-start align-items-center background-grey search-row">
                <div class="flex-shrink-0">${Image()}</div>
                <div class="flex-grow-1">
                  <div>${Title()}</div>
                  <div>${Tags()}</div>
                </div>
                <div class="me-3">${Hamburger()}</div>
              </div>
          </div>
        </div>
          `;
    })
    .join("\n")}
  `;
};
