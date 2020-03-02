const showTableSelector = '#shows-tbl';

$(showTableSelector).on('click', 'tr', function() {
    $(showTableSelector)
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

  $(showTableSelector).on('dblclick', 'tr', function() {
    runEditModal();
  });
