const FirebaseHelper = require("./libs/FirebaseHelper");
const Email = require("./libs/email/Email");

const { createRequestEmailBody } = require("./libs/email/emailTemplates");

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
          email.to = data.recipients;
          email.subject = data.subject;
          email.body = data.body;
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
    snapshot.docChanges().forEach(async (change) => {
      let name;
      try {
        const data = change.doc.data();
        name = change.doc.id;

        switch (change.type) {
          case "added":
            if (data.status === "Pending") {
              console.debug(`${name} has been requested`);
              if (data.mediaType) {
                const subject = `${data.mediaType.toUpperCase()} requested by ${
                  data.user
                }`;
                const body = await createRequestEmailBody(name, data);
                firebase.queueEmail({ subject, body, recipients });
              } else {
                console.warn(`Media type not defined, request not made.`);
                firebase.updateRequestStatus(
                  name,
                  "Failed request (invalid media type)"
                );
              }
              firebase.updateRequestStatus(name, "Requested");
            }
            break;
          default:
            console.warn(`No implementation for '${change.type}'`);
            break;
        }
      } catch (e) {
        console.error(e);
        if (name) {
          firebase.updateRequestStatus(name, "Failed request (error)");
        }
      }
    });
  });
});
