const nodemailer = require("nodemailer");

class Email {
  constructor() {
    this.to = "";
    this.from = "";
    this.subject = "Email Notification";
    this.body;
  }

  sendEmail(senderName = "LanFlix", emailProvider, auth = {}) {
    const to = Array.isArray(this.to) ? this.to.join(", ") : this.to;

    if (!to) {
      throw new Error("Recipients not set");
    }
    console.debug(`Sending email to: ${to}`);

    const transporter = nodemailer.createTransport({
      debug: true,
      logger: true,
      service: emailProvider,
      auth,
    });

    const mailOptions = {
      from: `${senderName} <${auth.user}>`,
      to,
      subject: this.subject,
      html: this.body,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
}

module.exports = Email;
