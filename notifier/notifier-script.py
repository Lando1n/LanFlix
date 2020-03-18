#!/usr/bin/env python3
import argparse
import os
import sys
import logging

from src.Notify import Notify

__version__ = '1.0.1'

# Setup the commandline arguments
parser = argparse.ArgumentParser()

option = parser.add_mutually_exclusive_group(required=True)

option.add_argument('-l', '--location',
                    help='The path of the media file or directory')
option.add_argument('-n', '--name',
                    help='The name of a show')
option.add_argument('--request_show',
                    help='Send an email to the admin about a show request')
option.add_argument('--request_movie',
                    help='Send an email to the admin about a movie request')
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
    # Get the email sender configuration location
    config_location = os.path.join(*[dir_path, "config", "config.ini"])
    # Get the firebase cert location
    cert_file = os.path.join(*[dir_path,
                               'config',
                               'lanflix-firebase-cert.json'])

    notify = Notify(config_location, cert_file)

    sender = None
    # Determine the media type and name
    if args.location or args.name:
        if args.location:
            name = os.path.basename(args.location)
        else:
            name = args.name
        sender = notify.media_notify(name)
    elif args.vpn_notify:
        sender = notify.vpn_notify()
    elif args.request_show:
        sender = notify.request_show(args.request_show)
    elif args.request_movie:
        sender = notify.request_movie(args.request_movie)

    if sender:
        logging.debug('Email subject contents: {0}'.format(sender.subject))
        logging.debug('Email body contents:\n{0}'.format(sender.body))

    # Check if it's a dry run
    if not args.dry_run:
        # Send the emails if not
        try:
            sender.send_notification()
        except Exception as e:
            logging.warn('Failed to initialize sender.\n${0}'.format(e))
    else:
        logging.info('Not sending email because of dry run being selected')
