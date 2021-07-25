const FirebaseHelper = require("../libs/FirebaseHelper");
// Get firebase cert location
const firebaseCert = require("../../../config/lanflix-firebase-cert.json");
const firebase = new FirebaseHelper(firebaseCert);

const showId = process.argv[2];
if (showId) {
  firebase.disableShow(showId);
}
