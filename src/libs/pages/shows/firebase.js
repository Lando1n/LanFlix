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
      console.log(showData);
      if (showData.subs.includes(user)) {
        subbed = true;
      }
    })
  return subbed;
}

/*
function changeSubOnFirebase(user, isSubbed) {
  const subsList = [];
  db.collection("shows")
  .doc(showName)
  .update({ subs: subsList });
}*/
