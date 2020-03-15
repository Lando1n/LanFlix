import firebase_admin
import logging

from firebase_admin import credentials, firestore


class FirestoreHelper:
    def __init__(self, certLocation):
        try:
            cred = credentials.Certificate(certLocation)
            firebase_admin.initialize_app(cred)
        except Exception as e:
            raise Exception("Failed to initialize firestore app: " + e)

        self.db = firestore.client()
        logging.debug('Firestore is initiliazed')

    def get_show_subs(self, show_name):
        subs = []
        docs = self.db.collection(u'shows').stream()

        for doc in docs:
            if doc.id.lower() == show_name.lower():
                logging.debug('Found show document')
                doc_dict = doc.to_dict()
                break
        if doc_dict is None:
            logging.debug('No subs found for {0}'.format(show_name))
        try:
            subs = doc_dict['subs']
        except Exception as e:
            logging.warn(e)

        logging.debug('Found show subscribers: {0}'.format(subs))
        return subs

    def get_admin_sub(self, admin_type):
        doc_ref = self.db.collection('admin').document(admin_type)
        try:
            doc = doc_ref.get()
            subs = doc.to_dict()['subs']
        except Exception as e:
            logging.info(e)
        logging.debug('Found admin users: {0}'.format(subs))
        return subs

    def get_movie_subs(self, movie_type='all'):
        docs = self.db.collection(u'movies').stream()

        for doc in docs:
            if doc.id.lower() == movie_type.lower():
                logging.debug('Found movie document')
                doc_dict = doc.to_dict()
                break
        try:
            subs = doc_dict['subs']
        except Exception as e:
            logging.info(e)
        logging.debug('Found movie subscribers: {0}'.format(subs))
        return subs

    def get_user_email(self, username):
        user_email = None

        docs = self.db.collection(u'users').stream()

        for doc in docs:
            if doc.id.lower() == username.lower():
                logging.debug('Found user document')
                doc_dict = doc.to_dict()
                break

        try:
            user_email = doc_dict['email']
        except Exception as e:
            logging.info("No email found for user " + username)
            logging.error(e)
        logging.debug('Resolved Email: {0} => {1}'.format(
            username, user_email))
        return user_email

    def get_admin_email(self, admin_type):
        emails_to_send = []
        doc_ref = self.db.collection(u'admin').document(admin_type)
        try:
            subbed_users = doc_ref.get().to_dict()['subs']
        except Exception as e:
            logging.info(e)

        # Find the email of each user
        for user in subbed_users:
            emails_to_send.append(self.get_user_email(user))

        return emails_to_send

    def get_request_email(self, media_type):
        if media_type not in ['shows', 'movies']:
            raise Exception(
                'Requests email can only be of type shows or movies')
        emails_to_send = []
        doc_ref = self.db.collection(u'admin').document('Requests')
        try:
            subbed_users = doc_ref.get().to_dict()[media_type]
        except Exception as e:
            logging.info(e)

        # Find the email of each user
        for user in subbed_users:
            emails_to_send.append(self.get_user_email(user))

        return emails_to_send
