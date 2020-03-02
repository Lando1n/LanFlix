function runEditModal() {
  const showData = $(showTableSelector)
    .DataTable()
    .row(".selected")
    .data();
  const showName = showData.name;
  
  console.debug("Editing: " + showName);
  db.collection("shows")
    .doc(showName)
    .get()
    .then(function(doc) {
      if (doc.exists) {
        // Set the modal header to the show name
        $("#es-modal-title").text(showName);
        // Show the modal
        $("#edit-show-modal").modal("toggle");
      } else {
        console.warn("No such document: " + showName);
      }
    });
}
