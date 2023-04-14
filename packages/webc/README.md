# Web Client

## Setup
- Install the firebase CLI
  ```
  sudo npm install -g firebase-tools
  ```
- Login into firebase
  ```
  firebase login
  ```
- Initialize the firebase project

  ```
  firebase init
  ```

  - Choose Hosting
  - Choose an existing project
  - Choose public directory as `.`
  - Configure as a single page app
  - Don't overwrite the index file

- Build it
  Run this command to create a dist file of the code.
  ```
  npm run build
  ```
- Test it!  
  Run this command to host the server locally for testing purposes.
  ```
  firebase serve
  ```
- Deploy it to the interwebs!
  Running this command will host the website publicly for access all over the world.
  ```
  firebase deploy
  ```
  You can control versioning of the deployments on Google Firebase Console.
