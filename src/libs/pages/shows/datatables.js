$(showTableSelector).DataTable({
  iDisplayLength: 15,
  order: [[0, "asc"]],
  columns: [{ 
    data: "name",
    title: 'Show Name'
  }, {
    data: 'subbed',
    title: 'Subbed'
  }],
  lengthChange: false
});

function populateShowsTable(user) {
  console.debug("Populating Shows into Table");
  const table = $(showTableSelector).DataTable();

  getAllShowDocuments().then(shows => {
    shows.forEach(show => {
      const showData = show.data();
      let subbed = 'no';
      if (showData.subs && showData.subs.includes(user)) {
        subbed = 'yes';
      }
      const row = {
        name: show.id,
        subbed
      };
      table.row.add(row);
    });
    table.draw();
  });
}

function addShowToTable(showName) {
  const table = $(showTableSelector).DataTable();
  const data = {
    name: showName,
    subbed: 'no'
  };
  table.row.add(data).draw();
}

function removeShowFromTable() {
  const table = $(showTableSelector).DataTable();
  table.row('.selected').remove().draw();
}

function setSubbedForShow(show, isSubbed) {
  const table = $(showTableSelector).DataTable();
  
}
