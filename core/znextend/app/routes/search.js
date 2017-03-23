import Ember from 'ember';
import HideNavbarMixin from '../mixins/hide-navbar';
import EmberObject from 'ember-object';

const {Route} = Ember;

export default Route.extend(HideNavbarMixin,{
	model(params) {
		return EmberObject.create({
			sq: params.q
		});
	},
	setupController(controller, model) {
		this.controllerFor('search').send('autoSearch',model.sq);
	}
});
