import Ember from 'ember';
import HideNavbarMixin from '../mixins/hide-navbar';
import EmberObject from 'ember-object';

const {Route} = Ember;

export default Route.extend(HideNavbarMixin,{
	model(params){
		let query = {
            slug: params.pid
        };
		return this.store.query('comment', query).then((records) => {
            return EmberObject.create({
				pid: params.pid,
				comment: '',
				sub_comment: '',
				comments: records
			});
        });
	}
});
