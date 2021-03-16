/**
 * Add a newly logged in user to the users list.
 */
function initializeUser() {
  console.log("New user found, adding to database...");
  const db = firebase.firestore();
  const email = firebase.auth().currentUser.email;
  db.collection("users").doc(email).set({
    email,
  });
}

/**
 * Add or remove a user from the subs list of a specific subscription.
 *
 * @param {boolean} subscribe
 * @param {String} name - Name of the show or movie type to toggle
 * @param {String} collection - Firebase collection name to modify
 */
function changeSubOnFirebase(subscribe, name, collection) {
  const db = firebase.firestore();
  const user = firebase.auth().currentUser.email;

  db.collection(collection)
    .doc(name)
    .get()
    .then((querySnapshot) => {
      let subs = querySnapshot.data().subs;
      const index = subs.indexOf(user);
      if (subscribe) {
        // Unsubscribe
        if (index === -1) subs.push(user);
      } else {
        //Subscribe
        if (index !== -1) subs.splice(index, 1);
      }
      db.collection(collection).doc(name).update({ subs: subs });
    });
}

/**
 * Return list of all registered users.
 */
async function getAllUsers() {
  const users = [];
  const db = firebase.firestore();
  await db
    .collection("users")
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach((user) => {
        users.push(user.id);
      });
    });
  return users;
}

/**
 * Returns all of the website settings.
 */
async function getSettings() {
  const db = firebase.firestore();
  return db
    .collection("settings")
    .doc("website")
    .get()
    .then((querySnapshot) => querySnapshot.data());
}
