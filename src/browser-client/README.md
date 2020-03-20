# LanFlix Browser Client

Note: To be used in tandem with the notifier

## Setup 
* Create a firebase project, or use an existing one.  
  https://console.firebase.google.com/
* Add a member to the project so you can login
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
  ```
  firebase serve
  ```
* Deploy!
  ```
  firebase deploy
  ```
