const Joi = require("joi");
const { objectId } = require("./custom.validation");

const addMachine = {
    body: Joi.object().keys({
        machineId: Joi.custom(objectId).required(),
        totalIn: Joi.number().required(),
        totalOut: Joi.number().required()
    })
}

const editMachine = {
    param:Joi.object().keys({
        id:Joi.custom(objectId).required()
    }),
    body: Joi.object().keys({
        machineId: Joi.custom(objectId).required(),
        totalIn: Joi.number().required(),
        totalOut: Joi.number().required()
    })
}

const getMachines = {
    query: Joi.object().keys({
        startDate: Joi.date(),
        endDate: Joi.date(),
        month:Joi.string().pattern(/^\d{4}-(0[1-9]|1[0-2])$/), // Matches 'YYYY-MM' format where MM is between 01 and 12
        page:Joi.string(),
        limit:Joi.string()
    })
}

const addSummary = {
    body:Joi.object().keys({
        payroll:Joi.number().required(),
        match:Joi.number().required(),
        misc:Joi.number().required(),
        actualMoney:Joi.number().required(),
        date:Joi.date()
    })
}

const editSummary = {
    params:Joi.object().keys({
        summaryId:Joi.custom(objectId).required()
    }),
    body:Joi.object().keys({
        payroll:Joi.number().required(),
        match:Joi.number().required(),
        misc:Joi.number().required(),
        actualMoney:Joi.number().required(),
        totalIn:Joi.number().required(),
        totalOut:Joi.number().required()
    })
}

module.exports = { addMachine, editMachine, getMachines , addSummary , editSummary }