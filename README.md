# LanFlix

## Setup
### Firebase
* Create a firebase project, or use an existing one.  
  https://console.firebase.google.com/

* Configure the Firestore collection  
The database needs to be setup with the following schema:

  | Collections   |  Documents  | Fields |
  | --------------| ----------- | ------ |
  | movies        | all         | subs   |
  | shows         | <show_name> | subs   |
  | users         | <name>      | email  |


### Browser Client
* Navigate to the browser client directory
  ```
  cd src/browser-client
  ```
* Install the firebase CLI
  ```
  sudo npm install -g firebase-tools
  ```
* Login into firebase
  ```
  firebase login
  ```
* Initialize the firebase project
  ```
  firebase init
  ```
  * Choose Hosting
  * Choose an existing project
  * Choose public directory as `.`
  * Configure as a single page app
  * Don't overwrite the index file
  
* Test it!  
  Run this command to host the server locally for testing purposes.
  ```
  sudo firebase serve
  ```
* Deploy it to the interwebs!
  Running this command will host the website publicly for access all over the world.
  ```
  sudo firebase deploy
  ```
  You can control versioning of the deployments on Google Firebase Console.

### Notifier

#### Install Dependencies
* Install nodejs/npm
  ```
  sudo apt update
  sudo apt -y install curl dirmngr apt-transport-https lsb-release ca-certificates
  curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
  sudo apt -y install nodejs
  ```
* Install all of the npm packages required for the script with: 
  ```
  npm install
  ```
#### Place the Certificate
* Get a certificate from `Firebase Settings > Project Settings > Service Accounts > Firebase Admin SDK`
* Place cert in `config/lanflix-firebase-cert.json`

#### Add Email Credentials

Using the template under `config/template_sender.json`, create a in the same directory called `sender.json` swapping the name, email and password to match your desired email account to send notifications from.

## Development
### Run linting
```
npm install
npm run lint
```

### Run Unit Tests
```
npm install
npm run test
```
