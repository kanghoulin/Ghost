import Mixin from 'ember-metal/mixin';

export default Mixin.create({
    hideNavbar: function() {
        this.set('showNavbar', false);
    }.on('init'),
});
