class mainPage {
  constructor() {
    this.banner = "#banner";
      this.showsButton = "#show-select-btn";
      this.moviesButton = "#movie-select-btn";
      this.requestShowButton = "#request-show-button";
      this.requestMovieButton = "#request-movie-button";
      this.logoutButton = "#logout-btn";
  }
};

module.exports = new mainPage();
module.exports.mainPage = mainPage;
