const httpStatus = require("http-status");
const Salary = require("../../models/salary.model");
const catchAsync = require("../../utils/catchAsync");
const { paginate } = require("../../services/admin.service");

const createSalary = catchAsync(async (req,res) => {
    const data  = await Salary.create(req.body)
    res.status(httpStatus.CREATED).send({data})
})

const getSalary = catchAsync(async (req, res) => {
    const { page = 1, limit = 5, search } = req.query;

    try {
        let query = {};
        if (search) {
            query = {
                $or: [
                    { employeeId: { $regex: search, $options: 'i' } }
                ]
            };
        }
        const { data, pagination } = await paginate(Salary, query, page, limit);

        res.status(httpStatus.OK).send({
            success: true,
            message: search ? "Filtered Salaries Fetched Successfully" : "All Salaries Fetched Successfully",
            data,
            pagination
        });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            success: false,
            message: "An error occurred while fetching the attendants",
            error: error.message
        });
    }
});

const getSalaryById = catchAsync(async (req,res) => {
    const { id } = req.params
    const data = await Salary.findById(id)
    if(!data) return res.status(httpStatus.NOT_FOUND).send({message:"Not found"})
    res.status(httpStatus.OK).send({data})
})

const editSalary = catchAsync(async (req,res) => {
    const { id } = req.params
    const { salary , designation , employeeId } = req.body
    const data = await Salary.findByIdAndUpdate(id, {
        $set:{ employeeId:employeeId , designation:designation , salary:salary }
    })
    if(!data) return res.status(httpStatus.NOT_FOUND).send({message:"Not found"})
    res.status(httpStatus.OK).send({data})
})

const deleteSalary = catchAsync(async (req,res) => {
    const { id } = req.query
    const data = await Salary.findByIdAndDelete(id)
    if(!data) return res.status(httpStatus.NOT_FOUND).send({message:"Not found"})
    res.status(httpStatus.OK).send({data})
})

module.exports = { createSalary , getSalary , getSalaryById  , editSalary , deleteSalary}