/* JQUERY */
$('#subs-tbl').on('click', 'tr', function() {
  $('#subs-tbl')
      .DataTable()
      .rows()
      .every(function() {
        this.nodes()
            .to$()
            .removeClass('selected');
      });
  $(this).addClass('selected');
});

$('#insert-button').on('click', function() {
  Swal.fire({
    title: 'Which show would you like to add?',
    width: '400px',
    input: 'text',
    showCancelButton: true,
    inputValidator: (showName) => {
      if (!showName) {
        return 'You need to write something!';
      }

      if (doesShowExist(showName)) {
        return 'Show already exists on database!';
      } else {
        insertShow(showName);
      }
    },
  }).then((result) => {
    if (result.value) {
      Swal.fire('Added', 'The show has been added!', 'success');
    } else {
      Swal.fire('Failed to add', 'The show has not been added!', 'error');
    }
  });
});

$('#subs-tbl').on('tap', 'tr', function() {
  runEditModal();
});

$('#subs-tbl').on('dblclick', 'tr', function() {
  runEditModal();
});

/* FUNCTIONS */

function runEditModal() {
  const showData = $('#subs-tbl')
      .DataTable()
      .row('.selected')
      .data();
  const showName = showData.showName;
  console.log('Editing: ' + showName);
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

function initializeSubsTable() {
  // Initaliaze the table parameters
  const tableHeader = document.getElementById('headers');
  const columnsList = [{data: 'showName', title: 'Show Name'}];

  db.collection('users')
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(user) {
        // doc.data() is never undefined for query doc snapshots
          console.log('Adding ' + user.id + ' column');

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
  console.log('Populating Table');

  db.collection('shows')
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(showDoc) {
          const showName = showDoc.id;
          console.log('Adding show to table: ' + showName);
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

function insertShow(showName) {
  console.log('Show to add: ' + showName);

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

function destroySubsTable() {
  const table = $('#subs-tbl').DataTable();
  table.clear().draw();
  table.destroy();

  $('#subs-tbl')
      .find('th:gt(0)')
      .remove();
}
