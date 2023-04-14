# LanFlix

## Description

LanFlix is a notification provider that sends users an email whenever a show or movie is downloaded which you have selected to be notified for. Using the LanFlix website, multiple users can register then specify which shows they are interested in and what genre of movies. LanFlix is powered by Firebase, so a Google account is required.

Best used in tandem with Sonarr, Radarr, and Plex/Emby.

## Setup

### Dependencies

- Install nodejs/npm
  Note: If already installed, version must be at least node 16.x
  ```
  sudo apt update
  sudo apt -y install curl dirmngr apt-transport-https lsb-release ca-certificates
  curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
  sudo apt -y install nodejs
  ```
- Install all of the npm packages required for the script with:
  ```
  npm install
  ```

### Firebase

- Create a firebase project, or use an existing one.  
  https://console.firebase.google.com/

- Configure the Firestore collection  
  The database needs to be setup with the following schema:

  | Collections | Documents   | Fields |
  | ----------- | ----------- | ------ |
  | movies      | all         | subs   |
  | shows       | <show_name> | subs   |
  | users       | <name>      | email  |

## Packages
### Notifier
See README at `./packages/notifier/README.md`

### Web Client
See README at `./packages/webc/README.md`

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

### Watch and build with webpack
When developing, you don't want to have to build the changes after every save. Running the following will watch your code and build whenever there are changes.
```
npm run watch
```
