const { toggleSubscription } = require("../datatableFunctions");

// Highlight row when clicked so that it's selected
function selectShowRow() {
  $("#shows-tbl")
    .DataTable()
    .rows()
    .every(function () {
      this.nodes().to$().removeClass("selected");
    });
  $(this).addClass("selected");
}

$("#shows-tbl").on("dblclick", "tr", async () => {
  await toggleSubscription("#shows-tbl", "shows");
});

$("#shows-tbl").on("click", "tr", selectShowRow);
