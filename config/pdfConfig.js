const fs = require('fs');
const pdf = require('html-pdf');

const generatePDF = (filePath) => {
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    const filePDF = fs.readFileSync(filePath).toString();
    const options = {
        type: 'pdf',
        format: 'A4',
        orientation: 'portrait'
    }

    pdf.create(filePDF, options).toFile('./testPDF.pdf', function (error, res) {
        if (error) return console.log(error)
      
        console.log(res)
    })
}

module.exports =  generatePDF 