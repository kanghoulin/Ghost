/**
 * Created by waylin on 2016/12/15.
 */
import Ember from 'ember';
import computed from 'ember-computed';
import injectService from 'ember-service/inject';

export default Ember.Controller.extend({
	session: injectService(),
	islogin: computed(function(){
		return this.get('session.isAuthenticated');
	})
});
