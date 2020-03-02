// eslint-disable-next-line no-unused-vars
function insertShow(showName) {
  console.debug('Show to add: ' + showName);

  db.collection('users')
      .get()
      .then(() => {
      // Add the show to firebase
        addShowToFirebase(showName);
        // Add the show to the table
        addShowToTable(showName);
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
/*
// eslint-disable-next-line no-unused-vars
function destroySubsTable() {
  const table = $(showTableSelector).DataTable();
  table.clear().draw();
  table.destroy();

  $(showTableSelector)
      .find('th:gt(0)')
      .remove();
}*/
