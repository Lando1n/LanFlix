// eslint-disable-next-line no-unused-vars
function initializeUsersTable() {
  const db = firebase.firestore();
  // Initaliaze the table parameters
  const table = $('#users-tbl').DataTable({iDisplayLength: 15,
    order: [[0, 'asc']],
    columns: [{
      data: 'name',
    }, {
      data: 'value',
    }],
    lengthChange: false,
  });

  const user = firebase.auth().currentUser.email;

  db.collection('users')
    .doc(user)
    .get()
    .then((info) => {
      const data = info.data();
      Object.keys(data).forEach((key) => {
        // doc.data() is never undefined for query doc snapshots
        const row = {
          name: key,
          value: data[key],
        };
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
