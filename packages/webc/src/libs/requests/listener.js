const {
  collection,
  getFirestore,
  onSnapshot,
  query,
} = require("firebase/firestore");
const { populateRequestsTable } = require("../datatableFunctions");

function setupRequestsListener() {
  console.debug("Listening for request changes");
  const db = getFirestore();
  const q = query(collection(db, "requests"));
  return onSnapshot(q, () => {
    populateRequestsTable();
  });
}

module.exports = {
  setupRequestsListener,
};
