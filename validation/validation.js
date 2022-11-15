const Joi = require('joi');

const schemaContact = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required(),
  phone: Joi.string().min(10).required(),
  favorite: Joi.boolean(),
});

const schemaFavorite = Joi.object({
  favorite: Joi.boolean().required(),
});

module.exports = { schemaContact, schemaFavorite };
