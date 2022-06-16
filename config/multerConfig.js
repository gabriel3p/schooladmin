const multer = require('multer');
const path = require('path');

module.exports = {
    dest: path.resolve(__dirname, '..', 'tmp', 'uploads'),
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, '..', 'tmp', 'uploads'))
        },

        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname));
        }

    }),

    limits: {
        fileSize: 5 * 1024 * 1024,
    },

    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpeg',
            'image/pjpeg',
            'image/png',
        ];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            
            cb(new Error('Introduza um ficheiro de imagem.'));
        }
    }
}