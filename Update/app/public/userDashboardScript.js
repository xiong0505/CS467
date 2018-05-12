

document.addEventListener('DOMContentLoaded', pageSetup);

function pageSetup()
{
	//Bind buttons: create an award
	
	document.getElementById("mainArea").addEventListener('click', function(event)
	{
		//If the user clicks on the "delete selected" option
		if (event.target.nodeName == "BUTTON")
		{
			if (event.target.textContent == "CREATE AN AWARD")
			{
				window.location.href = "http://www.phoenixweb3.site:3000/create-award";
			}
		}	
	 });
}


