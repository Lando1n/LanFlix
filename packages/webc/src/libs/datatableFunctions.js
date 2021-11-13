const subbedLogo =
  '<i class="fas fa-check-circle fa-lg" style="color:#32CD32"></i>';
const unsubbedLogo =
  '<i class="fas fa-times-circle fa-lg" style="color:red"></i>';

/**
 * Populate a DataTable from a given firebase collection.
 *
 * @param {String} tableSelector - Selector Value of the DataTable
 * @param {String} collection - Firebase collection name to grab data from
 */
function populateSubTable(tableSelector, collection) {
  const db = firebase.firestore();
  const user = firebase.auth().currentUser.email;
  const table = $(tableSelector).DataTable();

  db.collection(collection)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (entry) {
        if (!entry.data().disabled) {
          const subbed = entry.data().subs.includes(user);
          const row = {
            name: entry.id,
            subscribers: entry.data().subs.length,
            logo: subbed ? subbedLogo : unsubbedLogo,
            subbed: subbed ? "yes" : "no",
          };
          table.row.add(row);
        }
      });
      table.draw();
    });
}

/**
 * Populates the requests DataTable with requests only from this user
 */
function populateRequestsTable() {
  const db = firebase.firestore();
  const user = firebase.auth().currentUser.email;
  destroyTable("#requests-tbl");
  const table = $("#requests-tbl").DataTable();

  db.collection("requests")
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (entry) {
        const data = entry.data();
        if (user === data.user) {
          const row = {
            name: data.name,
            type: data.mediaType,
            timestamp: data.timestamp,
            status: data.status,
          };
          table.row.add(row);
        }
      });
      table.draw();
    });
}

/**
 * Remove all data from a DataTable.
 *
 * @param {String} tableSelector - Selector Value of the DataTable
 */
function destroyTable(tableSelector) {
  $(tableSelector).DataTable().clear().draw();
}

/**
 * @param {boolean} subscribe
 * @param {String} tableSelector
 */
function setSubbed(subscribe, tableSelector) {
  const row = $(tableSelector).DataTable().row(".selected");
  const currentSubscribers = row.data().subscribers;
  const rowData = {
    name: row.data().name,
    subscribers: subscribe ? currentSubscribers + 1 : currentSubscribers - 1,
    logo: subscribe ? subbedLogo : unsubbedLogo,
    subbed: subscribe ? "yes" : "no",
  };
  row.data(rowData).invalidate();
}

/**
 * Toggle the icon of the selected row of the specified DataTable and
 * add/or remove the user from the subs list on firebase.
 *
 * @param {String} tableSelector - Selector Value of the DataTable
 * @param {String} collection - Firebase collection name to modify
 */
function toggleSubscription(tableSelector, collection) {
  const data = $(tableSelector).DataTable().row(".selected").data();
  const isSubbed = data.subbed === "yes";

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

  if (isSubbed) {
    Toast.fire({
      icon: "error",
      title: `Unsubscribed from ${data.name}`,
    });
    changeSubOnFirebase(false, data.name, collection);
    setSubbed(false, tableSelector);
  } else {
    Toast.fire({
      icon: "success",
      title: `Subscribed to ${data.name}!`,
    });
    changeSubOnFirebase(true, data.name, collection);
    setSubbed(true, tableSelector);
  }
}

/**
 * Check if the show exists in the table already.
 * @param {String} showName
 */
function doesShowExist(showName) {
  console.log("Looking for show: ", showName);
  let showExists = false;
  $("#shows-tbl")
    .DataTable()
    .rows()
    .every(function () {
      try {
        const show = this.data();
        if (show.name.toLowerCase() === showName.toLowerCase()) {
          showExists = true;
        }
      } catch (e) {
        console.error(`Failed to get row name:\n${e}`);
      }
    });
  return showExists;
}
