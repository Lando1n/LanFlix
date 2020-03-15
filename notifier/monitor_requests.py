import os
import logging
import argparse

from src.Notify import Notify
from src.firebase.FirestoreHelper import FirestoreHelper

# Setup the commandline arguments
parser = argparse.ArgumentParser()

parser.add_argument('-v', '--verbose', action='store_true',
                    help='Show debugging information on the console')

args = parser.parse_args()

log_format = "%(asctime)s request monitor: %(message)s"
# Setup the Logger
if (args.verbose):
    logging_level = logging.DEBUG
else:
    logging_level = logging.INFO
logging.basicConfig(format=log_format,
                    level=logging_level)


# Get the firebase cert location
dir_path = os.path.dirname(os.path.realpath(__file__))
cert_file = os.path.join(*[dir_path, 'config', 'lanflix-firebase-cert.json'])
config_location = os.path.join(*[dir_path, "config", "config.ini"])

notify = Notify(config_location, cert_file)


def on_snapshot(doc_snapshot, changes, read_time):
    for change in changes:
        if change.type.name == 'ADDED':
            request_name = change.document.id
            request_type = change.document.to_dict()['type']

            logging.debug('{0} requested: {1}'.format(request_type,
                                                      request_name))
            if request_type == 'movie':
                # Send sender email for movie request
                sender = notify.request_movie(request_name)
            elif request_type == 'shows':
                # Create sender email for show request
                sender = notify.request_show(request_name)
            sender.send_notification()
            # Remove request when fulfilled
            notify.firestore_helper.db.collection(
                u'requests').document(request_name).delete()


if __name__ == "__main__":

    logging.debug('Monitoring snapshot...')

    query = notify.firestore_helper.db.collection(u'requests')
    query_watch = query.on_snapshot(on_snapshot)

    while(True):
        if query_watch._closed:
            logging.debug('Movie snapshot query closed, restarting.')
            query_watch = query.on_snapshot(on_snapshot)
