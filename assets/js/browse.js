$(document).ready(function() {
  console.log("document Ready");
});

function render() {
  console.log("render called");
  if (session.data?.meals) {
    const userMeals = session.data?.meals;

    // Clear all states to default
    $(`ul.qWeek li`).css("font-weight", "normal");

    // Set states on page
    for (const date in userMeals) {
      $(
        `ul.qWeek li[data-weekday='${date}'][data-mealid='${userMeals[date]?.idMeal}']`
      ).css("font-weight", "bold");
    }
  }
  console.log(1, {
    fingerprint: session.id,
    data: session.data,
    user: session.user
  });
}
