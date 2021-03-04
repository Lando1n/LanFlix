const showRequestModal = require("./requests/showRequestModal");
const movieRequestModal = require("./requests/movieRequestModal");

this.requestMovieButton = "#request-movie-button";
this.logoutButton = "#logout-btn";

module.exports = {
  banner: "#banner",
  toolbar: {
    shows: "#show-select-btn",
    movies: "#movie-select-btn",
    requestMovie: "#request-movie-button",
    requestShow: "#request-show-button",
    logout: "#logout-btn",
  },
  shows: {
    table: "#shows-tbl",
  },
  movies: {
    table: "#movies-tbl",
  },
  modals: {
    requestMovie: movieRequestModal,
    requestShow: showRequestModal,
  },
};
