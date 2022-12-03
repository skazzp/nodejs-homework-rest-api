const FsPromises = require('fs').promises;
const Jimp = require('jimp');
const { join } = require('path');
const STATIC_FILES_DIR = 'public/avatars';

async function editAvatar(req, res, next) {
  const file = req.file;
  if (!file) {
    return res.status(417).json({ message: 'No file detected' });
  }
  const originalFilePath = req.file.path;
  try {
    const image = await Jimp.read(file.path);
    file.filename = Date.now() + '.' + image.getExtension();
    const filePath = join(STATIC_FILES_DIR, file.filename);
    await image.resize(250, 250).quality(60).writeAsync(filePath);
    file.destination = STATIC_FILES_DIR;
    file.path = filePath;
    await FsPromises.unlink(originalFilePath);
    next();
  } catch (error) {
    await FsPromises.unlink(originalFilePath);
    return res.status(415).json({ message: error.message });
  }
}
module.exports = { STATIC_FILES_DIR, editAvatar };
