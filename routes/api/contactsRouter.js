require('dotenv').config();
const express = require('express');

const { tryCatchWrapper } = require('../../helpers/errorHandler');
const { authMiddleware } = require('../../middlewares/authMiddleware');
// const {  } = require('../../service');
const {
  getContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require('../../controllers/contactsController');

const router = express.Router();

router.use(authMiddleware);

router.get('/', tryCatchWrapper(getContacts));

router.get('/:id', tryCatchWrapper(getContactById));

router.post('/', tryCatchWrapper(addContact));

router.delete('/:id', tryCatchWrapper(removeContact));

router.put('/:id', tryCatchWrapper(updateContact));

router.patch('/:id/favorite', tryCatchWrapper(updateStatusContact));

module.exports = router;
