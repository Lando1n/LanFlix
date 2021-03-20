firebase.auth().onAuthStateChanged((user) => {
  if (user && user.emailVerified) {
    window.location = "main.html";
  } else if (user) {
    // User has not verified their email yet
    $("#login-error").text(
      "Email not verified. Check your email for a verification email and try again. Check the junk just in case!"
    );
    sendEmailVerification(user);
    firebase.auth().signOut();
  }
});
