
function latextToPdf(fileName) {

const { spawnSync } = require('child_process');

const fs = require('fs')




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




latextToPdf('Awardtest.tex')


//LaTex Directory   C:\Users\junyi\AppData\Local\Programs\MiKTeX 2.9
//WEB3 Directory    C:\Users\junyi\Documents\GitHub\CS467
