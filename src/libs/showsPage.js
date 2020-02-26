// eslint-disable-next-line no-unused-vars
function runEditModal() {
  const showData = $('#subs-tbl')
      .DataTable()
      .row('.selected')
      .data();
  const showName = showData.showName;
  console.debug('Editing: ' + showName);
  db.collection('shows')
      .doc(showName)
      .get()
      .then(function(doc) {
        if (doc.exists) {
          const subs = doc.data().subs;

          // Set the modal header to the show name
          $('#es-modal-title').text(showName);

          // Create a select dialog for every user
          $('#subs-tbl thead tr th').each(function() {
            const columnName = this.innerHTML;
            const index = subs.indexOf(columnName);
            if (columnName != 'Show Name') {
              const toggle = document.getElementById(columnName + '-toggle');
              // Choose the value that is selected
              if (index != -1) {
                toggle.checked = true;
              } else {
                toggle.checked = false;
              }
            }
          });
          // Show the modal
          $('#edit-show-modal').modal('toggle');
        } else {
          console.warn('No such document: ' + showName);
        }
      });
}

// eslint-disable-next-line no-unused-vars
function initializeSubsTable() {
  // Initaliaze the table parameters
  const tableHeader = document.getElementById('headers');
  const columnsList = [{data: 'showName', title: 'Show Name'}];

  db.collection('users')
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(user) {
        // doc.data() is never undefined for query doc snapshots
          console.debug(`Adding ${user.id} column`);

          // Add the DOM element column for the user
          column = document.createElement('th');
          tableHeader.appendChild(column);
          // Add this users column on the datatable
          columnsList.push({
            data: user.id,
            title: user.id,
            defaultContent: 'no',
            class: 'center',
          });
        });
        const table = $('#subs-tbl').DataTable({
          iDisplayLength: 15,
          order: [[0, 'asc']],
          columns: columnsList,
          lengthChange: false,
        });
        populateSubsTable(table);
      })
      .catch(function(error) {
        $('#subs-tbl').DataTable({
          iDisplayLength: 15,
          order: [[0, 'asc']],
          columns: columnsList,
          lengthChange: false,
        });
      });
}

function populateSubsTable(table) {
  console.debug('Populating Table');

  db.collection('shows')
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(showDoc) {
          const showName = showDoc.id;
          console.debug('Adding show to table: ' + showName);
          const show = showDoc.data();
          const row = {showName: showDoc.id};

          for (i in show.subs) {
            const subName = show.subs[i];
            row[subName] = 'yes';
          }
          table.row.add(row);
        });
        table.draw();
      });
}

// eslint-disable-next-line no-unused-vars
function insertShow(showName) {
  console.debug('Show to add: ' + showName);

  const table = $('#subs-tbl').DataTable();
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
  const rowData = $('#subs-tbl')
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
  const table = $('#subs-tbl').DataTable();
  table.clear().draw();
  table.destroy();

  $('#subs-tbl')
      .find('th:gt(0)')
      .remove();
}
