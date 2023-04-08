const FirebaseHelper = require("./libs/FirebaseHelper");
const {
  createShowEmailBody,
  createMovieEmailBody,
  createNewShowEmailBody,
} = require("./libs/email/emailTemplates");

async function getEmailContent(media, firebase) {
  let recipients;
  let subject;
  let body;

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
    case "test":
      recipients = await firebase.getAdminEmail("Testing");
      subject = "Movie Alert: TEST";
      body = await createMovieEmailBody(media.name);
    default:
      throw new Error(`Unrecognized media type '${media.type}'`);
  }
  return { recipients, subject, body };
}

let media;
const eventType = process.env.sonarr_eventtype || process.env.radarr_eventtype;
switch (eventType) {
  case "Download":
    let type;
    let name;
    if (process.env.sonarr_series_title) {
      type = "show";
      name = process.env.sonarr_series_title;
    } else if (process.env.radarr_movie_title) {
      type = "movie";
      name = process.env.radarr_movie_title;
    } else {
      throw Error(`No Download handling configured for this context.`);
    }
    media = {
      type,
      name,
    };
    break;
  case "Test":
    media = {
      type: "test",
      name: "Dave"
    };
    return
  default:
    throw Error(`No event type handling for ${eventType}`);
}

const firebaseCert = require("../../config/lanflix-firebase-cert.json");
const firebase = new FirebaseHelper(firebaseCert);

const dryRun =
  process.argv.includes("--dry-run") || process.argv.includes("--dryrun");

getEmailContent(media, firebase).then((emailContent) => {
  if (!dryRun) {
    //firebase.queueEmail(emailContent);
  } else {
    console.log(`Subject: ${emailContent.subject}`);
    console.log(`Recipients: ${emailContent.recipients}`);
    console.log(`Body: ${emailContent.body}`);
    console.log("Dry run selected, email not being sent.");
  }
});
