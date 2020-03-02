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
    
    $('#logged-in-username').text(user.email)
    $('#login-modal').hide();
    $('#site').show();

    openNav();

    // Check if the user exists yet, add it to list if not.
    getAllUsers().then((users) => {
      if (!users.includes(user.email)) {
        console.log('New user found, adding to database...')
        const db = firebase.firestore();
        db.collection('users').doc(user.email).set({
          email: user.email
        })
      }
      console.log(`Successfully loggged in as ${JSON.stringify(user.email)}`);
    });

    populateShowsTable(user.email);
    initializeUsersTable();
    initializeMoviesTable();
  } else {
    // User is signed out.
    $('#login-modal').show();
    $('#site').hide();

    destroySubsTable();
    destroyUsersTable();
    destroyMoviesTable();
  }
});
