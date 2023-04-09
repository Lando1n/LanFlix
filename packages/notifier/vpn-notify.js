const FirebaseHelper = require("./libs/FirebaseHelper");
const sendEmail = require("./libs/email/sendEmail");

// Get firebase cert location
const firebaseCert = require("../../config/lanflix-firebase-cert.json");

const firebase = new FirebaseHelper(firebaseCert);

async function vpnNotify() {
  const recipients = await firebase.getAdminEmail("VPN_Monitoring");
  await sendEmail({ bcc: recipients, subject: "VPN Disconnected!" });
}

vpnNotify();
