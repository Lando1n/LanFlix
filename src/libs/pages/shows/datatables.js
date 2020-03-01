function initializeSubsTable() {
  return $("#subs-tbl").DataTable({
    iDisplayLength: 15,
    order: [[0, "asc"]],
    columns: [{ data: "showName", title: "Show Name" }],
    lengthChange: false
  });
}

function populateShowsTable(table) {
  console.debug("Populating Shows into Table");

  getAllShows().then(shows => {
    shows.forEach(show => {
      const row = { showName: show };
      table.row.add(row);
    });
    table.draw();
  });
}

function addShowToTable(showName) {

}
