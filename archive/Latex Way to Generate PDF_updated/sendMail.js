//main boday of the sendMail function

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

} else {

console.log('Email sent: ' + info.response);

}

});

})

}

//set different variables
var authUser='phoenixweb3@gmail.com';
var authPassword='12345678.p';
var attachment='Awardtest.pdf';
var sender='phoenixweb3@gmail.com';
var receiver='phoenixweb3@gmail.com';
var emailSubject='Sending Email with an Award PDF using Node.js';
var emailText='Congratulations! You have won an award!';

//call the function
sendMail(authUser,authPassword,attachment,sender,receiver,emailSubject,emailText);
