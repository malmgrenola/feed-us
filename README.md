# Feed us website

The site that helps you and your family plan the dinner for the week including shopping list management.

Live site location:

[Feed-Us Website](https://malmgrenola.github.io/feed-us)

![last deployment](https://img.shields.io/github/last-commit/malmgrenola/feed-us/gh-pages?label=last%20live%20site%20deployment)

![badge](https://img.shields.io/w3c-validation/html?style=plastic&targetUrl=https%3A%2F%2Fmalmgrenola.github.io%2Ffeed-us%2Findex.html)

Live site screenshot:
![Feed us layout](wireframes/feedus-site.png)

#### Table of Contents

[UX](#ux)

[Features](#features)

- [Existing Features](#existing-features)
  - [Site content](#site-content)
  - [Style Information](#style-information)
- [Features Left to Implement](#features-left-to-implement)

[Technologies Used](#technologies-used)

[Testing](#testing)

- [Known issues](#known-issues)

- [Deployment](#deployment)
- [Development](#development)

- [Credits](#credits)

## UX

The typical website user is an adult ready to take the responsibility to plan the dinner for the whole week.

- As a user, I would like to see my weekly dinner planning so I can get a dinner overview of what's up for dinner.
- As a user, I would like to find a recipe and add it to the week's planning so that I can get an overview of what is for dinner.
- As a user, I would like to get an automated shopping list based on my weekly schedule, so I know what to buy in the store.
- As a user, I should be able to add items to the shopping list so I don't miss buying other items in the store.
- As a user, I should be able to tick off items when I'm in the store so I know what I have left to find.
- As a user, I would like to send my shopping list as an email to my fellow users, so I don't have to do all the shopping myself.

Site screenshots are found in the project folder [/wireframes](wireframes).

Site wireframes:

- [Find meal page](wireframes/find-meal.png) search meal page, showing search results. Also acts as site index page
- [Weekly schedule Page](wireframes/week.png) showing the dishes selected for each day.
- [Favourites Page](wireframes/favourites.png) showing the current favourite dishes.
- [Shopping list Page](wireframes/list.png) showing the current shopping list with email possibility
- [Meal page](wireframes/meal.png) showing selected meal ingredients and instructions.

## Features

The website contains a clear navigation on every page.
The site is based on a navigational hierarchical tree structure.
Navigation bar is responsive and will fold down to a burger menu when it wont fit the size.

Navigation items:
Find meal (the logo is also a link to Find meal)
Week schedule
Shopping list
Favourite meals

Each page includes a footer element containing information about the site and links to site social accounts and link to favourites page.
[Footer wireframe example](wireframes/footer.png)

### Existing Features

- Find meals - allows users to find a recipe by searching for a dish by using the query field.
- Week schedule overview - allow users to get a weekly dinner overview including a weekly overview widget on pages that require it.
- Shopping list - Allow users to establish a shopping list based on the weekly schedule where additional items can be added.
- Favourite meals - Allow users to see all meals set as users favourites.
- Meal cooking instructions - let the user see the recipe details for the meal.
- Set Random meals - If the user does not want to find a meal it is possible to use the random function in the weekly widget or the week page.
- Custom 404 - Navigating to a page that does not exist will tell the user about the error. This works in Development and in Production.
- [Data Storage](#data-storage) - Allow user selections to be stored between sessions.

#### Data storage

Anonymous users are tracked with a [fingerprint](https://github.com/fingerprintjs/fingerprintjs) and the user data is stored with [Google Firebase](https://firebase.google.com/docs/web/setup#from-the-cdn).

Here is an example user record stored on [Google Firebase](https://firebase.google.com/docs/web/setup#from-the-cdn).

```
{
  "data": {
    "meals": {
      "Mon": {mealobject},
      "Tue": {mealobject},
      "Wed": {mealobject},
      "Thu": {mealobject},
      "Fri": null,
      "Sat": null,
      "Sun": {mealobject}
     },
     "additionalItems": ["1 x Toilet paper", "2 x lollipops"],
     "favlist": [mealobject,mealobject],
     "shoppingChecked": [itemObject,itemObject]
   },
 }
```

#### Site content

Most of the site content is provided from API.

#### Style Information

##### Selected Typefaces

Site use system sans-serif provided by bootstrap to stay clean on all supported platforms

##### Color Scheme

The site color scheme is light and high contrast, with user information text and navigation bar muted gray.

### Features Left to Implement

- Use social logins to use the custom data site on multiple devices.

## Technologies Used

In this section, all of the languages, frameworks, libraries, and any other tools that are used to construct this project are listed with its name, a link to its official site and a short sentence of why it was used.

- [HTML5](https://www.w3.org/TR/html52/)
  - Used to render the DOM
- [CSS](https://www.w3.org/Style/CSS/Overview.en.html)
  - Used to layout the site.
- [Javascript](https://developer.mozilla.org/en/JavaScript)
  - Used to handle site code logic and API integrations
- [Bootstrap](https://getbootstrap.com/docs/5.0/getting-started/introduction/)
  - used to make site responsive
- [Fontawesome](https://fontawesome.com/)
  - Used to display icons on website
- [themealdb](https://www.themealdb.com/api.php)
  - Used as recipe database
- [JQuery](https://jquery.com)
  - The project uses **JQuery** to simplify DOM manipulation.
- [Google Firebase](https://firebase.google.com/docs/web/setup#from-the-cdn)
  - Used to store and recall user data
  - https://console.firebase.google.com/project/neon-research-304412/overview (restricted access)
- [Yarn](https://yarnpkg.com/)
  - Used to start dev environment
- [fingerprintjs](https://github.com/fingerprintjs/fingerprintjs)
  - is used to create a browser fingerprint without the user actually login.
- [emailjs](https://www.emailjs.com/)
  - Used to send email from site

## Testing

Site is tested on the following platforms and browsers

- Mac
  - Google Chrome (91.0.4472.106)
  - Safari (14.1.1)
  - Firefox (89.0.1)
- Windows 10
  - Google Chrome (91.0.4472.114)
  - Edge (91.0.864.53)
  - Firefox (89.0.1)
- Iphone 12
  - Safari
  - Google Chrome
- Android Samsung S12
  - Google Chrome

All tests pass on all platforms.

### Send email form

The site has the feature to send emails with emailjs.
Errors & Success in sending emails is displayed to the user in the UI. The form will not send the email if the email address has the wrong format.

The send email feature correctly handles errors and sends emails upon valid email addresses.

#### Test email form

1. Contact form:
   1. Go to "Index" page
   2. Add a meal to any weekday by clicking on for example "Mo"
   3. Go to "Shopping list" page
   4. In the end of the list add your own item by clicking "Add Items", type for example "4 rolls of Toilet paper" and press enter.
   5. Scroll to the top of the "Shopping list"
   6. Try to submit the empty form and verify that "Send" button is disbled.
   7. Try to submit the form with an invalid email address and verify that a relevant error message appears
   8. Try to submit the form with email input valid and verify that a success message appears.

Feature passed this test

### Toggle meal to week

1. goto "Index"
2. On a couple of meals click on a couple of Weekdays "Mo" - "Su"
3. Confirm meals to show up on correct days.

Feature passed this test

### Toggle meal to favourites

1. goto "Find meal"
2. On a couple of meals click on the favourite heart.
3. Confirm the heart goes red.
4. Goto "Favourite meals" and confirm Favourite meals show up in the list

Feature passed this test

### Add and remove additional shopping list items

1. Got to "Shopping list"
2. click "add items"
3. type anything in the input box.
4. Hit Enter on keyboard

Feature passed this test

### Test Random meal feature

1. Got to "Week schedule"
2. hover the image on a meal and "Set a random dish"
3. confirm new meal show up

Feature passed this test

### Find meals

1. Got to "Find meal"
2. Type in "fish" and hit enter
3. Confirm you get a list of "fishy" items.

Feature passed this test

### Confirm Automated Shopping list

1. Add one or more meals to week schedule
2. Goto "Shopping list"
3. Confirm ingredients for the selected meals show up in list

Feature passed this test

### Confirm Shopping list items checked

1. Add one or more meals to week schedule
2. Goto "Shopping list"
3. click on a row on ingredient text or the checkbox
4. confirm row is checked

Feature passed this test

### Confirm Meal Page

1. Goto "Find meal"
2. click on any dish name
3. Confirm recipe reads fine

Feature passed this test

### Confirm Page not found

1. Goto "https://malmgrenola.github.io/feed-us/wrong.html"
2. Confirm you get a "Page not found" Page

Feature passed this test

### HTML & CSS Validator tests

Each page should return no errors & warnings using [validator.w3.org](https://validator.w3.org/)

#### Pages to test

1. [index.html](https://validator.w3.org/nu/?showsource=yes&doc=https%3A%2F%2Fmalmgrenola.github.io%2Ffeed-us%2Findex.html)
2. [favourites.html](https://validator.w3.org/nu/?showsource=yes&doc=https%3A%2F%2Fmalmgrenola.github.io%2Ffeed-us%2Ffavourites.html)
3. [list.html](https://validator.w3.org/nu/?showsource=yes&doc=https%3A%2F%2Fmalmgrenola.github.io%2Ffeed-us%2Flist.html)
4. [meal.html](https://validator.w3.org/nu/?showsource=yes&doc=https%3A%2F%2Fmalmgrenola.github.io%2Ffeed-us%2Fmeal.html)
5. [week.html](https://validator.w3.org/nu/?showsource=yes&doc=https%3A%2F%2Fmalmgrenola.github.io%2Ffeed-us%2Fweek.html)
6. [404.html](https://validator.w3.org/nu/?showsource=yes&doc=https%3A%2F%2Fmalmgrenola.github.io%2Ffeed-us%2F404.html)

All pages are validated without errors or warnings.

### CSS Validation

Site CSS should return no errors or warnings.

[CSS Validator testing style.css](https://jigsaw.w3.org/css-validator/validator?uri=malmgrenola.github.io%2Ffeed-us%2Fassets%2Fcss%2Fstyle.css&profile=css3svg&usermedium=all&warning=1&vextwarning=&lang=en)

### Known issues

1. [themealdb](https://www.themealdb.com/api.php) is case sensitive in ingredients that means that "eggs" and "Eggs" will show up twice in the shopping list.
2. During site test and adding meal to a weekday, there was a meal from [themealdb](https://www.themealdb.com/api.php) that could not be encoded with [encodeURIComponent](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent). This resulted that it was not possible to add the particular meal, the problem cannot currently be reproduced so it's not possible to write a catch error function.
3. [emailjs](https://www.emailjs.com/) has a limitation on 200 emails per month on the free plan.
4. Since this site re-renders all content in the sections using JQuery on each page HTML validators yells a warning that h1-h6 is missing. Each page section has a `h1` and `h2` in order for the validators to accept the html without warnings. This has no impact on site functionality.
5. Site stores data based on browser fingerprints. changing browser will create a new dataset and the selected data will be lost. The future feature Add Social logins will ensure users can login on any device using the same dataset.
6. Github Pages will now have the `Permissions-Policy: interest-cohort=()` header set. There is currently no [way to opt out of it](https://paramdeo.com/blog/opting-your-website-out-of-googles-floc-network#github-pages). A warning will be seen in for example Chrome Developer tools.

## Deployment

Site is deployed to [malmgrenola.github.io/feed-us](https://malmgrenola.github.io/feed-us) using Github Pages.

The `static` subfolder is deployed by pushing the `static` folder to its own branch `gh-pages`, used by Github Pages to deploy the site.
The command `git subtree push --prefix static origin gh-pages` is added to `package.json` as script deploy, making it possible to run `yarn deploy` from the project root folder.

Deploy by:

1. Fork the [feed-us repo](https://github.com/malmgrenola/feed-us)
2. In the terminal run `git clone https://github.com/{your-own-gituser-here}/feed-us.git` - to fetch code
3. In the terminal run `cd feed-us` - to place yourself in the root of the project.
4. In the terminal run `yarn` - to download all dependencies
5. commit your changes to your forked repo
6. in a terminal run `yarn deploy` - to fire deploy script to Google Pages with custom root folder.

If deployed to anything other than [malmgrenola.github.io/feed-us](https://malmgrenola.github.io/feed-us) you must create your own instances of Google Firebase with your own api keys provided in the [firebase-api.js](https://github.com/malmgrenola/feed-us/blob/main/static/assets/js/firebase-api.js#L2) config section. Full [guideline documentation](https://cloud.google.com/firestore/docs/client/get-firebase) is provided by Google.

## Development

This project uses `yarn` to start a development server.

1. Fork the [feed-us repo](https://github.com/malmgrenola/feed-us)
2. In the terminal run `git clone https://github.com/{your-own-gituser-here}/feed-us.git` - to fetch code
3. In the terminal run `cd feed-us` - to place yourself in the root of the project.
4. In the terminal run `yarn` - to download all dependencies
5. `yarn dev` - to start a dev environment.

a http-server should start on port 3000 and the site is now available on `http://localhost:3000`.  
Google API's used is locked to `localhost:3000` & deploy url `malmgrenola.github.io/feed-us`.  
To change the default port please update in `package.json` under the scripts section. Please note that changing port will disable the usage of the restricted google api key provided in the project.

## Credits

### Media

The photos used in this site were obtained from:

- https://www.vecteezy.com/vector-art/297563-bird-feeding-baby-bird

### Acknowledgements

- I received inspiration from [allrecipes](https://www.allrecipes.com/) and [simply recipes](https://www.simplyrecipes.com/)
- I received inspiration for the week planner from [freepik](https://www.freepik.com/premium-vector/weekly-planner-template-with-floral-watercolor_5643584.htm)
- I received inspiration for loading images from [Creating a CSS Animated Loading Card](https://dev.to/chris__sev/creating-a-css-animated-loading-card-5187)
- I received inspiration for [Styling a Search Bar from mikedane website](https://www.mikedane.com/web-development/css/styling-search-bar/)
- I received inspiration for site render and code flow from [React](https://reactjs.org/)
