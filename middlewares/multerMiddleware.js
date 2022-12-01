const multer  = require('multer')
const { join } = require('path');

const TMP_FILES_DIR = join(__dirname, "../tmp");
const SIZE_LIMIT = 1024*1024;
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, TMP_FILES_DIR);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
    limits: {
      fileSize: SIZE_LIMIT,
    },
  });
  
  const upload = multer({
    storage: storage,
  });

  module.exports = upload;