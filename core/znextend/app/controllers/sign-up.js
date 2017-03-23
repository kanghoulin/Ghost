import Controller from 'ember-controller';
import injectService from 'ember-service/inject';
import {isEmberArray} from 'ember-array/utils';

import {isVersionMismatchError} from 'ghost-user/services/ajax';

export default Controller.extend({
	
	validationType: 'signup',

    submitting: false,
	ghostPaths: injectService(),
	ajax: injectService(),
	notifications: injectService(),

  actions: {
    validateAndRegister() {
	  let model = this.get('model');
      let setupProperties = ['name', 'email', 'password'];
      let data = model.getProperties(setupProperties);
	  let notifications = this.get('notifications');

      let authUrl = this.get('ghostPaths.url').api('authentication', 'register');
          this.toggleProperty('submitting');
          return this.get('ajax').post(authUrl, {
              dataType: 'json',
              data: {
                  user: [{
                      name: data.name,
                      email: data.email,
                      password: data.password
                  }]
              }
          }).then(() => {
              return this.get('session').authenticate('authenticator:oauth2', this.get('model.email'), this.get('model.password')).then(() => {

              }).catch((resp) => {
                  notifications.showAPIError(resp, {key: 'signup.complete'});
              });
          }).catch((error) => {
              this.toggleProperty('submitting');

              if (error && error.errors && isEmberArray(error.errors)) {
                  if (isVersionMismatchError(error)) {
                      notifications.showAPIError(error);
                  }
                  this.set('flowErrors', error.errors[0].message);
              } else {
                  notifications.showAPIError(error, {key: 'signup.complete'});
              }
          });
    }
  }
});
