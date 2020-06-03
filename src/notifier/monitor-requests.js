const FirebaseHelper = require("./libs/FirebaseHelper");
const Email = require("./libs/Email");
const { createRequestEmailBody } = require("./libs/createEmailBody");

// Get config location
const sender = require("../../config/sender.json");

// Get firebase cert location
const firebaseCert = require("../../config/lanflix-firebase-cert.json");
const firebase = new FirebaseHelper(firebaseCert);

function waitForRequests(recipients) {
  firebase.db.collection("requests").onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      try {
        if (change.type === "added") {
          const data = change.doc.data();
          console.log(data);
          const name = change.doc.id;
          const email = new Email();
          email.setRecipients(recipients);

          if (data.mediaType) {
            email.setSubject(
              `${data.mediaType.toUpperCase()} requested by ${data.user}`
            );
            const emailBody = createRequestEmailBody(name, data);
            email.setBody(emailBody);
            email.sendEmail("Plex Server", "gmail", {
              user: sender.email,
              pass: sender.password,
            });
          } else {
            console.warn(`Request doesn't match required schema`);
          }
          firebase.removeFromRequests(name);
        }
      } catch (e) {
        console.error(e);
      }
    });
  });
}

firebase.getAdminEmail("Requests").then((recipients) => {
  waitForRequests(recipients);
});
