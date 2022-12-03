const Contacts = require('../service/schemas/contacts');
const validation = require('../validation/validation');

const getContacts = async (req, res, next) => {
  console.log(req.user);
  const contacts = await Contacts.find({ owner: req.user._id });
  // console.log(contacts);
  res.json({
    status: 'success',
    code: 200,
    data: { contacts },
  });
};

const getContactById = async (req, res, next) => {
  const contact = await Contacts.findOne({ _id: req.params.id, owner: req.user._id });
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
};

const addContact = async (req, res, next) => {
  const validationResult = validation.schemaContact.validate(req.body);
  if (validationResult.error) {
    return res.json({
      status: validationResult.error.details[0].message,
      code: 400,
      message: 'missing required name field',
    });
  }
  const { name, email, phone, favorite } = req.body;
  await Contacts.create({ name, email, phone, favorite, owner: req.user._id });
  res.json({
    status: 'success',
    code: 201,
    data: { name, email, phone, favorite },
  });
};

const removeContact = async (req, res, next) => {
  const response = await Contacts.findByIdAndRemove({ _id: req.params.id, owner: req.user._id });
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
};

const updateContact = async (req, res, next) => {
  const validationResult = validation.schemaContact.validate(req.body);
  if (validationResult.error) {
    return res.json({
      status: validationResult.error.details[0].message,
      code: 400,
      message: 'missing fields',
    });
  }
  const { name, email, phone, favorite } = req.body;
  const contact = await Contacts.findByIdAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    { name, email, phone, favorite, owner: req.user._id },
    {
      new: true,
    }
  );
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
};

const updateStatusContact = async (req, res, next) => {
  const validationResult = validation.schemaFavorite.validate(req.body);
  if (validationResult.error) {
    return res.json({
      status: validationResult.error.details[0].message,
      code: 400,
      message: 'missing field favorite',
    });
  }
  const contact = await Contacts.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true });
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
};
module.exports = {
  getContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
};
