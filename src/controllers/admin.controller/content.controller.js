const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const { contentService } = require("../../services");

// Create new content
const createContent = catchAsync(async (req, res) => {
    const { name, description, content } = req.body;
    const data = await contentService.createContent({ name, description, content });
    res.status(httpStatus.CREATED).send({
        success: true,
        message: "Content created successfully",
        data
    });
});

// Get all content with pagination and search
const getContent = catchAsync(async (req, res) => {
    const { page = 1, limit = 10, search } = req.query;

    try {
        let filter = { isDeleted: false };
        if (search) {
            filter = {
                ...filter,
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ]
            };
        }
        const { data, pagination } = await contentService.queryContents(filter, page, limit);

        res.status(httpStatus.OK).send({
            success: true,
            message: search ? "Filtered Content Fetched Successfully" : "All Content Fetched Successfully",
            data,
            pagination
        });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            success: false,
            message: "An error occurred while fetching the Content",
            error: error.message
        });
    }
});

// Get single content by ID
const getContentById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const data = await contentService.getContentById(id);

    if (!data) {
        return res.status(httpStatus.NOT_FOUND).send({
            success: false,
            message: "Content not found"
        });
    }

    res.status(httpStatus.OK).send({
        success: true,
        message: "Content fetched successfully",
        data
    });
});

// Update content
const editContent = catchAsync(async (req, res) => {
    const { name, description, content } = req.body;
    const { id } = req.params;

    // Use try-catch to handle service errors (like NOT_FOUND) if we want to preserve specific error responses
    // Or let catchAsync handle it if we trust the global handler.
    // The previous implementation checked for existence manually.
    // The service throws ApiError(NOT_FOUND).
    // I will try to use the service and let standard error handling work, OR catch specifically to return the same format.
    // The previous implementation returned explicit JSON structure.

    try {
        const data = await contentService.updateContentById(id, { name, description, content });
        res.status(httpStatus.OK).send({
            success: true,
            message: "Content updated successfully",
            data
        });
    } catch (error) {
        if (error.statusCode === httpStatus.NOT_FOUND) {
            return res.status(httpStatus.NOT_FOUND).send({
                success: false,
                message: "Content not found"
            });
        }
        throw error;
    }
});

// Soft delete content
const deleteContent = catchAsync(async (req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.status(httpStatus.BAD_REQUEST).send({
            success: false,
            message: "Content ID is required"
        });
    }

    try {
        await contentService.deleteContentById(id);

        return res.status(httpStatus.OK).send({
            success: true,
            message: "Content deleted successfully"
        });
    } catch (error) {
        if (error.statusCode === httpStatus.NOT_FOUND) {
            return res.status(httpStatus.NOT_FOUND).send({
                success: false,
                message: "Content not found"
            });
        }
        throw error;
    }
});

module.exports = { createContent, getContent, getContentById, editContent, deleteContent };