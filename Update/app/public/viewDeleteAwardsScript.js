

document.addEventListener('DOMContentLoaded', pageSetup);

function pageSetup()
{
	// Request for all awards by a given user
	var request = new XMLHttpRequest();
	var payload = {};
	payload.deleteAward = false;

	request.open("POST", "http://www.phoenixweb3.site:3000/view-delete-awards", true);
	request.setRequestHeader('Content-Type', 'application/json');
 		
	request.addEventListener('load', function()
	{	
 	        if(request.status >= 200 && request.status < 400)
		{
			console.log(request.responseText);
			var response = JSON.parse(request.responseText);
			buildTable(response); // build table of all awards returned 
		}
		else
		{
			console.log("Error in network request: " + request.statusText);
		}
	});

	request.send(JSON.stringify(payload));
	event.preventDefault();

	//Bind buttons: delete selected
	
	document.getElementById("buttonArea").addEventListener('click', function(event)
	{
		//If the user clicks on the "delete selected" option
		if (event.target.nodeName == "BUTTON")
		{
			if (event.target.textContent == "Delete Selected Awards")
			{
				var req2 = new XMLHttpRequest();
				var payload2 = {};
				payload2.created_by = 2;
				payload2.deleteAward = true;
				payload2.awardsToDelete = [];

				//For every row, that is checked, add its id to the array of ids
				var awardTableArea = document.getElementById("tableArea");
				var awardTable = tableArea.firstElementChild;
				//https://www.w3schools.com/jsref/prop_element_children.asp
				// For every child of the award table (for every row)	
				var childList = awardTable.children;
				var i;
				var row; // row in the table
				var firstCell; // first cell contains the checkbox
				var checkBox;
					
				// Start at i = 1 to skip the first row, which is the header row
				for (i = 1; i < childList.length; i++)
				{
					row = childList[i];
					firstCell = row.firstElementChild;
					checkBox = firstCell.firstElementChild;
					if (checkBox.checked == true)
					{
						payload2.awardsToDelete.push(checkBox.id);	
					} 
				}  

				req2.open("POST",  "http://www.phoenixweb3.site:3000/view-delete-awards", true);
				req2.setRequestHeader('Content-Type', 'application/json');

				req2.addEventListener('load', function()
				{
					if(req2.status>=200 && req2.status<400)
					{
						console.log("response received from server");
						console.log(req2.responseText);
						var response = JSON.parse(req2.responseText);
						buildTable(response); 
					}
					else
					{
						console.log("Error in network request: " + req2.statusText);
					}
	
				});

				req2.send(JSON.stringify(payload2));
				event.preventDefault();
			}
		}
	});
		
}

function buildTable(response){

	//Create a table
	//https://blackrockdigital.github.io/startbootstrap-sb-admin/tables.html
	
	var updatedTable = document.createElement("table");
	updatedTable.className = "table table-bordered dataTable";
	var headerRow = document.createElement("tr");


	//Create the header cells 	
	var headerCell = document.createElement("th");
	headerCell.textContent = "";
	headerRow.appendChild(headerCell); 

	headerCell = document.createElement("th");
	headerCell.textContent = "Date created";
	headerRow.appendChild(headerCell);

	headerCell = document.createElement("th");
	headerCell.textContent = "Recipient Last Name";
	headerRow.appendChild(headerCell);
	
	headerCell = document.createElement("th");
	headerCell.textContent = "Recipient First Name";
	headerRow.appendChild(headerCell);
	
	headerCell = document.createElement("th");
	headerCell.textContent = "Recipient Email Address";
	headerRow.appendChild(headerCell);
	
	headerCell = document.createElement("th");
	headerCell.textContent = "Region";
	headerRow.appendChild(headerCell);

	headerCell = document.createElement("th");
	headerCell.textContent = "Award Type";
	headerRow.appendChild(headerCell);

	updatedTable.appendChild(headerRow);

	response.forEach(function(award){
		var newRow = document.createElement("tr");
		
		// cell containing checkbox
		var newCell = document.createElement("td");
		var newBox = document.createElement("input");	
		newBox.type = "checkbox";
	 	newBox.name = "selection";
		newBox.value = "selected";
		newBox.id = award.id; // identifies which award is selected
		newCell.appendChild(newBox);
		newRow.appendChild(newCell);

		// cells containing info
		var newCell = document.createElement("td");
		newCell.textContent = award.date; 
		newRow.appendChild(newCell);

		newCell = document.createElement("td");
		newCell.textContent = award.recipient_lname;
		newRow.appendChild(newCell); 
	
		newCell = document.createElement("td");
		newCell.textContent = award.recipient_fname;
		newRow.appendChild(newCell);

		newCell = document.createElement("td");
		newCell.textContent = award.email;
		newRow.appendChild(newCell);	

		newCell = document.createElement("td");
		newCell.textContent = award.region;
		newRow.appendChild(newCell);

		newCell = document.createElement("td");
		newCell.textContent = award.type;
		newRow.appendChild(newCell);
		updatedTable.appendChild(newRow);
	
	});
	
	var tableDiv = document.getElementById("tableArea");

	// Delete any existing table (page will not refresh)	
	tableDiv.removeChild(tableDiv.firstElementChild); // table
		
	// Replace it with the newly-created, updated table	
	tableDiv.appendChild(updatedTable);
}

