const FirebaseHelper = require("./libs/FirebaseHelper");
const Email = require("./libs/Email");

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
          console.warn(`No implementation for ${change.type}`);
          break;
      }
    } catch (e) {
      console.error(e);
    }
  });
});
