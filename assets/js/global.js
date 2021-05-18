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
