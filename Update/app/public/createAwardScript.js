
document.addEventListener('DOMContentLoaded', pageSetup);

function pageSetup()
{

	// Bind buttons: submit new entry
	document.getElementById('awardSubmit').addEventListener('click', function(event)
	{
		// Request via Ajax
		var req = new XMLHttpRequest();
		var payload = {};

		payload.award_type = document.getElementById('award_type').value;
		payload.fname = document.getElementById('fname').value;
		payload.lname =  document.getElementById('lname').value;
		payload.email =  document.getElementById('email').value;
		payload.region =  document.getElementById('region').value;

		//Check for a blank award name in the form submission	
		if (payload.award_type == "" || payload.fname == "" || payload.lname == "" || payload.email == "" || payload.region == "" )
		{
				// Handle input validation	
		} 

		// If award name is not blank, check for a duplicate already existing in the database
		else
		{
			var req = new XMLHttpRequest();
		
			req.open("POST", "http://www.phoenixweb3.site:3000/create-award", true);
			req.setRequestHeader('Content-Type', 'application/json');
			
			req.addEventListener('load', function()
			{
			       	if(req.status >= 200 && req.status < 400)
				{
						//https://www.w3schools.com/jsref/met_form_reset.asp
						document.getElementById("awardEntry").reset();
						var messageArea = document.getElementById("successMessage");
						messageArea.textContent = "Award successfully created!";
	
				}
				else
				{
					console.log("Error in network request: " + req.statusText);
				}
			});

			console.log(payload);
			req.send(JSON.stringify(payload));
			event.preventDefault();
			
		}
	});
}
