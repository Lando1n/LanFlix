const FirebaseHelper = require('./libs/FirebaseHelper');
const Email = require('./libs/Email');
const {createRequestEmailBody} = require('./libs/createEmailBody');

// Get config location
const sender = require('../../config/sender.json');

// Get firebase cert location
const firebaseCert = require('../../config/lanflix-firebase-cert.json');
const firebase = new FirebaseHelper(firebaseCert);

function waitForRequests() {
  firebase.db.collection("requests")
    .onSnapshot(function(querySnapshot) {
      querySnapshot.forEach(async function(doc) {
      const email = new Email();
      const recipients = await firebase.getAdminEmail('Requests');
      email.setRecipients(recipients);
      if (doc.data().type !== 'placeholder') {
        const name = doc.id;
        const type = doc.data().mediaType;
        const requester = doc.data().user;
        const which = doc.data().which;
        email.setSubject(`${type.toUpperCase()} Requested`)
        const emailBody = createRequestEmailBody(name, type, requester, which);
        email.setBody(emailBody);
        email.sendEmail('Plex Server', 'gmail', { user: sender.email, pass: sender.password })
        firebase.removeFromRequests(doc.id);
      }
    });
  });
}

waitForRequests();
