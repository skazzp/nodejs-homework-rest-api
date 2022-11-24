const express = require('express');
require('dotenv').config();

const {
  getAlltasks,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require('../../service');

const validation = require('../../validation/validation');

const router = express.Router();

router.get('/', async (req, res, next) => {
  const contacts = await getAlltasks();
  console.log(contacts);
  res.json({
    status: 'success',
    code: 200,
    data: { contacts },
  });
});

router.get('/:id', async (req, res, next) => {
  const contact = await getContactById(req.params.id);
  contact
    ? res.json({
        status: 'success',
        code: 200,
        data: { contact },
      })
    : res.json({
        status: 'success',
        code: 404,
        message: 'Not found',
      });
});

router.post('/', async (req, res, next) => {
  const validationResult = validation.schemaContact.validate(req.body);
  if (validationResult.error) {
    return res.json({
      status: validationResult.error.details[0].message,
      code: 400,
      message: 'missing required name field',
    });
  }
  const contact = await addContact(req.body);
  res.json({
    status: 'success',
    code: 201,
    data: { contact },
  });
});

router.delete('/:id', async (req, res, next) => {
  const response = await removeContact(req.params.id);
  response
    ? res.json({
        status: 'success',
        code: 200,
        message: 'contact deleted',
      })
    : res.json({
        status: 'Not found',
        code: 404,
        message: 'Not found',
      });
});

router.put('/:id', async (req, res, next) => {
  const validationResult = validation.schemaContact.validate(req.body);
  if (validationResult.error) {
    return res.json({
      status: validationResult.error.details[0].message,
      code: 400,
      message: 'missing fields',
    });
  }
  const contact = await updateContact(req.params.id, req.body);
  console.log(contact);
  contact
    ? res.json({
        status: 'success',
        code: 200,
        data: { contact },
      })
    : res.json({
        status: 'Not found',
        code: 404,
        message: 'Not found',
      });
});

router.patch('/:id/favorite', async (req, res, next) => {
  const validationResult = validation.schemaFavorite.validate(req.body);
  if (validationResult.error) {
    return res.json({
      status: validationResult.error.details[0].message,
      code: 400,
      message: 'missing field favorite',
    });
  }
  const contact = await updateStatusContact(req.params.id, req.body);
  console.log(contact);
  contact
    ? res.json({
        status: 'success',
        code: 200,
        data: { contact },
      })
    : res.json({
        status: 'Not found',
        code: 404,
        message: 'Not found',
      });
});

module.exports = router;