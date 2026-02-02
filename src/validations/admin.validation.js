const Joi = require('joi');
const { objectId } = require('./custom.validation');
const tagId = {
  body: Joi.object().keys({
    role: Joi.string().required(),
    id: Joi.string().optional(),
  }),
};
const issueTagToUser = {
  body: Joi.object().keys({
    tagId: Joi.custom(objectId).required(),
    userId: Joi.custom(objectId).required(),
  }),
};
const blockTag = {
  body: Joi.object().keys({
    tagId: Joi.custom(objectId).required(),
    action: Joi.string().required(),
  }),
};
const deleteIds = {
  query: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
};
const postValidation = {
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};
const slotMachine = {
  body: Joi.object().keys({
    machineId: Joi.string().required(),
    vendingPercentage: Joi.required(),
    status: Joi.string(),
  }),
};

const postContent = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    content: Joi.string().required(),
  }),
};
const getContent = {
  params: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
};

const editContent = {
  params: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    content: Joi.string().required(),
  }),
};

const postFAQ = {
  body: Joi.object().keys({
    question: Joi.string().required(),
    answer: Joi.string().required(),
  }),
};

const editFAQ = {
  params: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
  body: Joi.object().keys({
    question: Joi.string().required(),
    answer: Joi.string().required(),
  }),
};
const createCustomer = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.string().required(),
    password: Joi.string(),
    tagId: Joi.string(),
    image: Joi.string(),
    status: Joi.string(),
  }),
};

const editCustomer = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.string().required(),
    password: Joi.string(),
    tagId: Joi.string(),
    image: Joi.string(),
    status: Joi.string(),
  }),
};
const createVendor = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
    age: Joi.string().required(),
    machines: Joi.string().required(),
    password: Joi.string().required(),
  }),
};
const createSecurity = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
    age: Joi.string().required(),
  }),
};

const createSalary = {
  body: Joi.object().keys({
    salary: Joi.string().required(),
    designation: Joi.string().required(),
    employeeId: Joi.string().required(),
  }),
};

const editSalary = {
  params: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
  body: Joi.object().keys({
    employeeId: Joi.string().required(),
    designation: Joi.string().required(),
    salary: Joi.string().required(),
  }),
};
const editAttendents = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required(),
    age: Joi.string().required(),
    phone: Joi.string().required(),
    tagId: Joi.string(),
    status: Joi.string(),
  }),
};

const getData = {
  query: Joi.object().keys({
    page: Joi.number(),
    limit: Joi.number(),
    search: Joi.string().allow(''),
  }),
};

const changeStatus = {
  body: Joi.object().keys({
    id: Joi.custom(objectId).required(),
    action: Joi.string().required(),
    model: Joi.string().required(),
  }),
};

module.exports = {
  tagId,
  issueTagToUser,
  blockTag,
  deleteIds,
  postValidation,
  slotMachine,
  postContent,
  getContent,
  editContent,
  postFAQ,
  editFAQ,
  createVendor,
  createSecurity,
  createCustomer,
  createSalary,
  editSalary,
  editAttendents,
  editCustomer,
  getData,
  changeStatus,
};
