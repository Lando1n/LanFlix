const FirebaseHelper = require('./libs/FirebaseHelper');
const Email = require('./libs/Email');

// Get config location
const sender = require('../../config/sender.json');

// Get firebase cert location
const firebaseCert = require('../../config/lanflix-firebase-cert.json');
const firebase = new FirebaseHelper(firebaseCert);

async function vpnNotify() {
  const email = new Email();
      const recipients = await firebase.getAdminEmail('VPN_Monitoring');
      email.setRecipients(recipients);
      email.setSubject('VPN Disconnected!');
      email.sendEmail(sender.name, 'gmail', { user: sender.email, pass: sender.password })
}

vpnNotify();
