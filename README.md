# LanFlix
## Description
LanFlix is a notification provider that sends users an email whenever a show or movie is downloaded which you have selected to be notified for. Using the LanFlix website, multiple users can register then specify which shows they are interested in and what genre of movies. LanFlix is powered by Firebase, so a Google account is required.

Best used in tandem with Sonarr, Radarr, and Plex/Emby.

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

### Turn on Email Notifications
To receive emails for requests from the website and emails from download notifications, you need to have the lanflix-monitor running.

#### Option A: Run a script in a terminal
Execute the npm monitor script using:
```
npm run monitor
```
When this process is closed, the monitor will no longer run. If you would prefer to have it as a background service, look at the next section.

#### Option B: Auto boot on start with systemd
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
Note: You may need to adjust the path to node if it is installed in a different location. Find this using:
```bash
which node
```

### Client Scripts
In order to be notified that content has been added, the client that grabs the content needs to talk to LanFlix. `scripts/client_scripts` helps with that, but each client needs to be setup individually. Many more clients can be used, the scripts just need to be written.

### Transmission
WIP
### Deluge
WIP
### Sonarr
WIP
### Radarr
WIP

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
