import Route from 'ember-route';

export default Route.extend( {
  beforeModel() {
        window.location.reload();
    }
});
