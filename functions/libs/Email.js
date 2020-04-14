const nodemailer = require('nodemailer');

class Email {
  constructor() {
    this.to = '';
    this.from = '';
    this.subject = 'Email Notification';
    this.bodyContent = '';
  }

  setSubject(subject) {
    this.subject = subject;
  }
  
  setBody(bodyContent) {
    this.bodyContent = bodyContent;
  }

  setRecipients(recipients = []) {
    if (recipients) {
      this.to = recipients.join(', ');
    } else {
      console.warn('Recipients do not exist.')
    }
  }

  sendEmail(senderName, emailProvider, auth = {}) {
    console.debug(`Sending email to: ${this.to}`);
    if (!this.to) {
      throw new Error('Reciepients not set');
    }

    var transporter = nodemailer.createTransport({
      service: emailProvider,
      auth
    });
    
    var mailOptions = {
      from: `${senderName} <${auth.user}>`,
      to: this.to,
      subject: this.subject,
      html: this.bodyContent,
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        throw new Error(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    }); 
  }
}

module.exports = Email;
