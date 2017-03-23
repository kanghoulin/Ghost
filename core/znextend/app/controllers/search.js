/**
 * Created by waylin on 2016/12/15.
 */
import Ember from 'ember';
import RSVP from 'rsvp';
import injectService from 'ember-service/inject';
import computed from 'ember-computed';
import run from 'ember-runloop';
import {isBlank, isEmpty} from 'ember-utils';

export function computedGroup(category) {
    return computed('content', 'currentSearch', function () {
        if (!this.get('currentSearch') || !this.get('content')) {
            return [];
        }

        return this.get('content').filter((item) => {
            let search = new RegExp(this.get('currentSearch'), 'ig');

            return (item.category === category) && item.title.match(search);
        });
    });
}

function removeHTMLTag(str) {
            str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
            str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
            //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
            str=str.replace(/ /ig,'');//去掉 
            return str;
    }

export default Ember.Controller.extend({
	content: [],
	q_content: [],
	currentSearch: '',
	
	postTotal: 0,
	posts: computedGroup('Posts'),

	_store: injectService('store'),
	ajax: injectService(),
	notifications: injectService(),
	session: injectService(),
	
	islogin: computed(function(){
		return this.get('session.isAuthenticated');
	}),
	
	actions:{
		autoSearch(sq){
			return new RSVP.Promise((resolve, reject) => {
                run.debounce(this, this._performSearch, sq, resolve, reject, 200);
            });
		},
		search(){
			let model = this.get('model');

			return new RSVP.Promise((resolve, reject) => {
                run.debounce(this, this._performSearch, model.get('sq'), resolve, reject, 200);
            });
		}
	},
	refreshContent() {
        let promises = [];
		this.set('q_content', []);
        promises.pushObject(this._loadPosts());

        return RSVP.all(promises).then(() => { }).finally(() => {
			this.set('content', this.get('q_content'));
        });
    },
	groupedContent: computed('posts', function () {
        let groups = [];
		this.set('postTotal',0);

        if (!isEmpty(this.get('posts'))) {
            groups.pushObject({groupName: 'Posts', options: this.get('posts')});
			this.set('postTotal',this.get('posts').length);
        }

        return groups;
    }),
	_loadPosts() {
        let store = this.get('_store');
        let postsUrl = `${store.adapterFor('post').urlForQuery({}, 'post')}/`;
        let postsQuery = {fields: 'id,title,slug,html,page,author_id,author,create_at', limit: 'all', status: 'all', staticPages: 'all'};
        let q_content = this.get('q_content');
		
        return this.get('ajax').request(postsUrl, {data: postsQuery}).then((posts) => {
            q_content.pushObjects(posts.posts.map((post) => {
                return {
                    id: `post.${post.id}`,
                    title: post.title,
					slug: post.slug,
					html: removeHTMLTag(post.html.substring(0,100)),
                    category: post.page ? 'Pages' : 'Posts',
					author_id: post.author_id,
					author: post.author.name,
					created_at: post.created_at
					
                };
            }));
        }).catch((error) => {
            this.get('notifications').showAPIError(error, {key: 'search.loadPosts.error'});
        });
    },
	_performSearch(term, resolve, reject) {
        if (isBlank(term)) {
            return resolve([]);
        }

        this.refreshContent().then(() => {
			this.set('currentSearch', term);
			this.set('model.sq', term);
            return resolve(this.get('groupedContent'));
        }).catch(reject);
    },
});
