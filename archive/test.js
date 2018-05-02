function sendMail(authUser,authPassword,attachment,sender,receiver,emailSubject,emailText) {

var nodemailer = require('nodemailer');

var fs = require('fs')

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

attachments: [{ 'filename': attachment, 'content': data }]

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


var authUser='phoenixweb3@gmail.com';
var authPassword='12345678.p';
var attachment='Awardtest.pdf';
var sender='phoenixweb3@gmail.com';
var receiver='phoenixweb3@gmail.com';
var emailSubject='Sending Email using Node.js';
var emailText='That is not too hard!';

sendMail(authUser,authPassword,attachment,sender,receiver,emailSubject,emailText);
