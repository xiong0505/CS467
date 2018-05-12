

document.addEventListener('DOMContentLoaded', pageSetup);

function pageSetup()
{

//	var bCrypt = require('bcrypt-nodejs');


	// Request to the server for the information to pre-populate the form
	var request = new XMLHttpRequest();
	
	var payload = {};
	payload.type = "populate";
	//payload.id = document.getElementById('exId').value;

		
	request.open("POST", "http://www.phoenixweb3.site:3000/edit-user-profile", true);
	request.setRequestHeader('Content-Type', 'application/json');
	
	request.addEventListener('load', function()
	{	
 	        if(request.status >= 200 && request.status < 400)
			{
				console.log(request.responseText);
				var response = JSON.parse(request.responseText);
				
				// Populate the fields in the form				
				document.getElementById('fname').value = response[0].fname;
				document.getElementById('lname').value = response[0].lname;
				document.getElementById('email').value = response[0].email;
			}
			else
			{
				console.log("Error in network request: " + req.statusText);
			}
	});

	request.send(JSON.stringify(payload));
	event.preventDefault();		
	
	// Bind buttons: update information 
	document.getElementById('profileSubmit').addEventListener('click', function(event)
	{
		// Request via Ajax
		var req = new XMLHttpRequest();

		var payload = {};
		payload.fname = document.getElementById('fname').value;
		payload.lname = document.getElementById('lname').value;
		payload.email = document.getElementById('email').value;
		payload.newPassword = document.getElementById('newPassword').value;
		payload.type = "change";

		console.log("The new password is " + payload.newPassword);
		
		//var bCrypt = require('bcrypt-nodejs');

		//var hashPassword = bCrypt.hashSync(newPassword, bCrypt.genSaltSync(8), null);

		//console.log("The hashed password is " + hashPassword);
			
		req.open("POST", "http://www.phoenixweb3.site:3000/edit-user-profile", true);
		req.setRequestHeader('Content-Type', 'application/json');
			
		req.addEventListener('load', function()
		{
	
     	        if(req.status >= 200 && req.status < 400)
				{
					
					// After a successful update, alert the user that the row was updated
					var messageArea = document.getElementById("successMessage");
				        messageArea.textContent = "Profile successfully updated";
				}
				else
				{
					console.log("Error in network request: " + req.statusText);
				}
		});
		req.send(JSON.stringify(payload));
		event.preventDefault();
	})
}	


