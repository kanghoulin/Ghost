import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL,
  didTransition() {
      this._super(...arguments);

      let currentRoute = this.get('container')
      .lookup(`route:${this.get('currentRouteName')}`);

      this.get('container').lookup('controller:application').set(
          'showNavbar', _.isUndefined(currentRoute.get('showNavbar'))
      );
  }
});

Router.map(function() {
  this.route('sign-in',{path:'/extend/sign-in'});
  this.route('sign-out',{path:'/extend/sign-out'});
  this.route('sign-up',{path:'/extend/sign-up'});
  this.route('blog',{path:''});
  this.route('blog-navbar',{path:'/extend/blog-navbar'});
  this.route('blog-comment',{path:'/extend/blog-comment/:pid'});
  this.route('user',{path:'/extend/user'});
  this.route('search',{path:'/extend/search/:q'});
});

export default Router;
