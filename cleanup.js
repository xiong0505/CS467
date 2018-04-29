function ensureDir(dirName) {
    var fs = require('fs')
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName)
    }
}

function ensureTempDir() {
    ensureDir('tmp')
}

function createTempSubFolder() {
    ensureTempDir()
    const uuid = require('node-uuid')
    var name = uuid.v1()
    var fullname = 'tmp/' + name
    ensureDir(fullname)
    return fullname
}

function duplicateFile(src) {
    const path = require('path')
    var fileName = path.basename(src)
    var subFolder = createTempSubFolder()
    var dest = subFolder + "/" + fileName
    copyFile(src, dest)
    return dest
}

function copyFile(src, dest) {
    var fs = require("fs")
    fs.createReadStream(src).pipe(fs.createWriteStream(dest));
}

function latextToPdf(file, requiredFiles, callback) {
    const { spawn } = require('child_process');
    const path = require('path')
    var dupFile = duplicateFile(file)
    // copy required files
    requiredFiles.forEach(file => {
        var dest = path.dirname(dupFile) + "/" + path.basename(file)
        copyFile(file, dest)
    });
    var workingDir = path.dirname(dupFile)
    proc = spawn("pdflatex", ["-synctex=1", '-interaction=nonstopmode', '-file-line-error', '-recorder', file],
        {
            cwd: workingDir
        })
    proc.stdout.on('data', (data) => {
        console.log("[latextToPdf]" + data)
    })
    proc.stderr.on('error', (data) => {
        console.warn("[latextToPdf]" + data)
    })

    // figure output file name
    var extname = path.extname(dupFile)
    var outputFileName = dupFile.slice(0, dupFile.length - extname.length) + ".pdf"
    proc.on('exit', (code) => {
        callback(code, outputFileName)
    })
    // clean up the folder
    var rimraf = require("rimraf")
    rimraf(workingDir, function () { console.log("%s has been deleted", workingDir) })
}

latextToPdf('Awardtest.tex',['Signature.png'], (code, pdfFileName) => {
    console.log("Code:" + code)
    console.log("pdfFileName:" + pdfFileName)
})
