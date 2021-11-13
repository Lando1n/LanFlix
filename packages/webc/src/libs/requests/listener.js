function setupRequestsListener() {
  console.debug("Listening for request changes");
  const db = firebase.firestore();
  return db.collection("requests").onSnapshot(() => {
    populateRequestsTable();
  });
}
