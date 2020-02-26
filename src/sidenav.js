/**
 * Set the width of the side navigation to 250px and
   the left margin of the page content to 250px.
*/
function openNav() {
  document.getElementById('sideNav').style.width = '250px';
  document.getElementById('main').style.marginLeft = '250px';
  selectPage('shows-page');
}

function selectPage(pageToSelect) {
  console.debug('Selecting page: ' + pageToSelect);
  const pages = document.getElementsByClassName('main-page');
  for (i in pages) {
    const page = pages[i];
    if (page.id) {
      if (page.id == pageToSelect) {
        page.style.display = 'inline';
      } else {
        page.style.display = 'none';
      }
    }
  }
}

module.exports = {
  openNav,
  selectPage,
};
