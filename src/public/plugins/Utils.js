class Utils {
    static exportPDF (elementId, name, orientation) {
        const element = document.getElementById(elementId);

        var opt = {
            margin: 0.5,
            filename: `${ name }.pdf`,
            image: { type: 'png', quality: 1 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation }
          };

        html2pdf()
            .set(opt)
            .from(element)
            .save();
    }
}

//orientation: landscape || portrait