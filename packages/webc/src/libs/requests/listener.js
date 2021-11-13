const { getFirestore } = require("firebase/firestore");

function setupRequestsListener() {
  console.debug("Listening for request changes");
  const db = getFirestore();
  return db.collection("requests").onSnapshot(() => {
    populateRequestsTable();
  });
}

module.exports = {
  setupRequestsListener,
};
