import os
import logging

from configparser import ConfigParser
from .email_sender.EmailSender import EmailSender
from .firebase.FirestoreHelper import FirestoreHelper
from .media.Media import Media, MediaType


class Notify():
    def __init__(self, config_location, cert_location):
        if cert_location:
            self.firestore_helper = FirestoreHelper(cert_location)
        self.sender_info = self.get_sender_info(config_location)

    def get_sender_info(self, config_location):
        # Get the Email Sender from the config file
        if not os.path.exists(config_location):
            raise EnvironmentError('Configuration File cannot be found at: {0}'
                                   .format(config_location))

        logging.debug('Reading config from file: {0}'.format(config_location))
        config = ConfigParser()
        config.read(config_location)

        sender_details = dict()
        sender_details['name'] = config.get('SENDER', 'name')
        sender_details['email'] = config.get('SENDER', 'email')
        sender_details['password'] = config.get('SENDER', 'password')
        logging.debug("Sending email with: '{0}'"
                      .format(sender_details['email']))
        return sender_details

    def request_show(self, show_name):
        logging.debug('Creating requested show email content')
        emails_to_send_to = self.firestore_helper.get_request_email('shows')
        sender = EmailSender(self.sender_info, emails_to_send_to)
        sender.subject = "Show Requested: {0}".format(show_name)
        sender.body = ("")
        return sender

    def request_movie(self, movie_name):
        logging.debug('Creating requested movie email content')
        emails_to_send_to = self.firestore_helper.get_request_email('movies')
        sender = EmailSender(self.sender_info, emails_to_send_to)
        sender.subject = "Movie Requested: {0}".format(movie_name)
        sender.body = ("")
        return sender

    def media_notify(self, name):
        media = Media(name)

        logging.debug(
            'Finding subscribers for media: {0}'.format(media.name))
        emails_to_send = []
        # Check the Firestore for subs
        if media.type == MediaType.MOVIE:
            subbed_users = self.firestore_helper.get_movie_subs()
        else:
            subbed_users = self.firestore_helper.get_show_subs(media.name)
        # Check if any are subbed
        if subbed_users:
            # Find the email of each user
            for user in subbed_users:
                emails_to_send.append(
                    self.firestore_helper.get_user_email(user))

        sender = EmailSender(self.sender_info, emails_to_send)

        sender.subject = "{0} Alert: '{1}' has been downloaded"\
            " to the Plex!".format(media.type, media.name).strip()
        sender.body = (
            "Hey there!\n\n"
            "Just thought I'd let you know {0} has been download"
            " to the Plex Server. Any minute now it should be ready "
            "to be absorbed through your face cameras.\n"
            "Access your content on the Plex app for mobile, or at "
            "plex.tv/web on your computer. If you experience any "
            "inconveniences, please contact your local administrator."
            "\n\n"
            "Enjoy your {1}!\n\n"
            "- Your friendly neighbourhood robot.") \
            .format(media.name.upper(), media.type.lower()).strip()
        return sender

    def vpn_notify(self):
        logging.debug('Creating vpn notify email content')
        emails_to_send_to = self.firestore_helper.get_admin_email(
            'VPN_Monitoring')
        sender = EmailSender(self.sender_info, emails_to_send_to)
        sender.subject = "The VPN has been disconnected!"
        sender.body = (
            "This is a notification to state that your VPN has been"
            " disconnected on your server.")
        return sender
