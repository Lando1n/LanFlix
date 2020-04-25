const showTableSelector = "#shows-tbl";

function toggleShowSubscription() {
  const showData = $(showTableSelector).DataTable().row(".selected").data();
  const isSubbed = showData.subbed === "yes";

  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 2000,
    onOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  if (!isSubbed) {
    Toast.fire({
      icon: "success",
      title: `Subscribed to ${showData.name}!`,
    });
    changeSubOnFirebase(showData.name, false);
    setSubbedForShow(true);
  } else {
    Toast.fire({
      icon: "error",
      title: `Unsubscribed from ${showData.name}`,
    });
    changeSubOnFirebase(showData.name, true);
    setSubbedForShow(false);
  }
}

// Highlight row when clicked so that it's selected
function selectShowRow() {
  $(showTableSelector)
    .DataTable()
    .rows()
    .every(function () {
      this.nodes().to$().removeClass("selected");
    });
  $(this).addClass("selected");
}

$(showTableSelector).on("dblclick", "tr", toggleShowSubscription);
$(showTableSelector).on("click", "tr", selectShowRow);

// Launch request show dialog
$("#request-show-button").on("click", requestShowDialog);

// Launch add show dialog when Add Show button is clicked
$("#add-show-button").on("click", function () {
  Swal.fire({
    title: "Which show would you like to add?",
    width: "400px",
    input: "text",
    showCancelButton: true,
    inputValidator: (showName) => {
      if (!showName) {
        return "You need to write something!";
      }

      if (doesShowExist(showName)) {
        return "Show already exists on database!";
      } else {
        insertShow(showName);
      }
    },
  }).then((result) => {
    if (result.value) {
      Swal.fire("Added", "The show has been added!", "success");
    } else {
      Swal.fire("Failed to add", "The show has not been added!", "error");
    }
  });
});

$("#confirm-btn").on("click", function () {
  const row = $(showTableSelector).DataTable().row(".selected");
  const isSubbed = $("#show-subbed-toggle").prop("checked");
  const showName = row.data().name;
  // Update Firebase
  changeSubOnFirebase(showName, isSubbed);
  // Update the datatable
  setSubbedForShow(isSubbed);
});

$("#delete-btn").on("click", function () {
  const row = $(showTableSelector).DataTable().row(".selected");
  const showName = row.data().name;

  Swal.fire({
    // eslint-disable-next-line max-len
    title: `Are you sure you want to delete '${showName}'? This will affect all users on the server.`,
    text: "You will have to add the show back!",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.value) {
      removeShowFromTable();
      deleteShowFromFirebase(showName);

      Swal.fire(
        "Deleted!",
        `${showName} has been removed from the list of subscriptions.`,
        "success"
      );
    }
  });
});
