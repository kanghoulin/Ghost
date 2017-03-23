var _      = require('lodash'),
    api    = require('../../../api'),
    utils  = require('../../../utils'),
    BaseMapGenerator = require('./base-generator');

// A class responsible for generating a sitemap from posts and keeping it updated
function CommentsMapGenerator(opts) {
    _.extend(this, opts);

    BaseMapGenerator.apply(this, arguments);
}

// Inherit from the base generator class
_.extend(CommentsMapGenerator.prototype, BaseMapGenerator.prototype);

_.extend(CommentsMapGenerator.prototype, {
    bindEvents: function () {
        var self = this;
        this.dataEvents.on('comment.added', self.addOrUpdateUrl.bind(self));
        this.dataEvents.on('comment.edited', self.addOrUpdateUrl.bind(self));
        this.dataEvents.on('comment.deleted', self.removeUrl.bind(self));
    },

    getData: function () {
        return api.comments.browse({
            context: {
                internal: true
            },
            filter: 'visibility:public',
            limit: 'all'
        }).then(function (resp) {
            return resp.comments;
        });
    },

    validateDatum: function (datum) {
        return datum.visibility === 'public';
    },

    getUrlForDatum: function (comment) {
        return utils.url.urlFor('comment', {comment: comment}, true);
    },

    getPriorityForDatum: function () {
        // TODO: We could influence this with meta information
        return 0.6;
    }
});

module.exports = CommentsMapGenerator;
