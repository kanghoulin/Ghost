import EmbeddedRelationAdapter from 'ghost-user/adapters/embedded-relation-adapter';

export default EmbeddedRelationAdapter.extend({

    shouldBackgroundReloadRecord() {
        return false;
    }

});
