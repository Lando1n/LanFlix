// eslint-disable-next-line no-unused-vars
function initializeMoviesTable() {
  const db = firebase.firestore();
  const table = $('#movies-tbl').DataTable({
    iDisplayLength: 15,
    order: [[0, 'asc']],
    columns: [
      {
        data: 'type',
        title: 'Type',
      },
      {
        data: 'subs',
        title: 'Subbed',
        default: 'none',
      },
    ],
    lengthChange: false,
    bFilter: false,
  });

  const user = firebase.auth().currentUser.email;

  db.collection('movies')
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(movieType) {
          const row = {
            type: movieType.id,
            subs: movieType.data().subs.includes(user) ? 'yes' : 'no',
          };
          table.row.add(row);
        });
        table.draw();
      });
}

// eslint-disable-next-line no-unused-vars
function destroyMoviesTable() {
  const table = $('#movies-tbl').DataTable();
  table.clear().draw();
  table.destroy();
}
