async function getAllShowDocuments() {
  let shows;
  const db = firebase.firestore();
  await db
    .collection("shows")
    .get()
    .then(function(querySnapshot) {
      shows = querySnapshot;
    });
  return shows;
}

async function getAllShowsForUser(user) {
  const subbedShows = [];
  const db = firebase.firestore();
  await db
    .collection("shows")
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(show => {
        const showData = show.data();
        if (showData.subs.includes(user)) {
          subbedShows.push(show.id);
        }
      });
    });
  return subbedShows;
}

function addShowToFirebase(showName) {
  const db = firebase.firestore();

  db.collection("shows")
    .doc(showName)
    .set({ subs: [] });
}

function deleteShowFromFirebase(showName) {
  const db = firebase.firestore();

  db.collection("shows")
    .doc(showName)
    .delete()
    .then(function() {
      console.debug("Show successfully deleted!");
    })
    .catch(function(error) {
      console.error("Error removing show: ", error);
    });
}

async function isUserSubscribedToShow(showName, user) {
  let subbed = false;
  const db = firebase.firestore();
  
  await db.collection("shows")
    .doc(showName)
    .get()
    .then(querySnapshot => {
      const showData = querySnapshot.data();
      if (showData.subs.includes(user)) {
        subbed = true;
      }
    })
  return subbed;
}

function changeSubOnFirebase(showName, isSubbed) {
  const db = firebase.firestore();
  const user = firebase.auth().currentUser.email;

  db.collection("shows")
    .doc(showName)
    .get()
    .then(querySnapshot => {
      const subs = querySnapshot.data().subs;
      if (isSubbed) {
        if (subs.includes(user)) {
          return;
        }
        subs.push(user);
      } else {
        if (!subs.includes(user)) {
          return;
        }
        const index = subs.indexOf(user);
        subs.splice(index, index);
      }

      db.collection("shows")
        .doc(showName)
        .update({ subs: subs });
    });
}
