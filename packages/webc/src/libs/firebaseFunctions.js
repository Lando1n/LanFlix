const {
  getFirestore,
  doc,
  collection,
  getDoc,
  getDocs,
  updateDoc,
  query,
  setDoc,
} = require("firebase/firestore");
const { getAuth } = require("firebase/auth");

/**
 * Add a newly logged in user to the users list.
 */
async function initializeUser() {
  console.debug("New user found, adding to database...");

  const db = getFirestore();

  await setDoc(doc(db, "users", user.email), {
    email: user.email,
  });
}

/**
 * Add or remove a user from the subs list of a specific subscription.
 *
 * @param {boolean} subscribe
 * @param {String} name - Name of the show or movie type to toggle
 * @param {String} collectionName - Firebase collection name to modify
 */
async function changeSubOnFirebase(subscribe, name, collectionName) {
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser.email;

  const docRef = doc(db, collectionName, name);

  const docSnap = await getDoc(docRef);
  const subs = docSnap.data().subs;

  const index = subs.indexOf(user);
  if (subscribe) {
    // Subscribe
    if (index === -1) subs.push(user);
  } else {
    // Unsubscribe
    if (index !== -1) subs.splice(index, 1);
  }

  return await updateDoc(docRef, { subs: subs });
}

/**
 * Return list of all registered users.
 */
async function getAllUsers() {
  const users = [];
  const db = getFirestore();
  const q = query(collection(db, "users"));
  const userSnap = await getDocs(q);
  userSnap.forEach((user) => {
    users.push(user.id);
  });
  return users;
}

/**
 * Returns all of the website settings.
 */
async function getSettings() {
  const db = getFirestore();
  const docRef = doc(db, "settings", "website");
  const docSnap = await getDoc(docRef);
  return docSnap.data();
}

module.exports = {
  initializeUser,
  changeSubOnFirebase,
  getAllUsers,
  getSettings,
};
