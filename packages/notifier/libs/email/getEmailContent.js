const FirebaseHelper = require("../FirebaseHelper");
const firebaseCert = require("../../config/lanflix-firebase-cert.json");

const {
  createShowEmailBody,
  createMovieEmailBody,
  createNewShowEmailBody,
} = require("./emailTemplates");

module.exports = async function getEmailContent(media) {
  let recipients;
  let subject;
  let body;

  const firebase = new FirebaseHelper(firebaseCert);

  // Determine the recipients
  switch (media.type) {
    case "movie":
      recipients = await firebase.getMovieSubs("all");
      subject = `Movie Alert: ${media.name}`;
      body = await createMovieEmailBody(media.name);
      break;
    case "season":
    case "show":
      const showExists = await firebase.doesShowExist(media.name);
      if (showExists) {
        const showDisabled = await firebase.isShowDisabled(media.name);
        // Re-enable the show if it has downloaded again
        if (!showDisabled) {
          firebase.enableShow(media.name);
        }
        recipients = await firebase.getShowSubs(media.name);
        subject = `Show Alert: ${media.name}`;
        body = await createShowEmailBody(media.name);
      } else {
        // Send special email for a new show on the server
        recipients = await firebase.getAllUsers();
        subject = `New Show Alert: ${media.name}`;
        body = await createNewShowEmailBody(media.name);
        firebase.addShowToList(media.name);
      }
      break;
    case "test-movie":
      recipients = await firebase.getAdminEmail("Testing");
      subject = `Movie Alert: ${media.name}`;
      body = await createMovieEmailBody(media.name);
      break;
    case "test-show":
      recipients = await firebase.getAdminEmail("Testing");
      subject = `Show Alert: ${media.name}`;
      body = await createShowEmailBody(media.name);
      break;
    default:
      throw new Error(`Unrecognized media type '${media.type}'`);
  }
  return { recipients, subject, body };
};
