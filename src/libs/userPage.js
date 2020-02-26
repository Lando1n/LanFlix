// eslint-disable-next-line no-unused-vars
function initializeUsersTable() {
  // Initaliaze the table parameters
  const table = $('#users-tbl').DataTable({iDisplayLength: 15,
    order: [[0, 'asc']],
    columns: [{
      data: 'name',
      title: 'Name',
    }, {
      data: 'email',
      title: 'Email',
      default: 'none',
    }],
    lengthChange: false,
  });

  db.collection('users').get().then(function(querySnapshot) {
    querySnapshot.forEach(function(user) {
      // doc.data() is never undefined for query doc snapshots
      const row = {name: user.id, email: user.data().email};
      table.row.add(row);
    });
    table.draw();
  });
}

// eslint-disable-next-line no-unused-vars
function destroyUsersTable() {
  const table = $('#users-tbl').DataTable();
  table.clear().draw();
  table.destroy();
}
