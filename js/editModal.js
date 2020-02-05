/* JQUERY */
$('#confirm-btn').on('click', function(){
	var row = $('#subs-tbl').DataTable().row('.selected');
	var showName = row.data().showName;
	var subsList = [];
	var rowData = {showName: showName};
	//Create data to update firebase and the datatable
	$("#subs-tbl thead tr th").each(function(){
		var columnName = this.innerHTML;
		if (columnName != 'Show Name'){
			var toggle = document.getElementById(columnName + '-toggle');
			if (toggle.checked){
				subsList.push(columnName);
				rowData[columnName] = 'yes';
			} else {
				rowData[columnName] = 'no';
			}
		}
	});
	//Update Firebase
	db.collection('shows').doc(showName).update({subs: subsList});
	//Update the datatable
	row.data(rowData).draw();
});

$('#delete-btn').on('click', function(){
	var row = $('#subs-tbl').DataTable().row('.selected');
	var showName = row.data().showName;

	Swal.fire({
		title: 'Are you sure you want to delete "' + showName + '"?',
		text: "You will have to add the show back!",
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Yes, delete it!'
	  }).then((result) => {
		if (result.value) {
			row.remove().draw();
			db.collection('shows').doc(showName).delete().then(function() {
				console.log("Show successfully deleted!");
			}).catch(function(error) {
				console.error("Error removing show: ", error);
			});
			
			Swal.fire(
				'Deleted!',
				showName + ' has been removed from the list of subscriptions.',
				'success'
			)}
	  })
});

/* FUNCTIONS */

function addUsersToEditModal(){
	var modalBody = document.getElementById('es-modal-body');

    var table = document.createElement('table');
    table.align = 'center';

    //Create a toggle dialog for every user
	db.collection("users").get().then(function(querySnapshot) {
        var i = 0;
        var row = null;
		querySnapshot.forEach(function(user) {

            if (i % 2 == 0){
                row = table.insertRow();
                var switchCell = row.insertCell(0);
                var nameCell = row.insertCell(1);
            } else {
                var switchCell = row.insertCell(2);
                var nameCell = row.insertCell(3);
            }

			//Create label
			var label = document.createElement('label');
			label.classList = 'switch';

			//Create Toggle
			var toggle = document.createElement('input');
			toggle.id = user.id + '-toggle';
			toggle.type = 'checkbox';

			//Create span
			var span = document.createElement('span');
			span.classList = 'slider round';
			
			//Create the name label
			var nameLabel = document.createElement('h5');
			nameLabel.innerHTML = user.id;
			nameLabel.classList = 'nameLabel';

			label.appendChild(toggle);
			label.appendChild(span);			

			//Add elements to the table
			switchCell.appendChild(label);
            nameCell.appendChild(nameLabel);
            
            i++;
		});
		//Append the elements to the modal body
		modalBody.appendChild(table);
	});
	
}

function clearEditModal(){
	$('#es-modal-body div').empty();
}