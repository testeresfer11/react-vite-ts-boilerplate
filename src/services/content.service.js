const httpStatus = require('http-status');
const { Content } = require('../models/content.model');
const { paginate } = require('./admin.service');
const ApiError = require('../utils/ApiError');

/**
 * Create a content
 * @param {Object} contentBody
 * @returns {Promise<Content>}
 */
const createContent = async (contentBody) => {
    return Content.create(contentBody);
};

/**
 * Query for contents
 * @param {Object} filter - Mongo filter
 * @param {number} [page] - Current page (default = 1)
 * @param {number} [limit] - Maximum number of results per page (default = 10)
 * @returns {Promise<Object>}
 */
const queryContents = async (filter, page, limit) => {
    return paginate(Content, filter, page, limit);
};

/**
 * Get content by id
 * @param {ObjectId} id
 * @returns {Promise<Content>}
 */
const getContentById = async (id) => {
    return Content.findOne({ _id: id, isDeleted: false });
};

/**
 * Update content by id
 * @param {ObjectId} contentId
 * @param {Object} updateBody
 * @returns {Promise<Content>}
 */
const updateContentById = async (contentId, updateBody) => {
    const content = await getContentById(contentId);
    if (!content) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Content not found');
    }

    Object.assign(content, updateBody);
    await content.save();
    return content;
};

/**
 * Delete content by id
 * @param {ObjectId} contentId
 * @returns {Promise<Content>}
 */
const deleteContentById = async (contentId) => {
    const content = await getContentById(contentId);
    if (!content) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Content not found');
    }

    content.isDeleted = true;
    await content.save();
    return content;
};

module.exports = {
    createContent,
    queryContents,
    getContentById,
    updateContentById,
    deleteContentById,
};
