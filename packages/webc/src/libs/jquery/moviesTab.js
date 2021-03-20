$("#movies-tbl").on("dblclick", "tr", () => {
  toggleSubscription("#movies-tbl", "movies");
});

// Highlight row when clicked so that it's selected
$("#movies-tbl").on("click", "tr", function () {
  $("#movies-tbl")
    .DataTable()
    .rows()
    .every(function () {
      this.nodes().to$().removeClass("selected");
    });
  $(this).addClass("selected");
});
