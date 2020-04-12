
function changeMovieSubOnFirebase(movieType, isSubbed) {
  const db = firebase.firestore();
  const user = firebase.auth().currentUser.email;

  db.collection('movies')
      .doc(movieType)
      .get()
      .then((querySnapshot) => {
        let subs = querySnapshot.data().subs;
        if (isSubbed) {
          // Unsubscribe
          const index = subs.indexOf(user);
          if (index !== -1) subs.splice(index, 1);
        } else {
          //Subscribe
          if (subs.includes(user)) {
            return;
          }
          subs.push(user);
        }

        db.collection('movies')
            .doc(movieType)
            .update({subs: subs});
      });
}
