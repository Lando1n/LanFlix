firebase.auth().onAuthStateChanged(async (user) => {
  if (user && user.emailVerified) {
    $("#logged-in-username").text(user.email);
    $("#login-modal").hide();
    $("#banner").show();
    $("#topbar").show();
    $("#main").show();

    selectPage(null, "shows-page");
    // Check if the user exists yet, add it to list if not.
    const users = await getAllUsers();

    if (!users.includes(user.email)) {
      console.log("New user found, adding to database...");
      const db = firebase.firestore();
      db.collection("users").doc(user.email).set({
        email: user.email,
      });
      // Add user to users list
      db.collection("movies")
        .doc("all")
        .get()
        .then((querySnapshot) => {
          const subs = querySnapshot.data().subs;
          console.log(subs);
          if (subs.includes(user.email)) {
            return;
          }
          subs.push(user.email);

          db.collection("movies").doc("all").update({ subs: subs });
        });
    }
    console.log(`Successfully loggged in as ${JSON.stringify(user.email)}`);

    populateShowsTable(user.email);
    initializeUsersTable();
    populateMoviesTable();
  } else if (user) {
    // User has not verified their email yet
    $("#login-modal").show();
    $("#banner").hide();
    $("#topbar").hide();
    $("#main").hide();

    $("#login-error").text("Email not verified. Verify and try again.");
    sendEmailVerification(user);
    firebase.auth().signOut();
  } else {
    destroySubsTable();
    destroyUsersTable();
    destroyMoviesTable();
    window.location = "index.html";
  }
});
