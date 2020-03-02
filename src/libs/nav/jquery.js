$('.sidenav label').on('click', function() {
  const mainNavButtons = document.getElementsByClassName('nav-btn');
  if (mainNavButtons) {
    for (const i in mainNavButtons) {
      const navButton = mainNavButtons[i];
      if (navButton.id) {
        if (navButton.id != this.id) {
          navButton.classList.remove('selected');
        } else {
          navButton.classList.add('selected');
        }
      }
    }
  }
});
