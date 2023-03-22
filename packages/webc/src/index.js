const { initializeApp } = require("firebase/app");
const { getAuth, onAuthStateChanged, signOut, sendSignInLinkToEmail } = require("firebase/auth");

// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
  apiKey: "AIzaSyCDDQXk9E6-t55GgFQhSkvx3hX_j1wKOkE",
  authDomain: "lanflix.firebaseapp.com",
  databaseURL: "https://lanflix.firebaseio.com",
  projectId: "lanflix",
  storageBucket: "lanflix.appspot.com",
  messagingSenderId: "208193875375",
  appId: "1:208193875375:web:8eb09f6978f36258c6135a",
};

// Initialize Firebase
initializeApp(firebaseConfig);

require("./libs/jquery/loginPage");

const auth = getAuth();

onAuthStateChanged(auth, (user) => {
  if (user && user.emailVerified) {
    window.location = "main.html";
  } else if (user) {
    // User has not verified their email yet
    $("#login-error").text(
      "Email not verified. Check your email for a verification email and try again. Check the junk just in case!"
    );
    sendSignInLinkToEmail(auth, user.email)
    .catch(function (e) {
      // An error happened.
      $("#login-error").text(`Error: Failed to send verification email. Reason: ${e}`);
    });
    signOut(auth);
  }
});
