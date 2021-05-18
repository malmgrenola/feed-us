function fbInit() {
  var firebaseConfig = {
    apiKey: "AIzaSyCH9W1CsOl3TtjwIkJXjwpdx4yMuRVJJdA",
    authDomain: "neon-research-304412.firebaseapp.com",
    projectId: "neon-research-304412",
    storageBucket: "neon-research-304412.appspot.com",
    messagingSenderId: "693391729513",
    appId: "1:693391729513:web:77200766e53d59756693f8",
    measurementId: "G-RG1SVS1YH3"
  };

  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
}

function initDocRef(id) {
  return firebase
    .firestore()
    .collection("users")
    .doc(id);
}

function fbSignInAnonymously(id) {
  return firebase.auth().signInAnonymously();
}

function fbGetUserDocument(id) {
  return initDocRef(id).get();
}
function fbSetDoc(id, doc) {
  return initDocRef(id).set(doc);
}
