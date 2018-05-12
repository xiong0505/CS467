function deleteRow(tableID, currentRowButton){
	
	var req = new XMLHttpRequest();
          
          
          var row =  currentRowButton.parentNode.parentNode;
		      var id = row.children[0].value;
          
          req.open('GET', "/delete?id=" + id , true);
          //req.setRequestHeader('Content-Type', 'application/json');
          req.addEventListener('load', function(){
          	if (req.status >= 200 && req.status < 400){
          		
          		try {
						var table = document.getElementById(tableID);
						var rowCount = table.rows.length;
						for (var i = 0; i < rowCount; i++) {
            			var row = table.rows[i];
            
					if (row==currentRowButton.parentNode.parentNode) {
						if (rowCount <= 1) {
							alert("Cannot delete all the rows.");
							break;
						}
						table.deleteRow(i);
						rowCount--;
						i--;
						}
					}
				} 
				
				catch (e) {
					alert(e);
				}

			
			}
		  else{
				console.log("Error in network request: " + req.statusText);
		  }});
          
          req.send();
          event.preventDefault();
}


function editRow(tableID, currentRowButton){

	var row =  currentRowButton.parentNode.parentNode;
	var id = row.children[0].value;
	var fname = row.children[1].textContent;
	var lname = row.children[2].textContent;
	var email = row.children[3].textContent;
	var company = row.children[4].textContent;
	window.location.href = "/edit?id=" + id + "&fname=" + fname + "&lname=" + lname + "&email=" + email + "&company=" + company;
	

}

function addRow(){

	var form = document.getElementById("userForm");
	
	var req = new XMLHttpRequest();
          
          // Add the form data to the ajax request
          var queryString = "";
          
          var fname = form.fname.value;
          var lname = form.lname.value;
          var email = form.email.value;
          var company = form.company.value;
          var password = form.password.value;
          
          queryString += "fname=" + fname + "&";
          queryString += "lname=" + lname + "&";
          queryString += "email=" + email + "&";
          queryString += "company=" + company + "&";
          queryString += "password=" + password;

          //window.location.href = "/insert-user?" + queryString;
          
          req.open('GET', '/insert-user?' + queryString, true);
          
          //console.log('-->', result.response.status);

          //req.setRequestHeader('Content-Type', 'application/json');
          req.addEventListener('load', function(){
          	if (req.status >= 200 && req.status < 400){
		
          		
          	}
          else{
          		console.log("Error in network request: " + req.statusText);
          }});
          
          req.send();
          event.preventDefault();
          //return false;
}

function getCompanies(){

var select = document.getElementById("company"); 
var options = ["1", "2", "3", "4", "5"]; 

	for(var i = 0; i < options.length; i++) {
    	var opt = options[i];
    	var el = document.createElement("option");
    	el.textContent = opt;
    	el.value = opt;
    	select.appendChild(el);
	}
}

function addAdminRow(){

  var form = document.getElementById("adminForm");
  
  var req = new XMLHttpRequest();
          
          // Add the form data to the ajax request
          var queryString = "";
          
          var email = form.email.value;
          var company = form.company.value;
          var password = form.password.value;
          
          queryString += "email=" + email + "&";
          queryString += "company=" + company + "&";
          queryString += "password=" + password;

          //window.location.href = "/insert-user?" + queryString;
          
          req.open('GET', '/insert-admin-user?' + queryString, true);
          
          //console.log('-->', result.response.status);

          //req.setRequestHeader('Content-Type', 'application/json');
          req.addEventListener('load', function(){
            if (req.status >= 200 && req.status < 400){
    
              
            }
          else{
              console.log("Error in network request: " + req.statusText);
          }});
          
          req.send();
          event.preventDefault();
          //return false;
}

function deleteAdminRow(tableID, currentRowButton){
  
  var req = new XMLHttpRequest();
          
          
          var row =  currentRowButton.parentNode.parentNode;
          var id = row.children[0].value;
          
          req.open('GET', "/delete-admin?id=" + id , true);
          //req.setRequestHeader('Content-Type', 'application/json');
          req.addEventListener('load', function(){
            if (req.status >= 200 && req.status < 400){
              
              try {
            var table = document.getElementById(tableID);
            var rowCount = table.rows.length;
            for (var i = 0; i < rowCount; i++) {
                  var row = table.rows[i];
            
          if (row==currentRowButton.parentNode.parentNode) {
            if (rowCount <= 1) {
              alert("Cannot delete all the rows.");
              break;
            }
            table.deleteRow(i);
            rowCount--;
            i--;
            }
          }
        } 
        
        catch (e) {
          alert(e);
        }

      
      }
      else{
        console.log("Error in network request: " + req.statusText);
      }});
          
          req.send();
          event.preventDefault();
}


function editAdminRow(tableID, currentRowButton){

  var row =  currentRowButton.parentNode.parentNode;
  var id = row.children[0].value;
  var email = row.children[1].textContent;
  var company = row.children[2].textContent;
  window.location.href = "/edit-admin?id=" + id + "&email=" + email + "&company=" + company;
  

}

function searchAwards(){
  var input, filter, table, tr, td, i;
  var lastname = document.getElementById("lastName");
  var lastnameFilter = lastname.value.toUpperCase();
  var email = document.getElementById("email");
  var emailFilter = email.value.toUpperCase();
  var dateSearch = document.getElementById("date");
  var dateFilter = dateSearch.value.toUpperCase();
  var typeSearch = document.getElementById("type");
  var typeFilter = typeSearch.value.toUpperCase();
  var regionSearch = document.getElementById("region");
  var regionFilter = regionSearch.value.toUpperCase();
  var createSearch = document.getElementById("createdBy");
  var createFilter = createSearch.value.toUpperCase();
  //console.log(createSearch);
  //console.log(createFilter);
  input = document.getElementById("firstName");
  filter = input.value.toUpperCase();
  table = document.getElementById("award_entry");
  tr = table.getElementsByTagName("tr");

  for (i = 0; i < tr.length; i++) {
    fnameColumn = tr[i].getElementsByTagName("td")[0];
    lnameColumn = tr[i].getElementsByTagName("td")[1];
    emailColumn = tr[i].getElementsByTagName("td")[2];
    dateColumn = tr[i].getElementsByTagName("td")[3];
    typeColumn = tr[i].getElementsByTagName("td")[4];
    regionColumn = tr[i].getElementsByTagName("td")[5];
    createColumn = tr[i].getElementsByTagName("td")[6];
    //console.log(createColumn);
    //console.log(regionColumn);
    if (fnameColumn) {
      if (fnameColumn.innerHTML.toUpperCase().indexOf(filter) > -1 && lnameColumn.innerHTML.toUpperCase().indexOf(lastnameFilter) > -1
          && emailColumn.innerHTML.toUpperCase().indexOf(emailFilter) > -1 && typeColumn.innerHTML.toUpperCase().indexOf(typeFilter) > -1
          && regionColumn.innerHTML.toUpperCase().indexOf(regionFilter) > -1 && createColumn.innerHTML.toUpperCase().indexOf(createFilter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }

  }
}

function downloadCSV(csv, filename) {
    var csvFile;
    var downloadLink;

    // CSV file
    csvFile = new Blob([csv], {type: "text/csv"});

    // Download link
    downloadLink = document.createElement("a");

    // File name
    downloadLink.download = filename;

    // Create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Hide download link
    downloadLink.style.display = "none";

    // Add the link to DOM
    document.body.appendChild(downloadLink);

    // Click download link
    downloadLink.click();
}

function exportTableToCSV(filename) {
    var csv = [];
    var rows = document.querySelectorAll("table tr");

    for (var i = 0; i < rows.length; i++) {
        // Don't add the row to the csv if it's hidden due to filtering.
        if (rows[i].style.display === "none") continue;
        
        var row = [], cols = rows[i].querySelectorAll("td, th");

        for (var j = 0; j < cols.length; j++) 
            row.push(cols[j].innerText);

        csv.push(row.join(","));        
    }

    // Download CSV file
    downloadCSV(csv.join("\n"), filename);
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [month, day, year].join('/');
}

function userAwards() {
  window.location.href = "/user-awards"
}

function regionAwards() {
  window.location.href = "/region-awards"
}

function typeAwards() {
  window.location.href = "/type-awards"
}
