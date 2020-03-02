function runEditShowModal(showName, isSubbed) {
  console.debug("Editing: " + showName);
  const db = firebase.firestore();

  db.collection("shows")
    .doc(showName)
    .get()
    .then((doc) => {
      if (doc.exists) {
        // Set the modal header to the show name
        $('#show-subbed-toggle').prop('checked', isSubbed);
        $("#es-modal-title").text(showName);
        // Show the modal
        $("#edit-show-modal").modal("toggle");
      } else {
        console.warn("No such document on firebase: " + showName);
      }
    });
}
