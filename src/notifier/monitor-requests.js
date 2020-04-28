const FirebaseHelper = require("./libs/FirebaseHelper");
const Email = require("./libs/Email");
const { createRequestEmailBody } = require("./libs/createEmailBody");

// Get config location
const sender = require("../../config/sender.json");

// Get firebase cert location
const firebaseCert = require("../../config/lanflix-firebase-cert.json");
const firebase = new FirebaseHelper(firebaseCert);

function waitForRequests() {
  firebase.db.collection("requests").onSnapshot(function (querySnapshot) {
    querySnapshot.forEach(async function (doc) {
      const data = doc.data();
      const email = new Email();
      const recipients = await firebase.getAdminEmail("Requests");
      email.setRecipients(recipients);
      if (data.mediaType && data.mediaType !== "placeholder") {
        const name = doc.id;
        email.setSubject(
          `${data.mediaType.toUpperCase()} requested by ${data.requester}`
        );
        const emailBody = createRequestEmailBody(name, data);
        email.setBody(emailBody);
        email.sendEmail("Plex Server", "gmail", {
          user: sender.email,
          pass: sender.password,
        });
        firebase.removeFromRequests(doc.id);
      }
    });
  });
}

waitForRequests();
