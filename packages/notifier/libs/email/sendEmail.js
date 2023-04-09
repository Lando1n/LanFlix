const nodemailer = require("nodemailer");
const auth = require("../../../../config/sender.json");

async function sendEmail(mailOptions) {
  const transporter = nodemailer.createTransport({
    debug: true,
    logger: true,
    service: 'gmail',
    auth,
  });

  const defaultOptions = {
    from: `${auth.name || 'Lanflix'} <${auth.user}>`,
  };

  const options = Object.assign({}, defaultOptions, mailOptions);
  await transporter.sendMail(options);
  console.log(`Email send with options: ${options}`)
}

module.exports = sendEmail;
