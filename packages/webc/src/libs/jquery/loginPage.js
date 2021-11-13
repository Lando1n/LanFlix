const {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword,
  signOut,
} = require("firebase/auth");

const { registerAccount } = require("../auth/register");

$("#login-btn").on("click", function () {
  console.log("logging in...");
  $("#login-modal").modal("show");
});

$("#logout-btn").on("click", function () {
  console.debug("logging out...");
  const auth = getAuth();
  signOut(auth);
});

$("#login-modal").on("hidden.bs.modal", function () {
  $("#login-form").trigger("reset");
});

$("#login-submit-btn").on("click", function () {
  $("#login-error").text("");
  const email = $("#username-input").val();
  const password = $("#password-input").val();
  const auth = getAuth();

  setPersistence(auth, browserLocalPersistence).then(function () {
    signInWithEmailAndPassword(auth, email, password)
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
