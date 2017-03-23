// # Posts API
// RESTful API for the Post resource
var Promise         = require('bluebird'),
    _               = require('lodash'),
    dataProvider    = require('../models'),
    errors          = require('../errors'),
    utils           = require('./utils'),
    pipeline        = require('../utils/pipeline'),
    i18n            = require('../i18n'),

    docName         = 'comments',
    allowedIncludes = [
        'created_by', 'updated_by', 'published_by', 'author', 'tags', 'fields',
        'next', 'previous', 'next.author', 'next.tags', 'previous.author', 'previous.tags' 
    ],
    comments;

/**
 * ### Comments API Methods
 *
 * **See:** [API Methods](index.js.html#api%20methods)
 */

comments = {

    /**
     * ## Browse
     * Find All comments, by Slug
     *
     * @public
     * @param {Object} options
     * @return Comment Collection
     */
    browse: function read(options) {
        var tasks;

        /**
         * ### Model Query
         * Make the call to the Model layer
         * @param {Object} options
         * @returns {Object} options
         */
        function modelQuery(options) {
            return dataProvider.Comment.findWhere(options);
        }

        // Push all of our tasks into a `tasks` array in the correct order
        tasks = [
            modelQuery
        ];

        // Pipeline calls each task passing the result of one to be the arguments for the next
        return pipeline(tasks, options).then(function formatResponse(result) {
            // @TODO make this a formatResponse task?
            if (result) {
                return result;
            }

            return Promise.reject(new errors.NotFoundError({message: i18n.t('errors.api.comments.commentNotFound')}));
        });
    },
	
	/**
     * ## Read
     * @param {{id, context}} options
     * @returns {Promise<Users>} User
     */
    read: function read(options) {
        var tasks;

        /**
         * ### Model Query
         * Make the call to the Model layer
         * @param {Object} options
         * @returns {Object} options
         */
        function doQuery(options) {
            return dataProvider.Comment.findOne(options.data, _.omit(options, ['data']));
        }

        // Push all of our tasks into a `tasks` array in the correct order
        tasks = [
            doQuery
        ];

        // Pipeline calls each task passing the result of one to be the arguments for the next
        return pipeline(tasks, options).then(function formatResponse(result) {
            if (result) {
				console.log(result.toJSON(options));
                return {Comments: [result.toJSON(options)]};
            }

            return Promise.reject(new errors.NotFoundError({message: i18n.t('errors.api.comments.userNotFound')}));
        });
    },
	
	/**
     * ## Edit
     * ## Edit
     * Update properties of a post
     *
     * @public
     * @param {Post} object Post or specific properties to update
     * @param {{id (required), context, include,...}} options
     * @return {Promise(Post)} Edited Post
     */
    edit: function edit(object, options) {
        var tasks;

        /**
         * ### Model Query
         * Make the call to the Model layer
         * @param {Object} options
         * @returns {Object} options
         */
        function modelQuery(options) {
            return dataProvider.Comment.edit(options.comments[0], {id:options.comments[0].id});
        }

        // Push all of our tasks into a `tasks` array in the correct order
        tasks = [
            modelQuery
        ];

        // Pipeline calls each task passing the result of one to be the arguments for the next
        return pipeline(tasks, object, options).then(function formatResponse(result) {
            if (result) {
                var comment = result.toJSON(options);

				return {Comments: [comment]};
            }

            return Promise.reject(new errors.NotFoundError({message: i18n.t('errors.api.comments.postNotFound')}));
        });
    },
	
	/**
     * ## Add
     * Create a new comment
     *
     * @public
     * @param {Post} object
     * @param {{context, include,...}} options
     * @return {Promise(Post)} Created Post
     */
    add: function add(object, options) {
        var tasks;

        /**
         * ### Model Query
         * Make the call to the Model layer
         * @param {Object} options
         * @returns {Object} options
         */
        function modelQuery(options) {
            return dataProvider.Comment.add(options.comments[0], _.omit(options, ['data']));
        }

        // Push all of our tasks into a `tasks` array in the correct order
        tasks = [
            modelQuery
        ];

        // Pipeline calls each task passing the result of one to be the arguments for the next
        return pipeline(tasks, object, options).then(function formatResponse(result) {
            var comment = result.toJSON(options);

            return {comments: [comment]};
        });
    }
};

module.exports = comments;
