firebase.auth().onAuthStateChanged((user) => {
  if (user && user.emailVerified) {
    window.location = "main.html";
  } else if (user) {
    // User has not verified their email yet
    $("#login-error").text("Email not verified. Verify and try again.");
    sendEmailVerification(user);
    firebase.auth().signOut();
  }
});
