const functions = require('firebase-functions');
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

const FirebaseHelper = require('./libs/FirebaseHelper');
const Email = require('./libs/Email');
const { createRequestEmailBody } = require('./libs/createEmailBody');

// Get firebase cert location
const firebaseHelper = new FirebaseHelper(admin);

exports.requestMonitor = functions.firestore
  .document('requests/{mediaId}')
  .onCreate((snap, context) => {
    const media = snap.data();
    const name = context.params.mediaId;

    return firebaseHelper.getAdminEmail('Requests').then((recipients) => {
      const email = new Email();
      email.setRecipients(recipients);
      if (media.type !== 'placeholder') {
        email.setSubject(`${media.type.toUpperCase()} Requested`);
        const emailBody = createRequestEmailBody(name, media.type, media.user);
        email.setBody(emailBody);
        email.sendEmail('Plex Server', functions.config().sender.provider, {
          user: functions.config().sender.email,
          pass: functions.config().sender.password,
        });
        
        // firebaseHelper.removeFromRequests(name);
      }
      return recipients;
    }).catch((error) => {
      console.warn(`Failed to send email.`);
      throw error;
    });
  });
