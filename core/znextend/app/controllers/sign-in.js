/**
 * Created by waylin on 2016/12/15.
 */
import Ember from 'ember';

export default Ember.Controller.extend({
 loggingIn: false,
 flowErrors: '',
  actions: {
    validateAndAuthenticate() {
      let authStrategy = 'authenticator:oauth2';
      let model = this.get('model');
	  this.set('flowErrors', '');
	  this.toggleProperty('loggingIn');
      this.send('authenticate', authStrategy, [model.get('email'), model.get('password')]);
    }
  }
});
