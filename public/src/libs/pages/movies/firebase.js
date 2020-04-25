// eslint-disable-next-line no-unused-vars
function changeMovieSubOnFirebase(movieType, isSubbed) {
  const db = firebase.firestore();
  const user = firebase.auth().currentUser.email;

  db.collection("movies")
    .doc(movieType)
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

      db.collection("movies").doc(movieType).update({ subs: subs });
    });
}