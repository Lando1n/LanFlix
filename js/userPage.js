/* JQUERY */
$('#add-user-button').on('click', function () {
	//TODO: Add user to collection
});

function initializeUsersTable(){
	// Initaliaze the table parameters
	var table = $('#users-tbl').DataTable({	iDisplayLength: 15,
		order: [[0, "asc"]],
		columns: [{
			data:'name',
			title:'Name'
		},{
			data:'email',
			title:'Email',
			default: 'none'
		}],
		lengthChange: false
	});

	db.collection("users").get().then(function(querySnapshot) {
		querySnapshot.forEach(function(user) {
			// doc.data() is never undefined for query doc snapshots
			var row = {name: user.id, email:user.data().email};
			table.row.add(row);
		});
		table.draw();
	});
}

function destroyUsersTable(){
	var table = $('#users-tbl').DataTable();
	table.clear().draw();
	table.destroy();
}