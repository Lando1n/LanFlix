function runEditModal() {
    const showData = $(showTableSelector)
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
