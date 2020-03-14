#!/usr/bin/env python3
import argparse
import os
import sys
import logging

import src.notify as notify
from src.email_sender.EmailSender import EmailSender
from src.firebase.FirestoreHelper import FirestoreHelper
from src.media.Media import Media, MediaType

__version__ = '1.0.1'

# Setup the commandline arguments
parser = argparse.ArgumentParser()

option = parser.add_mutually_exclusive_group(required=True)

option.add_argument('-l', '--location',
                    help='The path of the media file or directory')
option.add_argument('-n', '--name',
                    help='The name of a show')
option.add_argument('--vpn_notify', action='store_true',
                    help='Send an error email to the admin, usually used for '
                    'vpn disconnection')
parser.add_argument('--dry-run', action='store_true',
                    help='Run the notifier script without sending any emails.')
parser.add_argument('-v', '--verbose', action='store_true',
                    help='Show debugging information on the console')

args = parser.parse_args()

# Configure the logging file
log_format = "%(asctime)s notifier: %(message)s"
dir_path = os.path.dirname(os.path.realpath(__file__))
logging_file = os.path.join(dir_path, 'last_run.txt')
# Remove old logging file
if (os.path.exists(logging_file)):
    os.remove(logging_file)

# Setup the Logger
if (args.verbose):
    logging_level = logging.DEBUG
else:
    logging_level = logging.INFO
logging.basicConfig(filename=logging_file,
                    format=log_format,
                    level=logging_level)
logging.getLogger().addHandler(logging.StreamHandler(sys.stdout))


if __name__ == "__main__":
    logging.info('Running Notifier Script')
    # Get the email sending info from the config file
    config_location = os.path.join(*[dir_path, "config", "config.ini"])
    sender_info = notify.get_sender_info(config_location)
    # Determine who should receive the email for this media
    cert_file = os.path.join(*[dir_path,
                               'config',
                               'lanflix-firebase-cert.json'])

    firestore_helper = FirestoreHelper(cert_file)

    # Determine the media type and name
    if args.location or args.name:
        if args.location:
            name = os.path.basename(args.location)
        else:
            name = args.name

        media = Media(name)

        logging.debug(
            'Finding subscribers for media: {0}'.format(media.name))
        emails_to_send = []
        # Check the Firestore for subs
        if media.type == MediaType.MOVIE:
            subbed_users = firestore_helper.get_movie_subs()
        else:
            subbed_users = firestore_helper.get_show_subs(media.name)
        # Check if any are subbed
        if subbed_users:
            # Find the email of each user
            for user in subbed_users:
                emails_to_send.append(firestore_helper.get_user_email(user))

        sender = EmailSender(sender_info, emails_to_send)

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
    elif args.vpn_notify:
        emails_to_send_to = firestore_helper.get_admin_email('VPN_Monitoring')
        sender = EmailSender(sender_info, emails_to_send_to)
        sender.subject = "The VPN has been disconnected!"
        sender.body = (
            "This is a notification to state that your VPN has been"
            " disconnected on your server.")

    # Check if it's a dry run
    if not args.dry_run:
        # Send the emails if not
        sender.send_notification()
    else:
        logging.info('Not sending email because of dry run being selected')
