
document.addEventListener('DOMContentLoaded', pageSetup);

function pageSetup()
{
	//Bind buttons: get email
		
	document.getElementById("reqPassword").addEventListener('click', function(event)
	{
		var req = new XMLHttpRequest();
		var payload = {};
		payload.email = document.getElementById('email').value;				
		if (document.getElementById('adminUser').checked == true)
 		{
			payload.userType = "adminUser";
		}
		else
		{
			console.log("This is a regular user"); 
			payload.userType = "regUser";
		}
		req.open("POST",  "http://www.phoenixweb3.site:3000/get-password", true);
		req.setRequestHeader('Content-Type', 'application/json');

		req.addEventListener('load', function()
		{
			if(req.status>=200 && req.status<400)
			{
				//https://www.w3schools.com/jsref/met_form_reset.asp
				document.getElementById("getPassword").reset();
				var messageArea = document.getElementById("successMessage");
				var response = JSON.parse(req.responseText);
				
				// A non-empty response indicates the email was valid
				if (response.length != 0)
				{
					console.log("Non empty response from server, this user exists");
					var message = "A temporary password has been sent to ";
					message += payload.email;	
					messageArea.textContent = message;
				}
	
				// An empty response indicates that the email is not in the selected db
				else
				{
					messageArea.textContent = "Error: No account exists for that email address";
				}	

			}
			else
			{
				console.log("Error in network request: " + req.statusText);
			}
	
		});

		req.send(JSON.stringify(payload));
		event.preventDefault();
	});
}
