$("#login-btn").on("click", function () {
  $("#login-modal").modal("show");
});

$("#logout-btn").on("click", function () {
  logout();
});

$("#login-modal").on("hidden.bs.modal", function () {
  $("#login-form").trigger("reset");
});

$("#login-submit-btn").on("click", function () {
  $("#login-error").text("");
  const email = $("#username-input").val();
  const password = $("#password-input").val();
  firebase
    .auth()
    .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(function () {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(function () {
          console.debug("login successful");
        })
        .catch(function (error) {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          $("#login-error").text(`Error ${errorCode}, ${errorMessage}`);
        });
    });
});

$("#register-btn").on("click", () => {
  $("#login-error").text("");
  const email = $("#username-input").val();
  const password = $("#password-input").val();
  registerAccount(email, password);
});
