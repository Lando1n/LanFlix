// eslint-disable-next-line no-unused-vars
async function getAllUsers() {
  const users = [];
  const db = firebase.firestore();
  await db.collection('users')
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach((user) => {
          users.push(user.id);
        });
      });
  return users;
}
