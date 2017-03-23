/**
 * Created by waylin on 2016/12/15.
 */
import Ember from 'ember';
import computed from 'ember-computed';
import injectService from 'ember-service/inject';
import EmberObject from 'ember-object';

export default Ember.Controller.extend({
	
	session: injectService(),
	reply_id: "",
	is_reply: false,
	comment: computed('model','is_reply',function(){
		let comment_total = 0,
			like_total = 0,
			model_comments = {},
			post_comments = [];

		this.get('model').comments.content.forEach((comment) => {
			let comment_data = comment._data;
			comment_data.id = comment.id;
			
			if(this.get("reply_id") != "" && comment_data.id == this.get("reply_id")){
				comment_data.reply = comment_data.reply? false : true;
				this.set("reply_id","");
			}else{
				comment_data.reply = false;
			}
			
			if(comment_data.suser_name.length > 0){
				comment_data.is_sreply = true;
			}else{
				comment_data.is_sreply = false;
			}

			if(comment_data.like_num > 0){
				comment_data.is_like = true;
			}else{
				comment_data.is_like = false;
			}

            if(comment_data.comment_id.length > 0){
				if(model_comments[comment_data.comment_id]){
					model_comments[comment_data.comment_id].sub_comments.push(EmberObject.create(comment_data));
					model_comments[comment_data.comment_id].sub_length ++;
				}else{
					model_comments[comment_data.comment_id] = {id:comment_data.comment_id,sub_comments:[EmberObject.create(comment_data)],sub_length:1};
				}
			}else{
				if(model_comments[comment_data.id]){
					for(let key in comment_data){
						model_comments[comment_data.id][key] = comment_data[key];
					}
				}else{
					model_comments[comment_data.id] = EmberObject.create(comment_data);
					model_comments[comment_data.id].sub_comments = [];
					model_comments[comment_data.id].sub_length = 0;
				}
			}
			comment_total ++;
			like_total += comment_data.like_num;
        });

		for(let key in model_comments){
			post_comments.push(EmberObject.create(model_comments[key]));
		}
		
		return {like_total:like_total,comment_total:comment_total,comments:post_comments};
	}),
	
	reComment(){
		this.store.query('comment', {slug: this.get('model.pid')}).then((records) => {
			let data = EmberObject.create({
				pid: this.get('model.pid'),
				comment: '',
				sub_comment: '',
				comments: records
			});
			this.set('model',data);
		});
	},
	
	actions: {
		reply(comment_id) {
			if(this.get('session.isAuthenticated')){
				this.set("reply_id",comment_id);
				this.toggleProperty('is_reply');
			}else{
				alert('请先登录');
			}
		},
		like(comment_id){
			let self = this;
			if(this.get('session.isAuthenticated')){
				this.get('store').findRecord('user', 'me').then((user) => {
					this.get('store').findRecord('comment', comment_id).then(function(comment) {
                        comment.set('like_num', comment.data.like_num+1);
                        comment.save().then((editcomment)=>{
							//self.reComment();
							self.get('store').query('comment', {slug: self.get('model.pid')}).then((records) => {
								let data = EmberObject.create({
									pid: self.get('model.pid'),
									comment: '',
									sub_comment: '',
									comments: records
								});
								self.set('model',data);
							});
						}).catch((error)=>{
							console.log('comment like error');
							console.log(error);
							alert('点赞失败');
						});
                    });
				});
			}else{
				alert('请先登录');
			}
		},
        saveComment(comment_id,user_name) {
			if(this.get('session.isAuthenticated')){
				this.get('store').findRecord('user', 'me').then((user) => {
					let comments = this.store.createRecord('comment',{
						post_slug: this.get('model.pid'),
						user_id: user.id,
						user_name: user.data.name,
						user_face: '',
						comment_id: comment_id,
						suser_name: user_name,
						comment: comment_id.length > 0 ? this.get('model.sub_comment') : this.get('model.comment'),
						like_num: 0
					});
					comments.save().then((savecomment)=>{
						this.get('store').query('comment', {slug: this.get('model.pid')}).then((records) => {
							let data = EmberObject.create({
								pid: this.get('model.pid'),
								comment: '',
								sub_comment: '',
								comments: records
							});
							this.set('model',data);
						});
					}).catch((error)=>{
						console.log('comments save error');
						console.log(error);
						alert('评论提交失败');
					});
				});
			}else{
				alert('请先登录');
			}
        }
    }
});
