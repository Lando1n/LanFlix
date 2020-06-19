function initializeUser() {
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

// eslint-disable-next-line no-unused-vars
function changeSubOnFirebase(name, isSubbed, collection) {
  const db = firebase.firestore();
  const user = firebase.auth().currentUser.email;

  db.collection(collection)
    .doc(name)
    .get()
    .then((querySnapshot) => {
      let subs = querySnapshot.data().subs;
      const index = subs.indexOf(user);
      if (isSubbed) {
        // Unsubscribe
        if (index !== -1) subs.splice(index, 1);
      } else {
        //Subscribe
        if (index === -1) subs.push(user);
      }

      db.collection(collection).doc(name).update({ subs: subs });
    });
}

// eslint-disable-next-line no-unused-vars
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
