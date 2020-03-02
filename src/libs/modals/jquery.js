$("#edit-name-btn").on("click", function() {
  const showName = $("#es-modal-title").val();
  console.debug(showName);
});

$("#confirm-btn").on("click", function() {
  const row = $(showTableSelector)
    .DataTable()
    .row(".selected");
  const showName = row.data().showName;
  const subsList = [];
  const rowData = { showName: showName };
  // Create data to update firebase and the datatable
  $("#subs-tbl thead tr th").each(function() {
    const columnName = this.innerHTML;
    if (columnName !== "Show Name") {
    }
  });
  // Update Firebase
  db.collection("shows")
    .doc(showName)
    .update({ subs: subsList });
  // Update the datatable
  row.data(rowData).draw();
});

$("#delete-btn").on("click", function() {
  const row = $(showTableSelector)
    .DataTable()
    .row(".selected");
  const showName = row.data().name;

  Swal.fire({
    title: `Are you sure you want to delete '${showName}'?`,
    text: "You will have to add the show back!",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then(result => {
    if (result.value) {
      removeShowFromTable();
      deleteShowFromFirebase(showName);

      Swal.fire(
        "Deleted!",
        showName + " has been removed from the list of subscriptions.",
        "success"
      );
    }
  });
});
