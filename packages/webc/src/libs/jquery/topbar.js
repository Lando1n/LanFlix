const { selectPage } = require("../nav/topbar");
const { requestDialog } = require("../requests/mediaRequests");

$("#show-select-btn").on("click", (event) => {
  selectPage(event, "shows-page");
});

$("#movie-select-btn").on("click", (event) => {
  selectPage(event, "movies-page");
});

$("#request-select-btn").on("click", (event) => {
  selectPage(event, "requests-page");
});

$("#request-something-btn").on("click", requestDialog);
