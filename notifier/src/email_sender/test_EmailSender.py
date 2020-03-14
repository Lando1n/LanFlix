from .EmailSender import EmailSender


def test_sender_info_set():
    sender_info = dict()
    sender_info['email'] = 'email@gmail.com'
    sender_info['password'] = 'password'
    sender_info['name'] = 'test_name'
    sender = EmailSender(sender_info, [])
    assert sender._sender_name == sender_info['name']
    assert sender._sender_email == sender_info['email']
    assert sender._sender_password == sender_info['password']
