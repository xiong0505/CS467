/*
 * Source for code in this file:
 * https://code.tutsplus.com/tutorials/using-passport-with-sequelize-and-mysql--cms-27537
 */
 
//Use bcrypt
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport,user,admin){

	var User = user;
	var Admin = admin;

	var LocalStrategy = require('passport-local').Strategy;

	/*
 	 *  Used to serialize the user
 	 *  Determines which user data should be stored in the session
 	 *  Source for approach to serializing different user types (admin vs. normal):
 	 *  stackoverflow.com/questions/37832580/multiple-serialize-user-in-passportjs-using-mysql
 	 */

	passport.serializeUser(function(user, done) {
		
		done(null, 
			{id: user.id,
			 isAdmin: user.lname == undefined // admin users do not have a last name
			})
	});

	/*
	 *  Used to deserialize the user
	 *  First argument is the key of the user that was given to done() above
	 *  This key allows the whole user object to be retrieved from the db 
	 *  Source for approach to deserializing different user types (admin vs. normal):
	 *  stackoverflow.com/questions/29864213/serialize-deserialize-with-multiple-localstrategy-passportjs-expressjs	
	 */
  
	passport.deserializeUser(function(user, done) {

		var id = user.id;
		var collection = user.isAdmin ? Admin : User;
		collection.findById(id).then(function(user) {
			if(user){
				done(null, user.get());
       		 	}
        		else{
				done(user.errors,null);
        		}
      		});
	});

 
	/*
 	 * Strategy for signin of normal user
 	 */
 
	passport.use('local-signin', new LocalStrategy(
    
  		{

			 // override default of username and password (use email)
			 usernameField : 'email',
 			 passwordField : 'password',
 			 passReqToCallback : true 
  		},

 		function(req, email, password, done) {

    			var User = user;

	    		var isValidPassword = function(userpass,password){
      				return bCrypt.compareSync(password, userpass);
    			}

    			User.findOne({ where : { email: email}}).then(function (user) {

  				if (!user) {
        				return done(null, false, { message: 'Email does not exist' });
      				}	

      				if (!isValidPassword(user.password,password)) {

        				return done(null, false, { message: 'Incorrect password.' });
    				}	

				var userinfo = user.get();

				return done(null,userinfo);

    			}).catch(function(err){

      				console.log("Error:",err);

      				return done(null, false, { message: 'Login error' });
    			});
  		}	
  	));


	/*
 	 * Strategy for admin signin
 	 */
 
	passport.use('admin-signin', new LocalStrategy(
    
  		{

			 // override default of username and password (use email)
			 usernameField : 'email',
 			 passwordField : 'password',
 			 passReqToCallback : true 
  		},

 		function(req, email, password, done) {

    			var Admin = admin;

	    		var isValidPassword = function(userpass,password){
      				return bCrypt.compareSync(password, userpass);
    			}

			// Find an admin user with the corresponding email
    			Admin.findOne({ where : { email: email}}).then(function (admin) {

				// If there is no such admin user	
  				if (!admin) {
				
					console.log("no such user");	
					return done(null, false, { message: 'Email does not exist' });
      				}	

				// If the user exists, check the password
      				if (!isValidPassword(admin.password,password)) {

					console.log("password incorrect");
					return done(null, false, { message: 'Incorrect password.' });
    				}	

				console.log("Success");

				var admininfo = admin.get();

				// Return the admin user's info
				return done(null,admininfo);

    			}).catch(function(err){

      				console.log("Error:",err);

      				return done(null, false, { message: 'Login error' });
    			});
  		}	
  	));
}
