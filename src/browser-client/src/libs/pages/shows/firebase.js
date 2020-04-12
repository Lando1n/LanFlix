// eslint-disable-next-line no-unused-vars
async function getAllShowDocuments() {
  let shows;
  const db = firebase.firestore();
  await db
      .collection('shows')
      .get()
      .then(function(querySnapshot) {
        shows = querySnapshot;
      });
  return shows;
}

// eslint-disable-next-line no-unused-vars
async function getAllShowsForUser(user) {
  const subbedShows = [];
  const db = firebase.firestore();
  await db
      .collection('shows')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((show) => {
          const showData = show.data();
          if (showData.subs.includes(user)) {
            subbedShows.push(show.id);
          }
        });
      });
  return subbedShows;
}

// eslint-disable-next-line no-unused-vars
function addShowToFirebase(showName) {
  const db = firebase.firestore();

  db.collection('shows')
      .doc(showName)
      .set({subs: []});
}

// eslint-disable-next-line no-unused-vars
function deleteShowFromFirebase(showName) {
  const db = firebase.firestore();

  db.collection('shows')
      .doc(showName)
      .delete()
      .then(function() {
        console.debug('Show successfully deleted!');
      })
      .catch(function(error) {
        console.error('Error removing show: ', error);
      });
}

// eslint-disable-next-line no-unused-vars
async function isUserSubscribedToShow(showName, user) {
  let subbed = false;
  const db = firebase.firestore();

  await db.collection('shows')
      .doc(showName)
      .get()
      .then((querySnapshot) => {
        const showData = querySnapshot.data();
        if (showData.subs.includes(user)) {
          subbed = true;
        }
      });
  return subbed;
}

// eslint-disable-next-line no-unused-vars
function changeSubOnFirebase(showName, isSubbed) {
  const db = firebase.firestore();
  const user = firebase.auth().currentUser.email;

  db.collection('shows')
      .doc(showName)
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

        db.collection('shows')
            .doc(showName)
            .update({subs: subs});
      });
}
