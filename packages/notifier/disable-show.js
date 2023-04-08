const FirebaseHelper = require("./libs/FirebaseHelper");

const firebaseCert = require("../../config/lanflix-firebase-cert.json");
const firebase = new FirebaseHelper(firebaseCert);

const showId = process.env.sonarr_series_title;
if (showId) {
  firebase.disableShow(showId);
}
