const express = require('express');
require('dotenv').config();
const {
  register,
  login,
  logout,
  currentUser,
  changeAvatar,
  verifyUser,
  verificationRetry,
} = require('../../controllers/authController');
const { tryCatchWrapper } = require('../../helpers/errorHandler');
const { authMiddleware } = require('../../middlewares/authMiddleware');
const { authValidation } = require('../../middlewares/authValidation');
const upload = require('../../middlewares/multerMiddleware');
const { editAvatar } = require('../../middlewares/avatarMiddleware');

const router = express.Router();

router.post('/signup', authValidation, tryCatchWrapper(register));
router.post('/login', authValidation, tryCatchWrapper(login));
router.get('/logout', authMiddleware, tryCatchWrapper(logout));
router.get('/current', authMiddleware, tryCatchWrapper(currentUser));
router.patch(
  '/avatars',
  authMiddleware,
  upload.single('avatar'),
  editAvatar,
  tryCatchWrapper(changeAvatar)
);
router.get('/verify/:verificationToken', tryCatchWrapper(verifyUser));
router.post('/verify', tryCatchWrapper(verificationRetry));

module.exports = router;
