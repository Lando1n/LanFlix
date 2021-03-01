const { I } = inject();
const { mainPage } = require("./mainPage");

class showsPage extends mainPage {
  constructor() {
    super(...arguments);
    this.table = "#shows-tbl";
  }
};

module.exports = new showsPage();