const subbedLogo =
  '<i class="fas fa-check-circle fa-lg" style="color:#32CD32"></i>';
const unsubbedLogo =
  '<i class="fas fa-times-circle fa-lg" style="color:red"></i>';

function populateSubTable(tableSelector, collection) {
  const db = firebase.firestore();
  const user = firebase.auth().currentUser.email;
  const table = $(tableSelector).DataTable();

  db.collection(collection)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (entry) {
        const subbed = entry.data().subs.includes(user);
        const row = {
          name: entry.id,
          subscribers: entry.data().subs.length,
          logo: subbed ? subbedLogo : unsubbedLogo,
          subbed: subbed ? "yes" : "no",
        };
        table.row.add(row);
      });
      table.draw();
    });
}

function destroyTable(tableSelector) {
  $(tableSelector).DataTable().clear().draw();
}

function setSubbed(isSubbed, tableSelector) {
  const row = $(tableSelector).DataTable().row(".selected");
  const currentSubscribers = row.data().subscribers;
  const rowData = {
    name: row.data().name,
    subscribers: isSubbed ? currentSubscribers + 1 : currentSubscribers - 1,
    logo: isSubbed ? subbedLogo : unsubbedLogo,
    subbed: isSubbed ? "yes" : "no",
  };
  row.data(rowData).invalidate();
}

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

  if (!isSubbed) {
    Toast.fire({
      icon: "success",
      title: `Subscribed to ${data.name}!`,
    });
    changeSubOnFirebase(data.name, false, collection);
    setSubbed(true, tableSelector);
  } else {
    Toast.fire({
      icon: "error",
      title: `Unsubscribed from ${data.name}`,
    });
    changeSubOnFirebase(data.name, true, collection);
    setSubbed(false, tableSelector);
  }
}
