module.exports = {
    buildAwardPdf: function (awardType,
        awardReceiver,
        awardAuthorizer,
        signatureFileName,
        awardReceiverEmail) {
        var fileName = getTempFileName(".pdf");
        buildPdf(awardType, awardReceiver, awardAuthorizer, fileName, signatureFileName, function () {
            sendMail(awardReceiverEmail, fileName)
        });
    }

}

function sendMail(receiver, attachment) {
    var emailSubject = 'Sending Email with an Award PDF using Node.js';
    var body = 'Congratulations!  You have won an award!';
    var authUser = 'phoenixweb3@gmail.com';
    var authPassword = '12345678.p';
    //var attachment = pdfFileName;
    var sender = 'phoenixweb3@gmail.com';
    var nodemailer = require('nodemailer');
    var fileName = "Award.pdf";

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
        text: body,

    };
    if (attachment) {
        mailOptions.attachments = [
            {
                filename: fileName,
                path: attachment
            }
        ]
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Email sent: ' + info.response);
        }
    });
}

function getTempFileName(extension) {
    const uuid = require('node-uuid');
    var name = uuid.v1() + extension;
    return name;
}

// build section title
function buildTitle(doc, name, row, col) {
    doc.fontSize(18)
        .text(name, col, row);
}

// build content
function buildContent(doc, content, row, col) {
    doc.fontSize(13)
        .text(content, col, row);
}

// build signature
function buildSignature(doc, imageFile, row, col) {
    doc.image(imageFile, col, row, { scale: 0.07 });
}

// Function that build pdf file
// awardType: the awardType
// awardReceiver: the award receiver
// awardAuthorizer: the award authorizer
// fileName: the output pdf file name
// signatureFileName: the signuare file name
function buildPdf(awardType, awardReceiver, awardAuthorizer, fileName, signatureFileName, afterwards) {

    var fs = require('fs')
    var wstream = fs.createWriteStream(fileName);
    wstream.on('unpipe', function () {
        // close after unpipe is done
        wstream.close()
        afterwards()
    })
    buildPdfToStream(wstream, awardType, awardReceiver, awardAuthorizer, signatureFileName)
}

function buildPdfToStream(wstream, awardType, awardReceiver, awardAuthorizer, signatureFileName) {
    var pdfkit = require('pdfkit')
    doc = new pdfkit()
    doc.pipe(wstream)
    // build header
    doc.fontSize(25)
        .text('Award!', 300, 80);
    var sectionHeight = 80;
    var sectionRowValueGap = 30;
    var sectionRow = 120;
    var sectionCol = 100;
    var sectionValCol = sectionCol + 20;
    buildTitle(doc, "1 Type of Award", sectionRow, sectionCol);
    buildContent(doc, "You have won " + awardType + "!", sectionRow + sectionRowValueGap, sectionValCol);
    sectionRow += sectionHeight;
    buildTitle(doc, "2 Receiver", sectionRow, sectionCol);
    buildContent(doc, awardReceiver, sectionRow + sectionRowValueGap, sectionValCol);
    sectionRow += sectionHeight
    buildTitle(doc, "3 Authorizing User", sectionRow, sectionCol);
    buildContent(doc, awardAuthorizer, sectionRow + sectionRowValueGap, sectionValCol);
    sectionRow += sectionHeight
    buildTitle(doc, "4 Authorizing User Signature image", sectionRow, sectionCol);
    buildSignature(doc, signatureFileName, sectionRow + sectionRowValueGap, sectionCol + 100);
    doc.end()
}

