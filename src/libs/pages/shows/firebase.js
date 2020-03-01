async function getAllShows() {
    const shows = [];
    const db = firebase.firestore();
    await db.collection('shows')
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach((show) => {
                shows.push(show.id);
            })
        });
    return shows;
}