import Ember from 'ember';
import ApplicationSerializer from 'ghost-user/serializers/application';
import EmbeddedRecordsMixin from 'ember-data/serializers/embedded-records-mixin';

const {String: {pluralize}} = Ember;

export default ApplicationSerializer.extend(EmbeddedRecordsMixin, {
    attrs: {
        createdAtUTC: {key: 'created_at'}
    },
	
	serializeIntoHash(hash, type, record, options) {
        options = options || {};
        options.includeId = true;

        let root = pluralize(type.modelName);
        let data = this.serialize(record, options);

        // Properties that exist on the model but we don't want sent in the payload

        delete data.count;

        hash[root] = [data];
    }
});
