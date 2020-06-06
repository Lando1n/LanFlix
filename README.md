# LanFlix

## Setup
### Dependencies
* Install nodejs/npm
  Note: If already installed, version must be at least node 10.x
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
  cd public
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
#### Place the Firebase Certificate
* Get a certificate from `Firebase Settings > Project Settings > Service Accounts > Firebase Admin SDK`
* Place cert in `config/lanflix-firebase-cert.json`

#### Add Email Credentials
Using the template under `config/template_sender.json`, create a file in the same directory called `sender.json` swapping the name, email and password to match your desired email account to send notifications from.

## How To Use
### Monitor Requests
To receive emails for requests from the website and emails from download notifications, you need to have the lanflix-monitor running.

#### Run a Script
Execute the npm monitor script using:
```
npm run monitor
```
When this process is closed, the monitor will no longer run. If you would prefer to have it as a background service, look at the next section.

#### Auto boot on start (systemd)
* Change the user and group from `plexserver` to the username on your machine
* Copy the files from `/services/` into /etc/systemd/system/ 
* Enable and start the services
```bash
sudo systemctl enable --now lanflix-monitor.service
```
* Check the status of the services
```bash
sudo systemctl status lanflix-monitor.service
```

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
