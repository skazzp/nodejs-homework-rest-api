const Contacts = require('./schemas/task');

const getAlltasks = async () => {
  return Contacts.find({});
};

const getContactById = id => {
  return Contacts.findOne({ _id: id });
};

const addContact = ({ name, email, phone, favorite }) => {
  return Contacts.create({ name, email, phone, favorite });
};

const updateContact = (id, fields) => {
  return Contacts.findByIdAndUpdate({ _id: id }, fields, { new: true });
};

const removeContact = id => {
  return Contacts.findByIdAndRemove({ _id: id });
};

const updateStatusContact = (id, body) => {
  return Contacts.findByIdAndUpdate({ _id: id }, body, { new: true });
};

module.exports = {
  getAlltasks,
  getContactById,
  addContact,
  updateContact,
  removeContact,
  updateStatusContact,
};
