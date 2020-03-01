// eslint-disable-next-line no-unused-vars
function initializeMoviesTable() {
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
        title: 'Subscribers',
        default: 'none',
      },
    ],
    lengthChange: false,
  });

  db.collection('movies')
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(movieType) {
          const row = {type: movieType.id, subs: movieType.data().subs};
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
