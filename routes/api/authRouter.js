const express = require('express');
const { register } = require('../../controllers/authController');
const { tryCatchWrapper } = require('../../helpers/errorHandler');
require('dotenv').config();

const router = express.Router();

router.post('/signup', tryCatchWrapper(register));

module.exports = router;
