// eslint-disable-next-line no-unused-vars
function insertShow(showName) {
  console.debug('Show to add: ' + showName);

  const table = $(showTableSelector).DataTable();
  const data = {};

  db.collection('users')
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(user) {
          data[user.id.toLowerCase()] = 'no';
        });

        // Add the show to firebase
        db.collection('shows')
            .doc(showName)
            .set({subs: []});
        // Add the show to the table
        data['showName'] = showName;
        table.row.add(data).draw();
      });
}

// eslint-disable-next-line no-unused-vars
function doesShowExist(showName) {
  let showExists = false;
  const rowData = $(showTableSelector)
      .DataTable()
      .rows()
      .data();

  for (i in rowData) {
    const row = rowData[i];
    if (row.showName == showName) {
      showExists = true;
    }
  }
  return showExists;
}

// eslint-disable-next-line no-unused-vars
function destroySubsTable() {
  const table = $(showTableSelector).DataTable();
  table.clear().draw();
  table.destroy();

  $(showTableSelector)
      .find('th:gt(0)')
      .remove();
}
