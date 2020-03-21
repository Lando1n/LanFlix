const FirebaseHelper = require('./libs/FirebaseHelper');
const Media = require('./libs/Media');
const Email = require('./libs/Email');
const {createShowEmailBody, createMovieEmailBody, createNewShowEmailBody} = require('./libs/createEmailBody');


async function notify(mediaName, firebaseCert) {
  const firebase = new FirebaseHelper(firebaseCert);
  const media = new Media(mediaName);
  const email = new Email();
  
  // Determine the recipients
  if (media.type === 'movie') {
    const recipients = await firebase.getMovieSubs('all');
    email.setRecipients(recipients);
    email.setSubject(`Movie Alert: ${media.name}`);
    const emailBody = createMovieEmailBody(media.name);
    email.setBody(emailBody);
  
  } else if (media.type === 'show' || media.type === 'season') {
    const showExists = await firebase.doesShowExist(media.name);
    if (showExists) {
      const recipients = await firebase.getShowSubs(media.name);
      email.setRecipients(recipients);
      email.setSubject(`Show Alert: ${media.name}`);
      const emailBody = createShowEmailBody(media.name);
      email.setBody(emailBody);
    } else {
      // Send special email
      const recipients = await firebase.getAllUsers();
      email.setRecipients(recipients);
      email.setSubject(`New Show Alert: ${media.name}`);
      const emailBody = createNewShowEmailBody(media.name);
      email.setBody(emailBody);
      firebase.addShowToList(media.name);
    }
    
  } else {
    throw new Error(`Unrecognized media type '${media.type}'`);
  }
  
  const dryRun = true;
  // Send email if not dry-run
  if (!dryRun) {
    email.sendEmail(sender.name, 'gmail', {user: sender.email, pass: sender.password});
  } else {
    console.log('Not sending email because dry-run is set.');
  }
}

// Parse arguments
const mediaName = process.argv[2];

if (mediaName === undefined) {
  throw new Error('No media name passed as script argument');
}

// Get config location
const sender = require('./config/sender.json')

// Get firebase cert location
const firebaseCert = require('./config/lanflix-firebase-cert.json');

notify(mediaName, firebaseCert);
