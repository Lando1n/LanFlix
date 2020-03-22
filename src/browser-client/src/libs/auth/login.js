// eslint-disable-next-line no-unused-vars
function logout() {
  firebase
      .auth()
      .signOut()
      .then(function() {
        console.debug('Sign out successful');
      })
      .catch(function(error) {
        console.error('Failed to sign out: ' + error);
      });
}
