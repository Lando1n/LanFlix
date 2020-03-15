// Launch request show dialog
$('#request-movie-button').on('click', function() {
    Swal.fire({
      title: 'Which movie would you like to request?',
      width: '400px',
      input: 'text',
      showCancelButton: true,
      inputValidator: (showName) => {
        if (!showName) {
          return 'You need to write something!';
        }
  
        if (doesShowExist(showName)) {
          return 'movie already exists on database!';
        } else {
          makeRequest(showName, 'movie');
        }
      },
    }).then((result) => {
      if (result.value) {
        Swal.fire('Requested', 'The movie has been requested!', 'success');
      } else {
        Swal.fire('Failed to request', 'The movie has not been requested!', 'error');
      }
    });
  });
