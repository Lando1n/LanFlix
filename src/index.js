const db = firebase.firestore();

/*
getAllUsers().then((users) => {
  console.log(`Users: ${users}`);
});*/

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
    console.log(`Loggged in as ${JSON.stringify(user.email)}`);
    $('#logged-in-username').text(user.email)
    $('#login-modal').hide();
    $('#site').show();

    openNav();

    addUsersToEditModal();

    const showTable = initializeSubsTable();
    populateShowsTable(showTable, user.email);
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
