function mealApiLookup(id) {
  return $.getJSON(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
}

function mealApiSearch(query) {
  return $.getJSON(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
  );
}

function mealApiRandom() {
  return $.getJSON(`https://www.themealdb.com/api/json/v1/1/random.php`);
}
