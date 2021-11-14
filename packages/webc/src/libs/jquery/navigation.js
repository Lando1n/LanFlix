const { selectPage } = require("../nav/topbar");

$("#show-select-btn").on("click", (event) => {
  selectPage(event, "shows-page");
});

$("#movie-select-btn").on("click", (event) => {
  selectPage(event, "movies-page");
});

$("#request-select-btn").on("click", (event) => {
  selectPage(event, "requests-page");
});
