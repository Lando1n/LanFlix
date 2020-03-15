import os
from .Notify import Notify


def test_get_sender_info():
    dir_path = os.path.dirname(os.path.realpath(__file__))
    config_location = os.path.join(*[dir_path, "..",
                                     "config",
                                     "test_config.ini"])
    notify = Notify(config_location, None)

    sender_info = notify.get_sender_info(config_location)
    assert sender_info['name'] == 'test_name'
    assert sender_info['email'] == 'test_email@gmail.com'
    assert sender_info['password'] == 'test_password'
