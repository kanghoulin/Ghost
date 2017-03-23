import Route from 'ember-route';
import {htmlSafe} from 'ember-string';
import injectService from 'ember-service/inject';
import run from 'ember-runloop';
import {isEmberArray} from 'ember-array/utils';

import AuthConfiguration from 'ember-simple-auth/configuration';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import windowProxy from 'ghost-user/utils/window-proxy';


export default Route.extend(ApplicationRouteMixin, {

    config: injectService(),
    feature: injectService(),
    notifications: injectService(),
	
	afterModel(model, transition) {
        this._super(...arguments);

        if (this.get('session.isAuthenticated')) {
            this.set('appLoadTransition', transition);
            // return the feature loading promise so that we block until settings
            // are loaded in order for synchronous access everywhere
            return this.get('feature').fetch();
			//return true;
        }
    },
	
	sessionInvalidated() {
        let transition = this.get('appLoadTransition');

        if (transition) {
            transition.send('authorizationFailed');
        } else {
            run.scheduleOnce('routerTransitions', this, function () {
                this.send('authorizationFailed');
            });
        }
    },

    actions: {
        invalidateSession() {
            this.get('session').invalidate().catch((error) => {
                this.get('notifications').showAlert(error.message, {type: 'error', key: 'session.invalidate.failed'});
            });
        },
		authorizationFailed() {
            windowProxy.replaceLocation(AuthConfiguration.baseURL);
        }
    }
});
