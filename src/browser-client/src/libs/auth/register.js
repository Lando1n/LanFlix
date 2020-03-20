// eslint-disable-next-line no-unused-vars
function registerAccount(email, password) {
  // Checks if the email is already registered
  // Registers the user account to firebase
  firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .catch(function(error) {
      // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        $('#login-error').text(`Error ${errorCode}, ${errorMessage}`);
      });
}

// eslint-disable-next-line no-unused-vars
function sendEmailVerification(user) {
  user.sendEmailVerification().then(function() {
    // Email sent.
  }).catch(function() {
    // An error happened.
    $('#login-error').text(`Error: Failed to send verification email.`);
  });
}
