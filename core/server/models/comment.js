var _              = require('lodash'),
    ghostBookshelf = require('./base'),
    events         = require('../events'),
    Comment,
    Comments;

Comment = ghostBookshelf.Model.extend({

    tableName: 'comments',

    emitChange: function emitChange(event) {
        events.emit('comment' + '.' + event, this);
    },

    onCreated: function onCreated(model) {
        model.emitChange('added');
    },

    onUpdated: function onUpdated(model) {
        model.emitChange('edited');
    },

    onDestroyed: function onDestroyed(model) {
        model.emitChange('deleted');
    },


    toJSON: function toJSON(options) {
        options = options || {};

        var attrs = ghostBookshelf.Model.prototype.toJSON.call(this, options);

        attrs.parent = attrs.parent || attrs.parent_id;
        delete attrs.parent_id;

        return attrs;
    }
}, {
    orderDefaultOptions: function orderDefaultOptions() {
        return {
			comment_id: 'ASC',
            created_at: 'DESC'
        };
    },

    /**
     * @deprecated in favour of filter
     */
    processOptions: function processOptions(options) {
		if (!options.slug) {
            return options;
        }
		options.where = {statements: []};
		options.where.statements.push({prop: 'post_slug', op: '=', value: options.slug});
        delete options.slug;
        return options;
    },

    permittedOptions: function permittedOptions(methodName) {
        var options = ghostBookshelf.Model.permittedOptions(),

            // whitelists for the `options` hash argument on methods, by method name.
            // these are the only options that can be passed to Bookshelf / Knex.
            validOptions = {
                findAll: ['columns', 'filter']
            };

        if (validOptions[methodName]) {
            options = options.concat(validOptions[methodName]);
        }

        return options;
    },
	
	/**
     * ### Find One
     *
     * We have to clone the data, because we remove values from this object.
     * This is not expected from outside!
     *
     * @extends ghostBookshelf.Model.findOne to include roles
     * **See:** [ghostBookshelf.Model.findOne](base.js.html#Find%20One)
     */
    findOne: function findOne(dataToClone, options) {
        var query,
            data = _.cloneDeep(dataToClone);

        options = options || {};
        data = this.filterData(data);

		query = this.forge(null, {context: options.context});
		query.query('where', {id: data.id});

        options = this.filterOptions(options, 'findOne');

        return query.fetch(options);
    },
	
	/**
     * ### Edit
     * @extends ghostBookshelf.Model.edit to handle returning the full object and manage _updatedAttributes
     * **See:** [ghostBookshelf.Model.edit](base.js.html#edit)
     */
    edit: function edit(data, options) {
        var self = this;
        options = options || {};
        return ghostBookshelf.Model.edit.call(this, data, options).then(function then(comment) {
            return self.findOne({status: 'all', id: options.id}, options)
                .then(function then(found) {
                    if (found) {
                        return found;
                    }
                });
        });
    },
	
	/**
     * ### Add
     * @extends ghostBookshelf.Model.add to handle returning the full object
     * **See:** [ghostBookshelf.Model.add](base.js.html#add)
     */
    /*add: function add(data, options) {
        var self = this;
        options = options || {};

        return ghostBookshelf.Model.add.call(this, data, options).then(function then(comment) {
			console.log('add ok');
            return self.findOne({id: comment.id}, options);
        });
    }*/
});

Comments = ghostBookshelf.Collection.extend({
    model: Comment
});

module.exports = {
    Comment: ghostBookshelf.model('Comment', Comment),
    Comments: ghostBookshelf.collection('Comments', Comments)
};
