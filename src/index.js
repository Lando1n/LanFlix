const db = firebase.firestore();

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    /* User is signed in.
    const displayName = user.displayName;
    const email = user.email;
    const emailVerified = user.emailVerified;
    const photoURL = user.photoURL;
    const isAnonymous = user.isAnonymous;
    const uid = user.uid;
    const providerData = user.providerData;
    */
    $('#login-modal').hide();
    $('#site').show();

    openNav();

    addUsersToEditModal();

    initializeSubsTable();
    initializeUsersTable();
    initializeMoviesTable();
  } else {
    // User is signed out.
    $('#login-modal').show();
    $('#site').hide();

    destroySubsTable();
    destroyUsersTable();
    destroyMoviesTable();
    clearEditModal();
  }
});

$(document).ready(function() {
  const user = firebase.auth().currentUser;

  if (user) {
    // User is signed in.
    $('#login-modal').hide();
    $('#site').show();

    openNav();

    addUsersToEditModal();

    initializeSubsTable();
    initializeUsersTable();
    initializeMoviesTable();
  } else {
    // User is signed out.
    $('#login-modal').show();
    $('#site').hide();

    destroySubsTable();
    destroyUsersTable();
    destroyMoviesTable();
    clearEditModal();
  }
});

/** EDIT MODAL */

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

/** Side bar navigation */

$('.sidenav label').on('click', function() {
  const mainNavButtons = document.getElementsByClassName('nav-btn');
  if (mainNavButtons) {
    for (const i in mainNavButtons) {
      const navButton = mainNavButtons[i];
      if (navButton.id) {
        if (navButton.id != this.id) {
          navButton.classList.remove('selected');
        } else {
          navButton.classList.add('selected');
        }
      }
    }
  }
});

/**
 * Authentication
 */

$('#login-btn').on('click', function() {
  $('#login-modal').modal('show');
});

$('#logout-btn').on('click', function() {
  logout();
});

$('#login-modal').on('hidden.bs.modal', function() {
  $('#login-form').trigger('reset');
});

$('#login-submit-btn').on('click', function() {
  $('#login-error').text('');
  const email = $('#username').val();
  const password = $('#password').val();
  firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(function() {
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(function() {
              console.debug('login successful');
            })
            .catch(function(error) {
              // Handle Errors here.
              const errorCode = error.code;
              const errorMessage = error.message;
              $('#login-error').text(`Error ${errorCode}, ${errorMessage}`);
            });
      });
});

/** SHOWS PAGE */

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

/** USER PAGE */
$('#add-user-button').on('click', function() {
  // TODO: Add user to collection
});
