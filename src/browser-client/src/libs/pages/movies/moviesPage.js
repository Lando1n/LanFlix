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
      }, {
        data: 'logo',
        title: 'Subbed',
        className: "dt-right",
        searchable: false,
      }, {
        data: 'subbed',
        title: 'Subbed',
        visible: false,
    }],
    lengthChange: false,
    bFilter: false,
  });

  const user = firebase.auth().currentUser.email;

  db.collection('movies')
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(movieType) {
          const subbed = movieType.data().subs.includes(user);
          const row = {
            type: movieType.id,
            logo: subbed ? subbedLogo : unsubbedLogo,
            subbed: subbed ? 'yes' : 'no',
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
