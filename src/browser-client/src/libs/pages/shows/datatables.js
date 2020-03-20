$(showTableSelector).DataTable({
  iDisplayLength: 15,
  order: [[0, 'asc']],
  columns: [{
    data: 'name',
    title: 'Show Name',
  }, {
    data: 'subbed',
    title: 'Subbed',
  }],
  lengthChange: false,
});

// eslint-disable-next-line no-unused-vars
function populateShowsTable(user) {
  console.debug('Populating Shows into Table');
  const table = $(showTableSelector).DataTable();

  // For each show, check if the user logged in is subscribed
  getAllShowDocuments().then((shows) => {
    shows.forEach((show) => {
      const showData = show.data();
      let subbed = 'no';
      if (showData.subs && showData.subs.includes(user)) {
        subbed = 'yes';
      }
      const row = {
        name: show.id,
        subbed,
      };
      table.row.add(row);
    });
    table.draw();
  });
}

// eslint-disable-next-line no-unused-vars
function addShowToTable(showName) {
  const table = $(showTableSelector).DataTable();
  const data = {
    name: showName,
    subbed: 'yes',
  };
  table.row.add(data).draw();
}

// eslint-disable-next-line no-unused-vars
function removeShowFromTable() {
  const table = $(showTableSelector).DataTable();
  table.row('.selected').remove().draw();
}

// eslint-disable-next-line no-unused-vars
function setSubbedForShow(isSubbed) {
  const row = $(showTableSelector).DataTable().row('.selected');
  const rowData = {
    name: row.data().name,
    subbed: isSubbed ? 'yes' : 'no',
  };
  row.data(rowData).invalidate();
}
