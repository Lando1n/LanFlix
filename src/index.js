const db = firebase.firestore();

getAllUsers().then((users) => {
  console.log(`Users: ${users}`);
});

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    /* User is signed in.
    const displayName = user.displayName;
    const email = user.email;
    const emailVerified = user.emailVerified;
    const photoURL = user.photoURL;
    const isAnonymous = user.isAnonymous;
    const uid = user.uid;
    const providerData = user.providerData;
    */
    $('#login-modal').hide();
    $('#site').show();

    openNav();

    addUsersToEditModal();

    const showTable = initializeSubsTable();
    populateShowsTable(showTable);
    initializeUsersTable();
    initializeMoviesTable();
  } else {
    // User is signed out.
    $('#login-modal').show();
    $('#site').hide();

    destroySubsTable();
    destroyUsersTable();
    destroyMoviesTable();
    clearEditModal();
  }
});

$(document).ready(function() {
  const user = firebase.auth().currentUser;

  if (user) {
    // User is signed in.
    $('#login-modal').hide();
    $('#site').show();

    openNav();

    addUsersToEditModal();

    const showTable = initializeSubsTable();
    populateShowsTable(showTable);
    initializeUsersTable();
    initializeMoviesTable();
  } else {
    // User is signed out.
    $('#login-modal').show();
    $('#site').hide();

    destroySubsTable();
    destroyUsersTable();
    destroyMoviesTable();
    clearEditModal();
  }
});
