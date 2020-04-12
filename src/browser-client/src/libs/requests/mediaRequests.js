// eslint-disable-next-line no-unused-vars
function makeRequest(name, mediaType) {
  if (!['show', 'movie'].includes(mediaType)) {
    throw new Error('Request needs to be either a movie or a show');
  }
  const user = firebase.auth().currentUser.email;
  const db = firebase.firestore();
  db.collection('requests').doc(name).set({type: mediaType, user: user});
}
