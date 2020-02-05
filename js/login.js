$('#login-modal').on('hidden.bs.modal', function(){
    $('#login-form').trigger('reset');
});

$('#login-submit-btn').on('click', function (){
    $('#login-error').text("");
    var email = $('#username').val();
    var password = $('#password').val();
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(function(){
        firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
            console.log("login successful");
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            $('#login-error').text("Error " + errorCode + ", " + errorMessage);
        });
    }); 
});

function logout(){
    firebase.auth().signOut().then(function(){
        console.log("Sign out successful");
    }).catch(function(error){
        console.error("Failed to sign out: " + error);
    });
}