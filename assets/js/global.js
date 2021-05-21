let session = {};

function initData() {
  //console.log("initUserData - Loading");
  fbInit();
  const fpPromise = FingerprintJS.load();

  fpPromise
    .then(fp => fp.get())
    .then(result => {
      //console.log("initUserData - Fingerprint Sucess");
      session.id = result.visitorId;
      fbSignInAnonymously(session.id)
        .then(args => {
          //console.log("initUserData - Signed In");
          const user = {
            isAnonymous: args.user.isAnonymous,
            displayName: args.user.displayName,
            email: args.user.email,
            metadata: args.user.metadata
          };
          session.user = user;
          fbGetUserDocument(session.id)
            .then(doc => {
              if (doc.exists) {
                //console.log("initUserData - Stored Data Found");
                session.data = doc.data();
              } else {
                //console.log("initUserData - Stored Data Not Found");
                session.data = {
                  meals: {
                    Mon: null,
                    Tue: null,
                    Wed: null,
                    Thu: null,
                    Fri: null,
                    Sat: null,
                    Sun: null
                  },
                  shoppingChecked: [],
                  favlist: [],
                  additionalItems: []
                };
              }
              //console.log("initUserData - Done Loading");
              render();
            })
            .catch(error => {
              console.error("Error getting document:", error);
            });
        })
        .catch(error => {
          var errorCode = error.code;
          var errorMessage = error.message;
          // ...
        });
    });
}
const globalInUserFav = idMeal => {
  if (!session.data) return null;

  return session.data.favlist
    .map(meal => meal.idMeal)
    .includes(typeof idMeal !== "string" ? idMeal.toString() : idMeal);
};

const globalIndexOfUserFav = idMeal => {
  if (!session.data) return null;
  return session.data.favlist
    .map(meal => meal.idMeal)
    .indexOf(typeof idMeal !== "string" ? idMeal.toString() : idMeal);
};

const globalAddFav = props => {
  //TODO: Fix error Uncaught SyntaxError: Unexpected identifier when adding f.ex. Recheado Masala Fish
  const meal = JSON.parse(decodeURIComponent(props.meal));

  if (!globalInUserFav(meal.idMeal)) {
    session.data.favlist.push(meal);
    fbSetDoc(session.id, session.data).catch(error => {
      console.error("Error writing document: ", error);
    });
    render();
  }
};

const globalRemoveFav = idMeal => {
  const elem = globalIndexOfUserFav(idMeal);
  if (elem >= 0) {
    session.data.favlist.splice(elem, 1);
    fbSetDoc(session.id, session.data).catch(error => {
      console.error("Error writing document: ", error);
    });
    render();
  }
};
const globalSetMeal = props => {
  const meal = JSON.parse(decodeURIComponent(props.meal));
  const weekday = props.weekday;

  session.data.meals[weekday] = meal;
  fbSetDoc(session.id, session.data).catch(error => {
    console.error("Error writing document: ", error);
  });
  render();
};
