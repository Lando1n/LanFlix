const getMediaInfo = require("./libs/getMediaInfo");
const getEmailContent = require("./libs/email/getEmailContent");

const media = getMediaInfo();

const dryRun =
  process.argv.includes("--dry-run") || process.argv.includes("--dryrun");

getEmailContent(media).then((emailContent) => {
  if (!dryRun) {
    firebase.queueEmail(emailContent);
  } else {
    console.log(`Subject: ${emailContent.subject}`);
    console.log(`Recipients: ${emailContent.recipients}`);
    console.log(`Body: ${emailContent.body}`);
    console.log("Dry run selected, email not being sent.");
  }
});
