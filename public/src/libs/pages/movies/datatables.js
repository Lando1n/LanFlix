$("#movies-tbl").DataTable({
  iDisplayLength: 15,
  order: [[0, "asc"]],
  columns: [
    {
      data: "type",
      title: "Type",
    },
    {
      data: "logo",
      title: "Subbed",
      className: "dt-right",
      searchable: false,
    },
    {
      data: "subbed",
      visible: false,
    },
  ],
  lengthChange: false,
  bFilter: false,
});

// eslint-disable-next-line no-unused-vars
function populateMoviesTable() {
  const db = firebase.firestore();
  const user = firebase.auth().currentUser.email;
  const table = $("#movies-tbl").DataTable();

  db.collection("movies")
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (movieType) {
        const subbed = movieType.data().subs.includes(user);
        const row = {
          type: movieType.id,
          logo: subbed ? subbedLogo : unsubbedLogo,
          subbed: subbed ? "yes" : "no",
        };
        table.row.add(row);
      });
      table.draw();
    });
}

// eslint-disable-next-line no-unused-vars
function destroyMoviesTable() {
  const table = $("#movies-tbl").DataTable();
  table.clear().draw();
}

// eslint-disable-next-line no-unused-vars
function setSubbedForMovie(isSubbed) {
  const row = $(movieTableSelector).DataTable().row(".selected");
  const rowData = {
    type: row.data().type,
    logo: isSubbed ? subbedLogo : unsubbedLogo,
    subbed: isSubbed ? "yes" : "no",
  };
  row.data(rowData).invalidate();
}
