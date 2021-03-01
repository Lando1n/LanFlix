const { I } = inject();
const { mainPage } = require("./mainPage");

class moviesPage extends mainPage {
  constructor() {
    super(...arguments);
    this.table = "#movies-tbl";
  }
}

module.exports = new moviesPage();
