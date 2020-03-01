// eslint-disable-next-line no-unused-vars
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

// eslint-disable-next-line no-unused-vars
function clearEditModal() {
  $('#es-modal-body div').empty();
}
