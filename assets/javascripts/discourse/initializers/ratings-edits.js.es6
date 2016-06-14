import Topic from 'discourse/models/topic';
import TopicController from 'discourse/controllers/topic';
import TopicRoute from 'discourse/routes/topic';
import TopicListItem from 'discourse/components/topic-list-item';
import { default as computed, on, observes } from 'ember-addons/ember-computed-decorators';
import ComposerController from 'discourse/controllers/composer';
import ComposerView from 'discourse/views/composer';
import Composer from 'discourse/models/composer';
import Post from 'discourse/models/post';
import { registerUnbound } from 'discourse/lib/helpers';
import renderUnboundRating from 'discourse/plugins/discourse-ratings/lib/render-rating';
import { popupAjaxError } from 'discourse/lib/ajax-error';
import { withPluginApi } from 'discourse/lib/plugin-api';

export default {
  name: 'ratings-edits',
  initialize(){

    withPluginApi('0.1', api => {
      api.includePostAttributes('rating')
      api.decorateWidget('poster-name:after', function(helper) {
        var rating = helper.attrs.rating,
            showRating = helper.getModel().topic.show_ratings;
        if (showRating && rating) {
		
          var html = new Handlebars.SafeString(renderUnboundRating(helper.getModel().topic))
          return helper.rawHtml(`${html}`)
        }
      })
    });
// $( document ).ready(function() {
   // $("#jRate49").jRate();
// });
    TopicController.reopen({
      refreshAfterTopicEdit: false,

      subscribeToRatingUpdates: function() {
        var model = this.get('model')
        if (model.show_ratings && model.get('postStream.loaded')) {
          this.messageBus.subscribe("/topic/" + model.id, function(data) {
            if (data.type === 'revised' && data.average !== undefined) {
              model.set('average_rating', data.average)
            }
          })
        }
      }.observes('model.postStream.loaded'),
	
      showRating: function() {
        if (this.get('model.average_rating') < 1) {return false}
        if (!this.get('editingTopic')) {return this.get('model.show_ratings')}
        var category = this.site.categories.findProperty('id', this.get('buffered.category_id')),
            tags = this.get('buffered.tags'),
            ratingsVisible = Boolean((category && category.rating_enabled) || (tags && tags.indexOf('rating') > -1));
        if (ratingsVisible !== this.get('buffered.show_ratings')) {
          this.set('refreshAfterTopicEdit', true)
        }
        return ratingsVisible
      }.property('model.average_rating', 'model.show_ratings', 'buffered.category_id', 'buffered.tags'),

      refreshTopic: function() {
        if (!this.get('editingTopic') && this.get('refreshAfterTopicEdit')) {
          this.send('refreshTopic')
          this.set('refreshAfterTopicEdit', false)
        }
      }.observes('editingTopic'),

      toggleCanRate: function() {
        if (this.get('model')) {
          this.toggleProperty('model.can_rate')
        }
      }

    })

    TopicRoute.reopen({
      actions: {
        refreshTopic: function() {
          this.refresh();
        }
      }
    })
	
    TopicListItem.reopen({
   
       @on('didInsertElement')
       _setupDOM() {
       
            // this._rearrangeDOM()
        var topic = this.get('topic')
		this.$('#jRate'+topic.id).jRate({
				rating:topic.average_rating,
				//onChange: function(rating){
				//	$('#jRate'+topic.id).text(rating);
				//}, 
				min:0,
				max:10,
				width: 23,
				height: 23,
				precision: 1,
				count: 10,
				minSelected:1,
				readOnly:true
				
			})
        //this.$('.main-link').children().not('.topic-thumbnail').wrapAll("<div class='topic-details' />")
        //this.$('.topic-details').children('.topic-statuses, .title, .topic-post-badges').wrapAll("<div class='topic-title'/>")
        //this.$('.topic-thumbnail').prependTo(this.$('.main-link')[0])
		
		
       }

	  
	  // /*
	  
	  // <script type="text/javascript">$(document).ready(function() {$("#jRate' + topic.id + '").jRate({rating: '+ topic.average_rating + ',width: 80,height: 80,precision: 0.1,minSelected:1});});</script>
	  // */
      // _rearrangeDOM() {
	  // var topic = this.get('topic'),
		// this.$('#jRate' + topic.id + ').jRate({rating: '+ topic.average_rating + ',width: 80,height: 80,precision: 0.1,minSelected:1}')
        // this.$('.main-link').children().not('.topic-thumbnail').wrapAll("<div class='topic-details' />")
        // this.$('.topic-details').children('.topic-statuses, .title, .topic-post-badges').wrapAll("<div class='topic-title'/>")
        // this.$('.topic-thumbnail').prependTo(this.$('.main-link')[0])

       
      // }

     
    })
    Post.reopen({
	@on('didInsertElement')
       _setupDOM() {
       
            // this._rearrangeDOM()
        var id = this.get('id')
		this.$('#jRate'+id).jRate({
				rating:12,
				//onChange: function(rating){
				//	$('#jRate'+topic.id).text(rating);
				//}, 
				min:0,
				max:10,
				width: 23,
				height: 23,
				precision: 1,
				count: 10,
				minSelected:1,
				readOnly:true
				
			})
        //this.$('.main-link').children().not('.topic-thumbnail').wrapAll("<div class='topic-details' />")
        //this.$('.topic-details').children('.topic-statuses, .title, .topic-post-badges').wrapAll("<div class='topic-title'/>")
        //this.$('.topic-thumbnail').prependTo(this.$('.main-link')[0])
		
		
       },
      setRatingWeight: function() {
        if (!this.get('topic.show_ratings')) {return}
        var id = this.get('id'),
            weight = this.get('deleted') ? 0 : 1;
        Discourse.ajax("/rating/weight", {
          type: 'POST',
          data: {
            id: id,
            weight: weight
          }
        }).catch(function (error) {
          popupAjaxError(error);
        });
      }.observes('deleted')
    
	
	})

    ComposerController.reopen({
      rating: null,
      refreshAfterPost: false,
      includeRating: true,

      actions: {

        // overrides controller methods
        save() {
          var show = this.get('showRating');
          if (show && this.get('includeRating') && !this.get('rating')) {
            return bootbox.alert(I18n.t("composer.select_rating"))
          }
          var model = this.get('model'),
              topic = model.get('topic'),
              post = model.get('post');
          if (topic && post && post.get('firstPost') &&
              (model.get('action') === Composer.EDIT) && (topic.show_ratings !== show)) {
            this.set('refreshAfterPost', true)
          }
          this.save()
        }

      },

      // overrides controller methods
      close() {
        this.setProperties({ model: null, lastValidatedAt: null, rating: null });
        if (this.get('refreshAfterPost')) {
          this.send("refreshTopic")
          this.set('refreshAfterPost', false)
        }
      },

      onOpenSetup: function() {
        if (this.get('model.composeState') === Composer.OPEN) {
          this.set('includeRating', true)
        }
      }.on('willInsertElement').observes('model.composeState'),

      showRating: function() {
        var model = this.get('model')
        if (!model) {return false}
        var topic = model.get('topic'),
            post = model.get('post'),
            firstPost = Boolean(post && post.get('firstPost'));
        if ((firstPost && topic.can_rate) || !topic) {
          var category = this.site.categories.findProperty('id', model.get('categoryId')),
              tags = model.tags || (topic && topic.tags);
          return Boolean((category && category.rating_enabled) || (tags && tags.indexOf('rating') > -1));
        }
        if (topic.can_rate) {return true}
        return Boolean(topic.show_ratings && post && post.rating && (model.get('action') === Composer.EDIT))
      }.property('model.topic', 'model.categoryId', 'model.tags', 'model.post'),

      setRating: function() {
        var model = this.get('model')
        if (!model || this.get('model.action') !== Composer.EDIT) {return null}
        var post = model.get('post')
        if (post && !this.get('rating') && this.get('showRating')) {
          this.set('rating', post.rating)
        }
      }.observes('model.post', 'showRating'),

      saveRatingAfterCreating: function() {
        if (!this.get('showRating') ||
            !this.get('includeRating')) {return}
        var post = this.get('model.createdPost')
        if (!post) {return}
        this.saveRating(post, this.get('rating'))
        this.get('controllers.topic').toggleCanRate()
      }.observes('model.createdPost'),

      saveRatingAfterEditing: function() {
        if (!this.get('showRating')
            || this.get('model.action') !== Composer.EDIT
            || this.get('model.composeState') !== Composer.CLOSED) {return}
        var post = this.get('model.post')
        if (!post) {return}
        var rating = this.get('rating');
        if (rating && !this.get('includeRating')) {
          this.removeRating(post)
          this.get('controllers.topic').toggleCanRate()
        } else {
          this.saveRating(post, rating)
        }
      }.observes('model.composeState'),

      removeRating: function(post) {
        Discourse.ajax("/rating/remove", {
          type: 'POST',
          data: {
            id: post.id,
          }
        }).catch(function (error) {
          popupAjaxError(error);
        });
      },

      saveRating: function(post, rating) {
        post.set('rating', rating)
        Discourse.ajax("/rating/rate", {
          type: 'POST',
          data: {
            id: post.id,
            rating: rating
          }
        }).catch(function (error) {
          popupAjaxError(error);
        });
      }

    })

    ComposerView.reopen({
      resizeIfShowRating: function() {
        if (this.get('composeState') === Composer.OPEN) {
          this.resize()
        }
      }.observes('controller.showRating')
    })
	function renderUnboundRating2(topic) {
		//$('.spoiler', $elem).removeClass('spoiler').addClass('spoiled').spoil();
		//var stars = ''
		//for (var i = 0; i < 5; i++) {
		//	var value = i + 1,
			//checked = value <= topic.average_rating ? 'checked' : '',
			//disabled = disabled ? 'disabled' : '',
			//star = '<input type="radio" value="' + value + '" ' + checked + ' disabled><i></i>';
			//stars = stars.concat(star)
		//}
  //return '<span id="'+ topic.id + '" class="rating">' + stars + '</span>';
		return '<script type="text/javascript">$(document).ready(function() {$("#jRate' + topic.id + '").jRate({rating: '+ topic.average_rating + ',width: 80,height: 80,precision: 0.1,minSelected:1});});</script><div id="' + 'jRate' + topic.id + '" style="height:50px;width: 200px;"></div>';
	}
    registerUnbound('rating-unbound', function(topic) {
	
      return new Handlebars.SafeString(renderUnboundRating(topic));
    });

  }
}
