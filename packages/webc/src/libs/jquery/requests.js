const {
  requestMovieDialog,
  requestShowDialog,
} = require("../requests/mediaRequests");

$("#request-show-button").on("click", requestShowDialog);
$("#request-movie-button").on("click", requestMovieDialog);
