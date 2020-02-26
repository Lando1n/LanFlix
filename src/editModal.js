$('#edit-name-btn').on('click', function() {
  const showName = $('#es-modal-title').val();
  console.debug(showName);
});

$('#confirm-btn').on('click', function() {
  const row = $('#subs-tbl')
      .DataTable()
      .row('.selected');
  const showName = row.data().showName;
  const subsList = [];
  const rowData = {showName: showName};
  // Create data to update firebase and the datatable
  $('#subs-tbl thead tr th').each(function() {
    const columnName = this.innerHTML;
    if (columnName != 'Show Name') {
      const toggle = document.getElementById(columnName + '-toggle');
      if (toggle.checked) {
        subsList.push(columnName);
        rowData[columnName] = 'yes';
      } else {
        rowData[columnName] = 'no';
      }
    }
  });
  // Update Firebase
  db.collection('shows')
      .doc(showName)
      .update({subs: subsList});
  // Update the datatable
  row.data(rowData).draw();
});

$('#delete-btn').on('click', function() {
  const row = $('#subs-tbl')
      .DataTable()
      .row('.selected');
  const showName = row.data().showName;

  Swal.fire({
    title: 'Are you sure you want to delete "' + showName + '"?',
    text: 'You will have to add the show back!',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
    if (result.value) {
      row.remove().draw();
      db.collection('shows')
          .doc(showName)
          .delete()
          .then(function() {
            console.debug('Show successfully deleted!');
          })
          .catch(function(error) {
            console.error('Error removing show: ', error);
          });

      Swal.fire(
          'Deleted!',
          showName + ' has been removed from the list of subscriptions.',
          'success',
      );
    }
  });
});

/* FUNCTIONS */

function addUsersToEditModal() {
  const modalBody = document.getElementById('es-modal-body');

  const table = document.createElement('table');
  table.align = 'center';

  // Create a toggle dialog for every user
  db.collection('users')
      .get()
      .then(function(querySnapshot) {
        let i = 0;
        let row = null;
        let switchCell;
        let nameCell;

        querySnapshot.forEach(function(user) {
          if (i % 2 == 0) {
            row = table.insertRow();
            switchCell = row.insertCell(0);
            nameCell = row.insertCell(1);
          } else {
            switchCell = row.insertCell(2);
            nameCell = row.insertCell(3);
          }

          // Create label
          const label = document.createElement('label');
          label.classList = 'switch';

          // Create Toggle
          const toggle = document.createElement('input');
          toggle.id = user.id + '-toggle';
          toggle.type = 'checkbox';

          // Create span
          const span = document.createElement('span');
          span.classList = 'slider round';

          // Create the name label
          const nameLabel = document.createElement('h5');
          nameLabel.innerHTML = user.id;
          nameLabel.classList = 'nameLabel';

          label.appendChild(toggle);
          label.appendChild(span);

          // Add elements to the table
          switchCell.appendChild(label);
          nameCell.appendChild(nameLabel);

          i++;
        });
        // Append the elements to the modal body
        modalBody.appendChild(table);
      });
}

function clearEditModal() {
  $('#es-modal-body div').empty();
}

module.exports = {
  addUsersToEditModal,
  clearEditModal,
};
