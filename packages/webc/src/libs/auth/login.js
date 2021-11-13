const { signOut } = require("firebase/auth");

function logout() {
  signOut()
    .then(function () {
      console.debug("Sign out successful");
    })
    .catch(function (error) {
      console.error("Failed to sign out: " + error);
    });
}

module.exports = {
  logout,
};
