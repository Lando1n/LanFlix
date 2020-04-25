// eslint-disable-next-line no-unused-vars
function insertShow(showName) {
  console.debug("Show to add: " + showName);
  const db = firebase.firestore();

  db.collection("users")
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
  console.log("Looking for show: ", showName);
  let showExists = false;
  $(showTableSelector)
    .DataTable()
    .rows()
    .every(function () {
      try {
        const show = this.data();
        if (show.name.toLowerCase() === showName.toLowerCase()) {
          showExists = true;
        }
      } catch (e) {
        console.error(`Failed to get row name:\n${e}`);
      }
    });
  return showExists;
}

// eslint-disable-next-line no-unused-vars
function destroySubsTable() {
  const table = $(showTableSelector).DataTable();
  table.clear().draw();
}
