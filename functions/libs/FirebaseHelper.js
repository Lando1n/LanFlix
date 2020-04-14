const admin = require('firebase-admin');

class FirebaseHelper {
  constructor(admin) {
    console.debug('Initializing firebase connection');
    this.db = admin.firestore();
    console.debug('Connected!');
  }
  async doesShowExist(name) {
    if (!name) {
      throw new Error('Show name not defined');
    }
    console.debug(`Checking if show exists on db: ${name}`);
    let exists = false;

    const docRef = this.db.collection('shows');
    const querySnapshot = await docRef.get();
    querySnapshot.forEach((doc) => {
      if (name.toLowerCase() === doc.id.toLowerCase()) {
        exists = true;
      }
    });
    if (exists) {
      console.debug('Found show!');
    } else {
      console.debug('Could not find show');
    }
    return exists;
  }

  async getShowSubs(name) {
    console.debug(`Getting subscribers for show: ${name}`);
    let subs = [];

    const docRef = this.db.collection('shows');
    const querySnapshot = await docRef.get()
    querySnapshot.forEach((doc) => {
      if (doc.exists && name.toLowerCase() === doc.id.toLowerCase()) {
        subs = doc.data().subs;
      }
    });
    console.debug(`Found subscribers: ${subs}`);
    return subs;
  }

  async getMovieSubs(type) {
    console.debug(`Getting subscribers for movie type: ${type}`);
    let subs = [];
    const docRef = this.db.collection('movies').doc(type);
    const doc = await docRef.get()
    if (doc.exists) {
      subs = doc.data().subs;
    } else {
      throw new Error('Movie type does not exist in database.');
    }
    console.debug(`Found subscribers: ${subs}`);
    return subs;
  }

  async getAllUsers() {
    console.debug('Looking for all user ids');
    const users = [];

    const docRef = this.db.collection('users');

    const querySnapshot = await docRef.get();
    querySnapshot.forEach((doc) =>  {
      users.push(doc.id);
    });
    console.debug(`Found all user ids: ${users}`);
    return users;
  }

  async addShowToList(name) {
    console.debug(`Adding show to shows list: ${name}`);
    let added = false;

    await this.db.collection('shows').doc(name).set({ subs: [] });
    const exists = await this.doesShowExist(name);
    if (exists) {
      added = true;
    } else {
      console.error('Failed to add show to list');
    }
    return added;
  }

  removeFromRequests(name) {
    console.debug(`Deleting show from request list: ${name}`);
    this.db.collection('requests').doc(name).delete();
  }

  async getAdminEmail(type) {
    console.debug(`Getting admin email for type ${type}`);
    let subs = [];
    const docRef = this.db.collection('admin').doc(type);
    const doc = await docRef.get();
    if (doc.exists) {
      subs = doc.data().subs;
    } else {
      throw new Error(`Couldn't find admin doc for type ${type}`);
    }
    console.debug(`Found admin emails: ${subs}`);
    return subs;
  }
}

module.exports = FirebaseHelper;
