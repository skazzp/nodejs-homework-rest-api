const express = require('express');
const { register, login, logout, currentUser } = require('../../controllers/authController');
const { tryCatchWrapper } = require('../../helpers/errorHandler');
const { authMiddleware } = require('../../middlewares/authMiddleware');
const { authValidation } = require('../../middlewares/authValidation');
require('dotenv').config();

const router = express.Router();

router.post('/signup', authValidation, tryCatchWrapper(register));
router.post('/login', authValidation, tryCatchWrapper(login));
router.get('/logout', authMiddleware, tryCatchWrapper(logout));
router.get('/current', authMiddleware, tryCatchWrapper(currentUser));

module.exports = router;
