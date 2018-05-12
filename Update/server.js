var express = require('express')
var app = express()
var passport = require('passport')
var session = require('express-session')
var bodyParser = require('body-parser')
var env = require('dotenv').load()
var exphbs = require('express-handlebars');
var mysql = require('./dbcon.js')
var bCrypt = require('bcrypt-nodejs');

// Static files
app.use(express.static('./app/public'));		// static files are in the public directory 	

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Passport
app.use(session({secret: 'jhg23424^@gydhw$', resave: true, saveUninitialized:true})); //set up secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.set('views', './app/views')
app.engine('hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');
    
//Models
var models = require("./app/models");

//load passport strategies
var userStrategy = require('./app/config/passport/passport.js')(passport,models.user,models.admin_user);

/*
 *  Routes to pages
 */
	
app.get('/', function(req, res){
	 res.redirect('/login');
});


/*
 * Normal user sign-in
 * Modified from: https://code.tutsplus.com/tutorials/using-passport-with-sequelize-and-mysql--cms-27537
 */	 
	 
 app.get('/login', function(req,res){
	res.render('login', { layout: 'user_plain'}) ; 
});

/*
 * Password retrieval
 */	 
	 
 app.get('/get-password', function(req,res){
	res.render('getPassword', { layout: 'user_plain'}) ; 
});

app.post('/get-password', function(req,res,next){

	// Get email and user type from request	
	var email = req.body.email;
	var userType = req.body.userType;

	// Build the MySQL query to find the user
	var queryString = "SELECT * FROM ";
	var collection = "";
	if (userType == "adminUser")
	{
		console.log("request type is admin user");	
		collection = "admin_user";
	}		
	else
	{
		console.log("request type is user");
		collection = "user";
	}
	queryString += collection;
	queryString += " WHERE email=?";

	console.log("Full query string is: " + queryString);

	// Query the db to find the user
	mysql.pool.query(queryString, [[email]],
	function(err, result)
	{
		if(err)
		{
			next(err);
			return;	
		}  

		// If there is no such email
		if (result.length == 0) 
		{
			// An empty result will be sent
			res.send(JSON.stringify(result));
		}
		else
		{
			// Generate a new random password for that user
			// Source: stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
			var tempPassword = Math.random().toString(36).substring(7);
			console.log("Temporary password is " + tempPassword);

			// Encrypt the password
			var hashPassword = bCrypt.hashSync(tempPassword, bCrypt.genSaltSync(8), null);
			console.log("hashed password is: " + hashPassword);
			
			// Build the MySQL query to update the password in the database		
			var queryString2 = "UPDATE ";
			queryString2 += collection;
			queryString2 += " SET password=? WHERE email=?";

			// Update the password
			mysql.pool.query(queryString2, [hashPassword, email],function(err, result)
			{
				if(err)
				{
					console.log("Error in mysql response");
					next(err);
					return;
				}	
				// Send the result as the response	
				res.send(JSON.stringify(result)); 

				console.log("Sending email");	

				// Variables for function to send email
				var authUser='phoenixweb3@gmail.com';
				var authPassword='12345678.p';
				var sender='phoenixweb3@gmail.com';
				var receiver='lauritzn@oregonstate.edu';
				//var receiver = email;
				var emailSubject='Password Retrieval';
				var emailText="Your temporary password is: ";
				emailText+=tempPassword;

				// Call the function to send email
				sendMail(authUser,authPassword,sender,receiver,emailSubject,emailText); 
					
			});
		}
	});
});


/*
 * Admin user sign-in
 * Modified from: https://code.tutsplus.com/tutorials/using-passport-with-sequelize-and-mysql--cms-27537
 */	 
	 
 app.get('/admin-login', function(req,res){
	res.render('adminLogin', { layout: 'admin_plain'}) ; 
});

	 
/*
 * User sign up: create normal user
 */ 

app.get('/add-user', isLoggedInAdmin, function(req,res){
  var context = {};
  mysql.pool.query("SELECT id from company;", function(err,rows,fields){
    if (err){
      console.log(err);
      next(err);
      return;
    }
    context.results = rows;
    var companies = [];
    //console.log('The solution is: ', rows.length);
    for (var i =0; i < rows.length; i++) {
      //console.log('The solution is: ', rows[i]["id"]);
      companies.push(rows[i]["id"]);
    }
    console.log(companies);
    res.render('addUser', {companies : companies});
  });
});


app.get('/insert-user', isLoggedInAdmin, function(req,res,next){
  var context = {};

	// encrypt password
	
		var newPassword = req.query.password;
	
		var hashPassword = bCrypt.hashSync(newPassword, bCrypt.genSaltSync(8), null);
	 	

  mysql.pool.query("INSERT INTO user (`fname`, `lname`, `email`, `password`,`timestamp`,`company`) VALUES (?,?,?,?,NOW(),?)", 
  [req.query.fname, req.query.lname, req.query.email, hashPassword, req.query.company], 
  function(err, result){
    if(err){
      console.log(err);
      next(err);
      return;
    }
    res.render('adminDash',context);
  });
});


/*
 * Admin sign up: create admin user
 *
 */ 

app.get('/add-admin-user', function(req,res){
  var context = {};
    mysql.pool.query("SELECT id from company;", function(err,rows,fields){
    if (err){
      console.log(err);
      next(err);
      return;
    }
    context.results = rows;
    var companies = [];
    //console.log('The solution is: ', rows.length);
    for (var i =0; i < rows.length; i++) {
      //console.log('The solution is: ', rows[i]["id"]);
      companies.push(rows[i]["id"]);
    }
    console.log(companies);
    res.render('addAdminUser', {companies : companies});
  });
});
		
	
app.get('/insert-admin-user',function(req,res,next){
  var context = {};

		// encrypt the password
		var newPassword = req.query.password;
	
		var hashPassword = bCrypt.hashSync(newPassword, bCrypt.genSaltSync(8), null);
	console.log("inserting user");	
	
  mysql.pool.query("INSERT INTO admin_user ( `email`, `password`,`timestamp`,`company`) VALUES (?,?,NOW(),?)", 
  [req.query.email, hashPassword, req.query.company], 
  function(err, result){
    if(err){
      console.log(err);
      next(err);
      return;
    }
    res.render('adminDash',context );
  });
});

app.get('/admin-dashboard', isLoggedInAdmin, function(req,res){
  var context = {};
   context.layout = 'main';	
  res.render('adminDash', context );
});

/*
 *  Edit/delete users: normal or admin
 *
 */ 

app.get('/edit-delete-user', isLoggedInAdmin, function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM user', function(err, rows, fields){
    if(err){
      console.log(err);
      next(err);
      return;
    }
    context.results = rows;
    res.render('editDeleteUser', context);
  });
});

app.get('/edit-delete-admin-user', isLoggedInAdmin, function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM admin_user', function(err, rows, fields){
    if(err){
      console.log(err);
      next(err);
      return;
    }
    context.results = rows;
    res.render('editDeleteAdminUser', context);
  });
});

app.get('/edit', function(req,res,next){

	var context = {};
	
	var id = req.query.id;
	var fname = req.query.fname;
	var lname = req.query.lname;
	var email = req.query.email;
	var company = req.query.company;
	
	context.id = id;
	context.fname = fname;
	context.lname = lname;
	context.email = email;
	context.company = company;
	res.render('editForm', context);
	
});

app.get('/edit-admin', isLoggedInAdmin, function(req,res,next){

  var context = {};
  
  var id = req.query.id;
  var email = req.query.email;
  var company = req.query.company;
  
  context.id = id;
  context.email = email;
  context.company = company;
  res.render('editAdminForm', context);
  
});

app.get('/delete', isLoggedInAdmin, function(req,res,next){
  var context = {};
  mysql.pool.query("DELETE FROM user WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Deleted " + result.changedRows + " rows.";
    res.render('home',context);
  });
});

app.get('/delete-admin', isLoggedInAdmin, function(req,res,next){
  var context = {};
  pool.query("DELETE FROM admin_user WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Deleted " + result.changedRows + " rows.";
    res.render('home',context);
  });
});

///safe-update?id=1&name=The+Task&done=false
app.get('/safe-update', isLoggedInAdmin, function(req,res,next){
  var context = {};
  pool.query("SELECT * FROM user WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      console.log(err);
      return;
    }
    if(result.length == 1){
      var curVals = result[0];
      pool.query("UPDATE user SET fname=?, lname=?, email=?, company=? WHERE id=? ",
        [req.query.fname || curVals.fname, req.query.lname || curVals.lname, req.query.email || curVals.email, req.query.company || curVals.company, req.query.id],
        function(err, result){
        if(err){
          next(err);
          console.log(err);
          return;
        }
        //context.results = "Updated " + result.changedRows + " rows.";
        pool.query('SELECT * FROM user', function(err, rows, fields){
        if(err){
          console.log(err);
          next(err);
          return;
        }
        context.results = rows;
        res.render('editDeleteUser', context);
      });
      });
    }
  });
});

app.get('/safe-admin-update',isLoggedInAdmin, function(req,res,next){
  var context = {};
  pool.query("SELECT * FROM admin_user WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      console.log(err);
      return;
    }
    if(result.length == 1){
      var curVals = result[0];
      pool.query("UPDATE admin_user SET email=?, company=? WHERE id=? ",
        [req.query.email || curVals.email, req.query.company || curVals.company, req.query.id],
        function(err, result){
        if(err){
          next(err);
          console.log(err);
          return;
        }
        //context.results = "Updated " + result.changedRows + " rows.";
        pool.query('SELECT * FROM admin_user', function(err, rows, fields){
        if(err){
          console.log(err);
          next(err);
          return;
        }
        context.results = rows;
        res.render('editDeleteAdminUser', context);
      });
      });
    }
  });
});

/*
 *   BI Reporting: Awards
 */ 

app.get('/awards', isLoggedInAdmin, function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT CONCAT(fname, " " ,lname) AS createdBy,A.id,A.recipient_fname,A.recipient_lname,A.email,A.date,A.type,A.region,A.created_by FROM award_entry A inner join user U on A.created_by=U.id', function(err, rows, fields){
    if(err){
      console.log(err);
      next(err);
      return;
    }
    context.results = rows;
    context.layout = 'admin_main';	
    res.render('awards', context);
  });
});

app.get('/user-awards', isLoggedInAdmin, function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT U.fname, U.lname, count(A.id) as awards_created from award_entry A inner join user U on A.created_by=U.id group by created_by, U.fname, U.lname order by awards_created desc', function(err, rows, fields){
    if (err){
      console.log(err);
      next(err);
      return;
    }
    context.results = rows;
    context.layout = 'admin_main';	
    res.render('userAwards', context);
  });
});

app.get('/region-awards', isLoggedInAdmin, function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT A.region, count(A.id) as awards_created from award_entry A inner join user U on A.created_by=U.id group by A.region order by awards_created desc', function(err,rows,fields){
    if(err){
      console.log(err);
      next(err);
      return;
    }
    context.results = rows;
    context.layout = 'admin_main';		
    res.render('regionAwards', context);
  });
});

app.get('/type-awards', isLoggedInAdmin, function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT A.type, count(A.id) as awards_created from award_entry A inner join user U on A.created_by=U.id group by A.type order by awards_created desc', function(err,rows,fields){
    if(err){
      console.log(err);
      next(err);
      return;
    }
    context.results = rows;
    context.layout = 'admin_main';	
    res.render('typeAwards', context);
  });
});


/*
 * Log in
 * Source: https://code.tutsplus.com/tutorials/using-passport-with-sequelize-and-mysql--cms-27537
 */

app.post('/login', passport.authenticate('local-signin',  { successRedirect: '/user-dashboard',
	failureRedirect: '/login'}
));

/*
 * Admin log in
 * Modified from: https://code.tutsplus.com/tutorials/using-passport-with-sequelize-and-mysql--cms-27537
 */

app.post('/admin-login', passport.authenticate('admin-signin',  { successRedirect: '/admin-dashboard',
	failureRedirect: '/admin-login'}
));

/*
 * Log out
 * Source: https://code.tutsplus.com/tutorials/using-passport-with-sequelize-and-mysql--cms-27537
 */

app.get('/logout', function(req,res){
	req.session.destroy(function(err){
		res.redirect('/');
	});
}); 	


/*
 * Loads the user dashboard
 * GET /user-dashboard
 */
 
app.get('/user-dashboard', isLoggedIn, function(req,res,next){

	res.render('userDashboard', { layout: 'user_main'});
});

/*
 * Loads the create award page
 * GET /create-award
 */ 

app.get('/create-award', isLoggedIn, function(req,res,next){

	console.log("user name: " + req.user.fname + req.user.lname);

	res.render('createAward', { layout: 'user_main'});
});

/*
 * Posts a newly created award
 * POST /create-award
 */  

app.post('/create-award', isLoggedIn, function(req,res,next){

	var award_type = req.body.award_type;
	var fname = req.body.fname;
	var lname = req.body.lname;
	var email = req.body.email;
	var region = req.body.region;

	//https://stackoverflow.com/questions/14951789/passport-js-how-to-access-user-object-after-authentication	
	var created_by = req.user.id;
	
	//https://stackoverflow.com/questions/10211145/getting-current-date-and-time-in-javascript
	
	var timestamp = new Date();

	var date = timestamp.getFullYear() + "-" + (timestamp.getMonth()+1) + "-" + timestamp.getDate();
	date += " ";
	date += timestamp.getHours();
	date += ":";
	date += timestamp.getMinutes();
	date += ":";
	date += timestamp.getSeconds();

	// Get the first and last name of the user creating the award
	var created_by_fname = req.user.fname;
	var created_by_lname = req.user.lname;
 
	// Create the .pdf
	var awardRecipient = fname + " " + lname;
	var awardCreator = "";
	awardCreator += created_by_fname;
	awardCreator += " ";
	awardCreator += created_by_lname;

	console.log("Award type is: " + award_type);
	console.log("Recipient is: " + awardRecipient);
	console.log("Creator is: " + awardCreator);

	var sigPic="Signature.png";
	 
	//latexToPdf('Awardtest.tex', award_type, awardRecipient, awardCreator, sigPic);

	// Update  the database to reflect the new award
	mysql.pool.query("INSERT INTO award_entry (`type`, `recipient_fname`, `recipient_lname`, `email`, `region`, `created_by`, `date`) VALUES (?)",
		 [[award_type, fname, lname, email, region, created_by, date]],
	function(err, result)
	{
		if(err)
		{
			next(err);
			return;	
		}  
		
		res.send(JSON.stringify(result));
	});
		
});

/*
 * Loads the edit profile page
 * GET /edit-user-profile
 */ 

app.get('/edit-user-profile', isLoggedIn, function(req,res,next){

        res.render('editProfile', { layout: 'user_main'});
});

/* 
 * Pre-populates the user profile, posts updated profile info
 * POST /edit-user-profile
 */ 

app.post('/edit-user-profile', isLoggedIn, function(req,res,next){

	var norm_user = req.user.id;

	if (req.body.type == "populate")
	{
		mysql.pool.query("SELECT * FROM user WHERE id=?", [norm_user], function(err, result)
		{
			if(err)
			{
				next(err);
				return;
			}
			
		var userInfo = JSON.stringify(result);
		res.type('application/json');
		res.send(userInfo);
		});	
	}

	else if (req.body.type == "change")
	{
		var fname = req.body.fname;
		var lname = req.body.lname;
		var email = req.body.email;
		
		var newPassword = req.body.newPassword;
	
		var hashPassword = bCrypt.hashSync(newPassword, bCrypt.genSaltSync(8), null);
			
		var norm_user = req.user.id;
				
		mysql.pool.query("SELECT * FROM user WHERE id=?", [norm_user], function(err, result)
	   	{
			if(err)
			{
				console.log("Error, no such user!");
      				next(err);
    				return;
	  		}
			// Need to add a check that the email is unique
			if(result.length == 1) // If there was a result, meaning the ID was not bad
			{
				mysql.pool.query("UPDATE user SET fname=?, lname=?, email=?, password=? WHERE id=?", [fname, lname, email, hashPassword, norm_user],	
				function(err, result)
				{
					if(err)
					{
						next(err);
						return;
					}	
					// Send the result as the response	
					res.send(JSON.stringify(result)); 
				});
			}
		});	

	}
});


/*
 * Loads the view/delete awards page
 * GET /view-delete-awards
 * For now this should load all the awards
 */ 

app.get('/view-delete-awards', isLoggedIn, function(req,res,next){

	res.render('viewDeleteAwards', { layout: 'user_main'});
});


/*
 * Loads awards
 * POST /view-delete-awards
 */ 


app.post('/view-delete-awards', isLoggedIn, function(req,res,next){

	var user_created = req.user.id;

	if (req.body.deleteAward == false)
	{
		mysql.pool.query("SELECT * FROM award_entry WHERE created_by=?", [user_created], function(err, result)
		{
			if(err)
			{
				next(err);
				return;
			}
			
		var currentTable = JSON.stringify(result);
		res.type('application/json');
		res.send(currentTable);
		});	
	}

	else if (req.body.deleteAward == true)
	{
		var awardList = req.body.awardsToDelete;
		var queryStr = "DELETE FROM award_entry WHERE"; // string to build query

		for (var i=0; i<awardList.length; i++)
		{
			queryStr +=" id=?";
			if (i!=awardList.length-1) // if it is not yet the last item to delete
			{
				queryStr += " OR";
			}
		}	
		
		mysql.pool.query(queryStr, awardList, function(err, result)
		{
			if(err)
			{
				next(err);
				return;
			}
				
			mysql.pool.query("SELECT * FROM award_entry", function(err, rows)
			{		
				if(err)
				{
					next(err);
					return;
				}
				var currentTable = JSON.stringify(rows);
				res.type('application/json');
				res.send(currentTable);	
			});	
		});
	}	
});

/*
 *  Page not found
 */
 
app.use(function(req,res){
  res.status(404);
  res.render('404');
});

/*
 *  Error page
 */ 
 
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

//Update Database
models.sequelize.sync().then(function(){
    console.log("Database update succeeded")

    }).catch(function(err){
    console.log(err,"Database update failed")
});

// Function to check whether the user is logged in
// Source: https://code.tutsplus.com/tutorials/using-passport-with-sequelize-and-mysql--cms-27537
function isLoggedIn(req, res, next) {

    	if (req.isAuthenticated())
	{
		// Only a regular user will have a first name	
		if (req.user.fname != undefined)
		{
        		return next();
		}
	}
	res.redirect('/login');
}

// Function to check whether the admin user is logged in
// Source: https://code.tutsplus.com/tutorials/using-passport-with-sequelize-and-mysql--cms-27537
function isLoggedInAdmin(req, res, next) {

	if (req.isAuthenticated())
	{
		// An admin user will not have a first name
		if (req.user.fname == undefined) /// admin users do not have a first name
		{
	       	 	return next();
		}
	}
	res.redirect('/admin-login');
}

//main body of the sendMail function

function sendMail(authUser,authPassword,sender,receiver,emailSubject,emailText) {

	var nodemailer = require('nodemailer');

	var transporter = nodemailer.createTransport({

	service: 'gmail',

		auth: {

		user: authUser,

		pass: authPassword
	}

	});


	var mailOptions = {

		from: sender,

		to: receiver,

		subject: emailSubject,

		text: emailText

	};


	transporter.sendMail(mailOptions, function (error, info) {

		if (error) {

			console.log(error);
	
		} 
		else {

			console.log('Email sent: ' + info.response);

		}
	});
}

//main body of the sendMail function, includes attachment

function sendMail(authUser,authPassword,attachment,sender,receiver,emailSubject,emailText) {

	var nodemailer = require('nodemailer');

	var fs = require('fs')  //enable the pdf to be read within the same folder

	var transporter = nodemailer.createTransport({

		service: 'gmail',
	
		auth: {

			user: authUser,

			pass: authPassword
		}		
	});

	fs.readFile(attachment, function (err, data) {

		var mailOptions = {

			from: sender,

			to: receiver,

			subject: emailSubject,

			text: emailText,

			attachments: [{ 'filename': attachment, 'content': data }]    //pdf attachment
		};

		transporter.sendMail(mailOptions, function (error, info) {

			if (error) {
	
				console.log(error);

			} 
			else {
	
				console.log('Email sent: ' + info.response);

			}	
		});
	})
}

//latexToPdf(), it will receive different variables
function latexToPdf(fileName,awardType,awardReceiver,awardAuthorizer,sigPic) {

	const fs = require('fs')

	var content="\\documentclass[20pt,a4papper]{article}\n";
	content+="\\usepackage{graphicx}\n\n";

	content+="\\begin{document}\n";
	content+="\\title{Award!}\n";
	content+="\\maketitle\n\n";

	content+="\\section{Type of Award}\n";
	content+=awardType+"\n\n";

	content+="\\section{Receiver}\n";
	content+=awardReceiver+"\n\n";

	content+="\\section{Authorizing User}\n";
	content+=awardAuthorizer+"\n\n";

	content+="\\section{Authorizing User Signature image}\n";
	content+="\\begin{center}\n";
	content+="\\includegraphics[scale=0.06]{"+sigPic+"}\n";
	content+="\\end{center}\n\n";

	content+="\\end{document}"


	fs.writeFileSync("Awardtest.tex",content,function(err){
		if(err){return console.log(err);}
		console.log("The file was saved!");
	});


	const { spawnSync } = require('child_process');


	result = spawnSync('pdflatex',
	["-synctex=1", '-interaction=nonstopmode', '-file-line-error', '-recorder',
	fileName])

	console.log("STDOUT:", String(result.stdout))

	if (result.error) {

		console.log("ERROR:", String(result.error))

		return false

	}		

	console.log("STDERR:", String(result.stderr))

	return true;

}


// Start the server listening on Port 3000


app.listen(3000, function(err){
	if(!err){
		console.log("Listening on Port 3000");
	} 
	else{
		 console.log(err);
	}
});




    
