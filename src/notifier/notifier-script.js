const FirebaseHelper = require("./libs/FirebaseHelper");
const Media = require("./libs/Media");
const {
  createShowEmailBody,
  createMovieEmailBody,
  createNewShowEmailBody,
} = require("./libs/createEmailBody");

async function getEmailContent(media, firebase) {
  let recipients;
  let subject;
  let body;

  console.log(JSON.stringify(media));

  // Determine the recipients
  switch (media.type) {
    case "movie":
      recipients = await firebase.getMovieSubs("all");
      subject = `Movie Alert: ${media.name}`;
      body = createMovieEmailBody(media.name);
      break;
    case "season":
    case "show":
      if (await firebase.doesShowExist(media.name)) {
        recipients = await firebase.getShowSubs(media.name);
        subject = `Show Alert: ${media.name}`;
        body = createShowEmailBody(media.name);
      } else {
        // Send special email for a new show on the server
        recipients = await firebase.getAllUsers();
        subject = `New Show Alert: ${media.name}`;
        body = createNewShowEmailBody(media.name);
        firebase.addShowToList(media.name);
      }
      break;
    default:
      throw new Error(`Unrecognized media type '${media.type}'`);
  }
  return { recipients, subject, body };
}

const media = new Media(process.argv[2]);
const firebaseCert = require("../../config/lanflix-firebase-cert.json");
const firebase = new FirebaseHelper(firebaseCert);

getEmailContent(media, firebase).then((emailContent) => {
  firebase.queueEmail(emailContent);
});
