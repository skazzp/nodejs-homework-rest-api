const fs = require('fs/promises');
const path = require('path');
const { v1: uuidv1 } = require('uuid');

const contactsPath = path.join(__dirname, 'contacts.json');

const listContacts = async () => {
  const contacts = await fs.readFile(contactsPath, { encoding: 'utf-8' });
  return JSON.parse(contacts);
};

const getContactById = async contactId => {
  const contacts = await fs.readFile(contactsPath, { encoding: 'utf-8' });
  return JSON.parse(contacts).find(elem => elem.id === contactId);
};

const addContact = async body => {
  const { name, email, phone } = body;
  const contacts = await fs.readFile(contactsPath, { encoding: 'utf-8' });
  const parsedContacts = JSON.parse(contacts);
  const newContact = {
    id: uuidv1(),
    name: name,
    email: email,
    phone: phone,
  };
  parsedContacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(parsedContacts)).catch(err => console.log(err));
  return newContact;
};

const removeContact = async contactId => {
  const contacts = await fs.readFile(contactsPath, { encoding: 'utf-8' });
  const parsedContacts = JSON.parse(contacts);
  await fs
    .writeFile(contactsPath, JSON.stringify(parsedContacts.filter(elem => elem.id !== contactId)))
    .catch(err => console.log(err));
  return parsedContacts.filter(elem => elem.id === contactId).length;
};

const updateContact = async (contactId, { name, email, phone }) => {
  const contacts = await fs.readFile(contactsPath, { encoding: 'utf-8' });
  const parsedContacts = JSON.parse(contacts);
  const contactToChange = parsedContacts.find(elem => elem.id === contactId);
  if (!contactToChange) {
    return null;
  }
  contactToChange.name = name;
  contactToChange.email = email;
  contactToChange.phone = phone;
  await fs.writeFile(contactsPath, JSON.stringify(parsedContacts));
  return contactToChange;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
