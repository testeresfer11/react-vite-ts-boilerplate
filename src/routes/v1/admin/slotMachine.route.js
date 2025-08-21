const { Router } = require("express");
const { createSlotMachine, getSlotMachine, deleteSlotMachine, checkMachineId, getSlotMachineById, editSlotMachine, changeStatusByModel, getAllSlotMachines } = require("../../../controllers/admin.controller/slotMachine.controller");
const auth = require("../../../middlewares/auth");
const validate = require("../../../middlewares/validate");
const { adminValidation } = require("../../../validations");

const slotRouter = Router();
// slotRouter.use(auth());
slotRouter.route("/")
    .post(auth(),validate(adminValidation.slotMachine),createSlotMachine)
    .get(getSlotMachine)
    .delete(auth(),validate(adminValidation.deleteIds),deleteSlotMachine)
slotRouter.route("/check").get(auth(),checkMachineId)
slotRouter.route("/status").post(validate(adminValidation.changeStatus), changeStatusByModel)
slotRouter.route("/all").get(auth() , getAllSlotMachines)
slotRouter.route("/:id").get(auth(),validate(adminValidation.getContent),getSlotMachineById)
slotRouter.route("/edit/:id").post(auth(),validate(adminValidation.slotMachine),editSlotMachine)
module.exports = slotRouter
