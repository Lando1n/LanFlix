import os
import logging
import argparse

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


def on_snapshot(doc_snapshot, changes, read_time):
    for change in changes:
        if change.type.name == 'MODIFIED':
            logging.debug('New {0} requested: {1}'.format(
                change.document.id[:-1], change.document.to_dict()))


if __name__ == "__main__":
    # Get the firebase cert location
    dir_path = os.path.dirname(os.path.realpath(__file__))
    cert_file = os.path.join(*[dir_path,
                               'config',
                               'lanflix-firebase-cert.json'])

    firestore_helper = FirestoreHelper(cert_file)

    logging.debug('Monitoring snapshot...')
    movie_query = firestore_helper.db.collection(
        u'requests').document(u'movies')
    movie_query_watch = movie_query.on_snapshot(on_snapshot)

    show_query = firestore_helper.db.collection(u'requests').document(u'shows')
    show_query_watch = show_query.on_snapshot(on_snapshot)

    while(True):
        if movie_query_watch._closed:
            logging.debug('Movie snapshot query closed, restarting.')
            movie_query_watch = movie_query.on_snapshot(on_snapshot)

        if show_query_watch._closed:
            logging.debug('Show snapshot query closed, restarting.')
            show_watch = show_query.on_snapshot(on_snapshot)
