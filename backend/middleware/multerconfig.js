// middlewares/multerconfig.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Crée ce dossier à la racine du projet s’il n’existe pas
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
    return cb(new Error('Seules les images JPG, JPEG et PNG sont autorisées'));
  }
  cb(null, true);
};

module.exports = multer({ storage, fileFilter });
