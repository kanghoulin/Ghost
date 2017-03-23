/* eslint-disable camelcase */
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import {hasMany} from 'ember-data/relationships';
import computed, {equal} from 'ember-computed';
import injectService from 'ember-service/inject';

import {task} from 'ember-concurrency';
import ValidationEngine from 'ghost-user/mixins/validation-engine';

export default Model.extend(ValidationEngine, {
    validationType: 'comment',

    post_slug: attr('string'),
    user_id: attr('string'),
    user_name: attr('string'),
    user_face: attr('string'),
    comment: attr('string'),
    comment_id: attr('string'),
	suser_name: attr('string'),
	like_num: attr('number'),
    createdAtUTC: attr('moment-utc'),
    count: attr('raw'),

    ghostPaths: injectService(),
    ajax: injectService(),
    session: injectService(),
    notifications: injectService()
});
