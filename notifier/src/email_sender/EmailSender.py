import smtplib
import time
import logging


class EmailSender:
    def __init__(self, sender_info, recipients):
        self._recipients = recipients
        self._sender_name = sender_info['name']
        self._sender_email = sender_info['email']
        self._sender_password = sender_info['password']
        self.subject = None
        self.body = None

    def send_notification(self, attempt=1):
        if len(self._recipients) < 1 or self._recipients is None:
            raise Exception("No recipients have been selected"
                            "to send an email to!")
        if self._sender_email is None:
            raise EnvironmentError("Sender email not specified")
        if self._sender_password is None:
            raise EnvironmentError("Sender password not set")
        if self.subject is None:
            raise EnvironmentError("Subject is not set for email")
        if self.body is None:
            raise EnvironmentError("Email body has not been set")
        if self._sender_name is None:
            raise EnvironmentError("Sender name not set")

        logging.info(
            "Attempting to send notification to: {0}".format(self._recipients))
        msg_content = 'From: {0}\r\nSubject: {1}\n{2}'\
            .format(self._sender_name, self.subject, self.body)

        server = None
        try:
            server = smtplib.SMTP('smtp.gmail.com', 587)
            server.ehlo()
            server.starttls()
            server.login(self._sender_email, self._sender_password)
            server.sendmail(self._sender_email, self._recipients, msg_content)
            logging.info("Email sent!")
        except Exception as e:
            time.sleep(600)
            if attempt < 3:
                self.send_notification(attempt=attempt+1)
            raise Exception("Email wasn't able to be sent: {0}".format(e))
        finally:
            if server:
                logging.info("Quitting email server...")
                server.quit()
        return True
