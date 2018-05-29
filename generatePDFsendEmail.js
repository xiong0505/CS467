/*var authUser='phoenixweb3@gmail.com';
var authPassword='12345678.p';
var attachment='Awardtest.pdf';
var sender='phoenixweb3@gmail.com';
var receiver='phoenixweb3@gmail.com';
var emailSubject='Sending Email with an Award PDF using Node.js';
var emailText='Congratulations! You have won an award!';
*/

var awardType="You have won Employee of the Month!";
var awardReceiver="Nina";
var awardAuthorizer="Xiong";
var getSigPic="Signature.png"
var sigPic="app/public/"+getSigPic;
var receiver="phoenixweb3@gmail.com";



var awards = require("./awards")

awards.buildAwardPdf(awardType, awardReceiver, awardAuthorizer, sigPic, receiver);
