const Joi = require('joi');
const { objectId } = require('./custom.validation');

const addCustomer = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    email: Joi.string().email().optional().allow(''),
    lastName: Joi.string().required(),
    age: Joi.string().optional().allow(''),
    phone: Joi.string().required(),
    dl: Joi.string().optional().allow(''),
    address: Joi.string().optional().allow(''),
    image: Joi.string().required().messages({
      'any.required': 'Profile Picture is required',
    }),
    tagId: Joi.string().required(),
  }),
};

const getCustomerById = {
  query: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
};
const deletCustomerById = {
  body: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
};

const allCustomer = {
  query: Joi.object().keys({
    page: Joi.number(),
    limit: Joi.number(),
    search: Joi.string().allow(null, '').optional(),
  }),
};

const editCustomer = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    email: Joi.string().email().optional().allow(''),
    lastName: Joi.string().required(),
    age: Joi.string().optional().allow(''),
    phone: Joi.string().required(),
    dl: Joi.string().optional().allow(''),
    address: Joi.string().optional().allow(''),
    image: Joi.string().required().messages({
      'any.required': 'Profile Picture is required',
    }),
    tagId: Joi.string().required(),
  }),
};

const helpNsupport = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    message: Joi.string().required(),
  }),
};

const scanCustomer = {
  body: Joi.object().keys({
    tagId: Joi.string().required(),
  }),
};

const linkCustomer = {
  body: Joi.object().keys({
    tagId: Joi.custom(objectId).required(),
    customerId: Joi.custom(objectId).required(),
  }),
};

const assignMatch = {
  body: Joi.object().keys({
    machineId: Joi.custom(objectId).required(),
    customerId: Joi.custom(objectId).required(),
    amount: Joi.number().required(),
  }),
};

const getAllShiftsDetails = {
  query: Joi.object().keys({
    startDate: Joi.date(),
    endDate: Joi.date(),
    firstName: Joi.string().allow(''),
    page: Joi.number(),
    limit: Joi.number(),
  }),
};

module.exports = {
  addCustomer,
  getCustomerById,
  deletCustomerById,
  editCustomer,
  allCustomer,
  helpNsupport,
  scanCustomer,
  linkCustomer,
  assignMatch,
  getAllShiftsDetails,
};
