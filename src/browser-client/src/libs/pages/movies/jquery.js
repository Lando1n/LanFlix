const movieTableSelector = "#movies-tbl";

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
      const showExists = doesShowExist(showName);
      if (showExists) {
        return 'movie already exists on database!';
      } else {
        makeRequest(showName, 'movie');
      }
    },
  }).then((result) => {
    if (result.value) {
      Swal.fire('Requested', 'The movie has been requested!', 'success');
    } else {
      Swal.fire(
          'Failed to request',
          'The movie has not been requested!',
          'error',
      );
    }
  });
});

$(movieTableSelector).on('dblclick', 'tr', function() {
  const movieData = $(movieTableSelector)
      .DataTable()
      .row('.selected')
      .data();
  const isSubbed = movieData.subbed === 'yes';

  const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 2000,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  if (!isSubbed) {
    Toast.fire({
      icon: 'success',
      title: `Subscribed to ${movieData.type}!`
    });
    changeMovieSubOnFirebase(movieData.type, false);
    setSubbedForMovie(true);
  } else {
    Toast.fire({
      icon: 'error',
      title: `Unsubscribed from ${movieData.type}`
    });
    changeMovieSubOnFirebase(movieData.type, true);
    setSubbedForMovie(false);
  }
  
});

// Highlight row when clicked so that it's selected
$(movieTableSelector).on('click', 'tr', function() {
  $(movieTableSelector)
      .DataTable()
      .rows()
      .every(function() {
        this.nodes()
            .to$()
            .removeClass('selected');
      });
  $(this).addClass('selected');
});
