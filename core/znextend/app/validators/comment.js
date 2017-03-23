import BaseValidator from './base';

export default BaseValidator.extend({
    properties: ['post_slug','comment'],

	post_slug(model) {
        let post_slug = model.get('post_slug');

        if (!validator.isLength(post_slug, 0, 150)) {
            model.get('errors').add('post_slug', 'Comment is too long');
            this.invalidate();
        }
    },
    comment(model) {
        let comment = model.get('comment');

        if (!validator.isLength(comment, 0, 150)) {
            model.get('errors').add('comment', 'Comment is too long');
            this.invalidate();
        }
    }
});
