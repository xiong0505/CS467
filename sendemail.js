function sendMail() {

var nodemailer = require('nodemailer');

var fs = require('fs')

var transporter = nodemailer.createTransport({

service: 'gmail',

auth: {

user: 'phoenixweb3@gmail.com',

pass: '12345678.p'

}

});



fs.readFile('Awardtest.pdf', function (err, data) {



var mailOptions = {

from: 'phoenixweb3@gmail.com',

to: 'phoenixweb3@gmail.com',

subject: 'Sending Email using Node.js',

text: 'That is not too hard!',

attachments: [{ 'filename': 'Awardtest.pdf', 'content': data }]

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

sendMail();