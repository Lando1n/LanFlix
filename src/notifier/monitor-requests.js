const FirebaseHelper = require("./libs/FirebaseHelper");

const { createRequestEmailBody } = require("./libs/createEmailBody");

// Get firebase cert location
const firebaseCert = require("../../config/lanflix-firebase-cert.json");
const firebase = new FirebaseHelper(firebaseCert);

function waitForRequests(recipients) {
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
            console.warn(`No implementation for ${change.type}`);
            break;
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
