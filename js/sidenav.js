/* JQUERY */
$('.sidenav label').on('click', function(){
	var mainNavButtons = document.getElementsByClassName('nav-btn');
	for (i in mainNavButtons){
		var navButton = mainNavButtons[i];
		if (navButton.id){
			if (navButton.id != this.id){
				navButton.classList.remove('selected');
			} else {
				navButton.classList.add('selected');
			}
		}
	}
});

$('#login-btn').on('click', function (){
	$('#login-modal').modal('show');
});

$('#logout-btn').on('click', function(){
	logout();
});

/* FUNCTIONS */

/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
function openNav() {
	document.getElementById("sideNav").style.width = "250px";
	document.getElementById("main").style.marginLeft = "250px";
	selectPage('shows-page');
}

function selectPage(pageToSelect){
	console.log("Selecting page: " + pageToSelect)
	var pages = document.getElementsByClassName('main-page');
	for (i in pages){
		var page = pages[i];
		if (page.id){
			if (page.id == pageToSelect){
				page.style.display = 'inline';
			} else {
				page.style.display = 'none';
			}
		}
	}
}

