let session = {};

$(document).ready(function() {
  console.log("document Ready");
});

function initData() {
  console.log("initUserData - Loading");
  fbInit();
  const fpPromise = FingerprintJS.load();

  fpPromise
    .then(fp => fp.get())
    .then(result => {
      console.log("initUserData - Fingerprint Sucess");
      session.id = result.visitorId;
      fbSignInAnonymously(session.id)
        .then(args => {
          console.log("initUserData - Signed In");

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
                console.log("initUserData - Stored Data Found");
                session.data = doc.data();
              } else {
                console.log("initUserData - Stored Data Not Found");
              }
              console.log("initUserData - Done Loading");
              render();
            })
            .catch(error => {
              console.log("Error getting document:", error);
            });
        })
        .catch(error => {
          var errorCode = error.code;
          var errorMessage = error.message;
          // ...
        });
    });
}

function setMealData(props) {
  // Toggle meal
  const mealId =
    session.data?.meals[props.weekday] != props.mealid ? props.mealid : null;

  fbSetMealData(session.id, props.weekday, mealId, session.data?.meals)
    .then(docs => {
      fbGetUserDocument(session.id)
        .then(doc => {
          if (doc.exists) {
            session.data = doc.data();
            render();
          }
        })
        .catch(error => {
          console.log("Error getting document:", error);
        });
    })
    .catch(error => {
      console.error("Error writing document: ", error);
    });
}
