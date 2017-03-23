import Route from 'ember-route';
import EmberObject from 'ember-object';

export default Route.extend( {
  titleToken: 'Sign Up',
  classNames: ['ghost-login'],

  model() {
    return EmberObject.create({
      email: '',
	  name: '',
      password: ''
    });
  }
});
