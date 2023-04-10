const FirebaseHelper = require("./libs/FirebaseHelper");
const { createRequestEmailBody } = require("./libs/email/emailTemplates");
const sendEmail = require("./libs/email/sendEmail");

// Get firebase cert location
const firebaseCert = require("../../config/lanflix-firebase-cert.json");

const firebase = new FirebaseHelper(firebaseCert);

async function startMonitors() {
  const {version} = require('./package.json');
  console.log(`Initializing LanFlix Monitor, version: ${version}`);
  // start monitoring the email queue
  firebase.db.collection("email").onSnapshot((snapshot) => {
    snapshot.docChanges().forEach(async (change) => {
      try {
        const data = change.doc.data();
        console.log(data);
        switch (change.type) {
          case "added":
            const {
              recipients: bcc,
              body: html,
              subject,
              ...remainingData
            } = data;
            await sendEmail({ bcc, html, subject });
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

  // Start monitoring for requests
  const recipients = await firebase.getAdminEmail("Requests");
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
}

startMonitors();
