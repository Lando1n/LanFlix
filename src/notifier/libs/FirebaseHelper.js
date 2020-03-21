const admin = require("firebase-admin");


class FirebaseHelper {
  constructor(cert) {
    console.debug('Initializing firebase connection');
    admin.initializeApp({
      credential: admin.credential.cert(cert),
      databaseURL: "https://lanflix.firebaseio.com"
    });
    this.db = admin.firestore();
    console.debug('Connected!');
  }

  async doesShowExist(name) {
    if (!name) {
      throw new Error('Show name not defined')
    }
    console.debug(`Checking if show exists on db: ${name}`);
    let exists = false;

    const docRef = this.db.collection('shows');

    await docRef.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        if (name.toLowerCase() === doc.id.toLowerCase()) {
          exists = true;
        }
      });
    });
    if (exists) {
      console.debug('Found show!');
    } else {
      console.debug('Could not find show');
    }
    return exists;
  }

  async getShowSubs(name) {
    console.debug(`Getting subscribers for show: ${name}`)
    let subs = [];

    const docRef = this.db.collection("shows");

    await docRef.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        if (doc.exists && name.toLowerCase() === doc.id.toLowerCase()) {
          subs = doc.data().subs;
        }
      });
    });
    console.debug(`Found subscribers: ${subs}`);
    return subs;
  }

  async getMovieSubs(type) {
    console.debug(`Getting subscribers for movie type: ${type}`);
    let subs = [];
    const docRef = this.db.collection("movies").doc(type);

    await docRef.get().then(function(doc) {
      if (doc.exists) {
        subs = doc.data().subs;
      } else {
        throw new Error('Movie type does not exist in database.')
      }
    });
    console.debug(`Found subscribers: ${subs}`);
    return subs;
  }

  async getAllUsers() {
    console.debug('Looking for all user ids');
    const users = [];

    const docRef = this.db.collection('users');

    await docRef.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        users.push(doc.id);
      });
    });
    console.debug(`Found all user ids: ${users}`);
    return users;
  }


  async addShowToList(name) {
    console.debug(`Adding show to shows list: ${name}`);
    let added = false;

    await this.db.collection('shows').doc(name).set({subs: []});
    const exists = await this.doesShowExist(name);
    if (exists){
      added = true;
    } else {
      console.error('Failed to add show to list');
    }
    return added;
  }
  /*
  requestShow(name) {
    console.debug(`Requesting show: ${name}`);
    let requested = false;
    return requested;
  }

  requestMovie(name) {
    console.debug(`Requesting movie: ${name}`);
    let requested = false;
    return requested;
  }
  */
}

module.exports = FirebaseHelper;
