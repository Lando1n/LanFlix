import os
import logging

from configparser import ConfigParser


def get_sender_info(config_location):
    # Get the Email Sender from the config file
    if not os.path.exists(config_location):
        raise EnvironmentError('Configuration File cannot be found at: {0}'
                               .format(config_location))

    logging.debug('Reading config from file: {0}'.format(config_location))
    config = ConfigParser()
    config.read(config_location)

    sender = dict()
    sender['name'] = config.get('SENDER', 'name')
    sender['email'] = config.get('SENDER', 'email')
    sender['password'] = config.get('SENDER', 'password')
    logging.debug("Sending email with: '{0}'".format(sender['email']))
    return sender
