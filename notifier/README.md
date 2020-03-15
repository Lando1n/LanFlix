# LanFlix Notifier

## Description
A script that emails users based on a subscription database for certain shows and movies.

The project currently uses Firestore for it's database, for more details on how it's used:  
https://firebase.google.com/docs/firestore/quickstart

## Dependencies
### Run Setup
Execute the setup script:  
```
cd setup
./setup.sh
```

## Installation instructions

Note: To be used in tandem with the browser-client

### Configure the Firebase project
* Setup a new Firebase project  
  https://console.firebase.google.com/
* Initialize Firebase storage
  The database needs to be setup with the following schema:

        | Collections   |  Documents  | Fields |
        | --------------| ----------- | ------ |
        | movies        | all         | subs   |
        | shows         | <show_name> | subs   |
        | users         | <name>      | email  |


* Get a certificate from Firebase `Settings > Project Settings > Service Accounts > Firebase Admin SDK`
* Place cert in /config/lanflix-firebase-cert.json

## Add Email Credentials
Using the following format, store your sender email credentials under /config/config.ini

    [SENDER]
    name = Plex Server  
    email = email@gmail.com  
    password = password
