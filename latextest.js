
//latexToPdf(), it will receive different variables
function latextToPdf(fileName,awardType,awardReceiver,awardAuthorizer,sigPic) {

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



//taking variables from user
var awardType="You have won Employee of the Month!";
var awardReceiver="Nina";
var awardAuthorizer="Xiong";
var sigPic="Signature.png";

latextToPdf('Awardtest.tex',awardType,awardReceiver,awardAuthorizer,sigPic);


//LaTex Directory   C:\Users\junyi\AppData\Local\Programs\MiKTeX 2.9
//WEB3 Directory    C:\Users\junyi\Documents\GitHub\CS467
