
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

// build sginature
function buildSignature(doc, imageFile, row, col) {
    doc.image(imageFile, col, row, { scale: 0.07 });
}

// Function that build pdf file
// awardType: the awardType
// awardReceiver: the award receiver
// awardAuthorizer: the award authorizer
// fileName: the output pdf file name
// signatureFileName: the signuare file name
function buildPdf(awardType, awardReceiver, awardAuthorizer, fileName, signatureFileName) {
    var pdfkit = require('pdfkit')
    var fs = require('fs')
    var wstream = fs.createWriteStream(fileName)

    doc = new pdfkit()

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
    // 
    buildSignature(doc, signatureFileName, sectionRow + sectionRowValueGap, sectionCol + 100);
    doc.pipe(wstream)
    doc.end()
}

// Get a tempary file name which is unique
function getTempFileName(extension) {
    const uuid = require('node-uuid');
    var name = uuid.v1() + extension;
    return name;
}

var pdfFileName = getTempFileName(".pdf");

//taking variables from user
var awardType="You have won Employee of the Month!";
var awardReceiver="Nina";
var awardAuthorizer="Xiong";
var sigPic="Signature.png";

//call the function
buildPdf(awardType, awardReceiver, awardAuthorizer, pdfFileName, sigPic);
console.log("Output pdf is " + pdfFileName);


