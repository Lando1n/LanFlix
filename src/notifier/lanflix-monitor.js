const FirebaseHelper = require("./libs/FirebaseHelper");
const Email = require("./libs/Email");

const { createRequestEmailBody } = require("./libs/createEmailBody");

// Get config location
const sender = require("../../config/sender.json");

// Get firebase cert location
const firebaseCert = require("../../config/lanflix-firebase-cert.json");
const firebase = new FirebaseHelper(firebaseCert);

firebase.db.collection("email").onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    try {
      const data = change.doc.data();
      console.log(data);
      const email = new Email();
      switch (change.type) {
        case "added":
          email.setRecipients(data.recipients);
          email.setSubject(data.subject);
          email.setBody(data.body);
          email.sendEmail(sender.name, "gmail", {
            user: sender.email,
            pass: sender.password,
          });
          firebase.removeEmailFromQueue(change.doc.id);
          break;
        default:
          console.warn(`No implementation for '${change.type}'`);
          break;
      }
    } catch (e) {
      if (e.toString().includes("Error: Recipients not set")) {
        firebase.removeEmailFromQueue(change.doc.id);
      }
      console.error(e);
    }
  });
});

firebase.getAdminEmail("Requests").then((recipients) => {
  firebase.db.collection("requests").onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      try {
        const data = change.doc.data();
        console.log(data);
        const name = change.doc.id;

        switch (change.type) {
          case "added":
            if (data.mediaType) {
              const subject = `${data.mediaType.toUpperCase()} requested by ${
                data.user
              }`;
              const body = createRequestEmailBody(name, data);
              firebase.queueEmail({ subject, body, recipients });
            } else {
              console.warn(`Media type not defined, request not made.`);
            }
            firebase.removeFromRequests(name);
            break;
          default:
            console.warn(`No implementation for '${change.type}'`);
            break;
        }
      } catch (e) {
        console.error(e);
      }
    });
  });
});
