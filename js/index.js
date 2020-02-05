var db = firebase.firestore();

firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		// User is signed in.
		var displayName = user.displayName;
		var email = user.email;
		var emailVerified = user.emailVerified;
		var photoURL = user.photoURL;
		var isAnonymous = user.isAnonymous;
		var uid = user.uid;
		var providerData = user.providerData;

		$('#login-modal').hide();
		$('#site').show();

		openNav();

		addUsersToEditModal()

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

$(document).ready( function () {

	var user = firebase.auth().currentUser;

	if (user){
		//User is signed in.
		$('#login-modal').hide();
		$('#site').show();

		openNav();

		addUsersToEditModal()

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

