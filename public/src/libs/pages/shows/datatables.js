const subbedLogo =
  '<i class="fas fa-check-circle fa-lg" style="color:#32CD32"></i>';
const unsubbedLogo =
  '<i class="fas fa-times-circle fa-lg" style="color:red"></i>';

$(showTableSelector).DataTable({
  iDisplayLength: 15,
  order: [[0, "asc"]],
  columns: [
    {
      data: "name",
      title: "Show Name",
    },
    {
      data: "subscribers",
      title: "Total Subscribers",
      searchable: false,
    },
    {
      data: "logo",
      title: "Subbed",
      className: "dt-right",
      searchable: false,
    },
    {
      data: "subbed",
      title: "Subbed",
      visible: false,
    },
  ],
  lengthChange: false,
});

// eslint-disable-next-line no-unused-vars
function populateShowsTable(user) {
  console.debug("Populating Shows into Table");
  const table = $(showTableSelector).DataTable();

  // For each show, check if the user logged in is subscribed
  getAllShowDocuments().then((shows) => {
    shows.forEach((show) => {
      const showData = show.data();
      let subbed = "no";
      if (showData.subs && showData.subs.includes(user)) {
        subbed = "yes";
      }

      const row = {
        name: show.id,
        subscribers: showData.subs.length,
        logo: subbed === "yes" ? subbedLogo : unsubbedLogo,
        subbed,
      };
      table.row.add(row);
    });
    table.draw();
  });
}

// eslint-disable-next-line no-unused-vars
function removeShowFromTable() {
  const table = $(showTableSelector).DataTable();
  table.row(".selected").remove().draw();
}

// eslint-disable-next-line no-unused-vars
function setSubbedForShow(isSubbed) {
  const row = $(showTableSelector).DataTable().row(".selected");
  const currentSubscribers = row.data().subscribers;
  const rowData = {
    name: row.data().name,
    subscribers: isSubbed ? currentSubscribers + 1 : currentSubscribers - 1,
    logo: isSubbed ? subbedLogo : unsubbedLogo,
    subbed: isSubbed ? "yes" : "no",
  };
  row.data(rowData).invalidate();
}

// eslint-disable-next-line no-unused-vars
function destroySubsTable() {
  const table = $(showTableSelector).DataTable();
  table.clear().draw();
}
