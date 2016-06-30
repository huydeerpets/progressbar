# name: d-progress
# about: A Discourse plugin that lets you use topics to rate things
# version: 0.2
# authors: Angus McLeod

register_asset 'stylesheets/ratings-desktop.scss', :desktop
register_asset 'stylesheets/ratings-desktop.scss', :mobile
after_initialize do

  Category.register_custom_field_type('rating_enabled', :boolean)

  module ::DiscourseRatings
    class Engine < ::Rails::Engine
      engine_name "d_progress"
      isolate_namespace DiscourseRatings
    end
  end

  require_dependency "application_controller"
  class DiscourseRatings::RatingController < ::ApplicationController
    def rate
      post = Post.find(params[:id].to_i)
      post.custom_fields["rating1"] = params[:rating1].to_f #sharpness
	  post.custom_fields["rating2"] = params[:rating2].to_f #aberrations
	  post.custom_fields["rating3"] = params[:rating3].to_f #bokeh
	  post.custom_fields["rating4"] = params[:rating4].to_f #handling
	  post.custom_fields["rating5"] = params[:rating5].to_f #value
      post.custom_fields["rating_weight"] = 1
      post.save!
      calculate_topic_average(post)
    end

    def weight
      post = Post.with_deleted.find(params[:id].to_i)
      post.custom_fields["rating_weight"] = params[:weight].to_i
      post.save!
      calculate_topic_average(post)
    end

    def remove
      id = params[:id].to_i
      post = Post.find(id)
      PostCustomField.destroy_all(post_id: id, name:"rating1")
	  PostCustomField.destroy_all(post_id: id, name:"rating2")
	  PostCustomField.destroy_all(post_id: id, name:"rating3")
	  PostCustomField.destroy_all(post_id: id, name:"rating4")
	  PostCustomField.destroy_all(post_id: id, name:"rating5")
	  
      PostCustomField.destroy_all(post_id: id, name:"rating_weight")
      calculate_topic_average(post)
    end

    def calculate_topic_average(post)
      @topic_posts = Post.with_deleted.where(topic_id: post.topic_id)
      @ratings = []
	  @ratings1 = []
	  @ratings2 = []
	  @ratings3 = []
	  @ratings4 = []
	  @ratings5 = []
	  
      @topic_posts.each do |tp|
        weight = tp.custom_fields["rating_weight"]
        if tp.custom_fields["rating1"] && (weight.blank? || weight.to_i > 0)
          rating1 = tp.custom_fields["rating1"].to_i
		  @ratings1.push(rating1)
          @ratings.push(rating1)
        end
		if tp.custom_fields["rating2"] && (weight.blank? || weight.to_i > 0)
          rating2 = tp.custom_fields["rating2"].to_i
		  @ratings2.push(rating2)
          @ratings.push(rating2)
        end
		if tp.custom_fields["rating3"] && (weight.blank? || weight.to_i > 0)
          rating3 = tp.custom_fields["rating3"].to_i
		  @ratings3.push(rating3)
          @ratings.push(rating3)
        end
		if tp.custom_fields["rating4"] && (weight.blank? || weight.to_i > 0)
          rating4 = tp.custom_fields["rating4"].to_i
		  @ratings4.push(rating4)
          @ratings.push(rating4)
        end
		if tp.custom_fields["rating5"] && (weight.blank? || weight.to_i > 0)
          rating5 = tp.custom_fields["rating5"].to_i
		  @ratings5.push(rating5)
          @ratings.push(rating5)
        end
      end
      average = @ratings.empty? ? nil : @ratings.inject(:+).to_f / @ratings.length
	  average1 = @ratings1.empty? ? nil : @ratings1.inject(:+).to_f / @ratings1.length
	  average2 = @ratings2.empty? ? nil : @ratings2.inject(:+).to_f / @ratings2.length
	  average3 = @ratings2.empty? ? nil : @ratings3.inject(:+).to_f / @ratings3.length
	  average4 = @ratings2.empty? ? nil : @ratings4.inject(:+).to_f / @ratings4.length
	  average5 = @ratings2.empty? ? nil : @ratings5.inject(:+).to_f / @ratings5.length
	  
      post.topic.custom_fields["average_rating"] = average.round(1)
	  post.topic.custom_fields["average_rating1"] = average1.round(1)
	  post.topic.custom_fields["average_rating2"] = average2.round(1)
	  post.topic.custom_fields["average_rating3"] = average3.round(1)
	  post.topic.custom_fields["average_rating4"] = average4.round(1)
	  post.topic.custom_fields["average_rating5"] = average5.round(1)
      post.topic.save!
      push_updated_ratings_to_clients!(post, average)
    end

    def push_updated_ratings_to_clients!(post, average)
      channel = "/topic/#{post.topic_id}"
      msg = {
        id: post.id,
        updated_at: Time.now,
        average: average,
        type: "revised"
      }
      MessageBus.publish(channel, msg, group_ids: post.topic.secure_group_ids)
      render json: success_json
    end

    ##def update_top_topics(post)
    ##  @category_topics = Topic.where(category_id: post.topic.category_id, tags: post.topic.tags[0])
    ##  @all_place_ratings = TopicCustomField.where(topic_id: @category_topics.map(&:id), name: "average_rating").pluck('value', 'topic_id').map(&:to_i)

      ## To do: Add a bayseian estimate of a weighted rating (WR) to WR = (v ÷ (v+m)) × R + (m ÷ (v+m)) × C
      ## R = average for the topic = (Rating); v = number of votes for the topic
      ## m = minimum votes required to be listed in the top list (currently 1)
      ## C = the mean vote for all topics
      ## See further http://bit.ly/1XLPS97 and http://bit.ly/1HJGW2g
    ##end
  end

  DiscourseRatings::Engine.routes.draw do
    post "/rate" => "rating#rate"
    post "/weight" => "rating#weight"
    post "/remove" => "rating#remove"
  end

  Discourse::Application.routes.append do
    mount ::DiscourseRatings::Engine, at: "rating"
  end

  TopicView.add_post_custom_fields_whitelister do |user|
    ["rating","rating1","rating2","rating3","rating4","rating5", "rating_weight"]
  end

  TopicList.preloaded_custom_fields << "average_rating" if TopicList.respond_to? :preloaded_custom_fields
  TopicList.preloaded_custom_fields << "average_rating1" if TopicList.respond_to? :preloaded_custom_fields
  TopicList.preloaded_custom_fields << "average_rating2" if TopicList.respond_to? :preloaded_custom_fields
  TopicList.preloaded_custom_fields << "average_rating3" if TopicList.respond_to? :preloaded_custom_fields
  TopicList.preloaded_custom_fields << "average_rating4" if TopicList.respond_to? :preloaded_custom_fields
  TopicList.preloaded_custom_fields << "average_rating5" if TopicList.respond_to? :preloaded_custom_fields

  #require 'post_serializer'
  #class ::PostSerializer
#	attributes :
#  end
  
  
  
  require 'topic_view_serializer'
  class ::TopicViewSerializer
    attributes :average_rating, :average_rating1, :average_rating2, :average_rating3, :average_rating4, :average_rating5, :show_ratings, :can_rate

    def average_rating
      object.topic.custom_fields["average_rating"]
    end
	def average_rating1
      object.topic.custom_fields["average_rating1"]
    end
	def average_rating2
      object.topic.custom_fields["average_rating2"]
    end
	def average_rating3
      object.topic.custom_fields["average_rating3"]
    end
	def average_rating4
      object.topic.custom_fields["average_rating4"]
    end
	def average_rating5
      object.topic.custom_fields["average_rating5"]
    end

    def show_ratings
      topic = object.topic
      has_rating_tag = TopicCustomField.exists?(topic_id: topic.id, name: "tags", value: "rating")
      has_ratings_enabled = topic.category.respond_to?(:custom_fields) ? topic.category.custom_fields["rating_enabled"] : false
      has_rating_tag || has_ratings_enabled
    end

    def can_rate
      return false if !scope.current_user
      ## This should be replaced with a :rated? property in TopicUser - but how to do this in a plugin?
      @user_posts = object.posts.select{ |post| post.user_id === scope.current_user.id}
      rated = PostCustomField.exists?(post_id: @user_posts.map(&:id), name: "rating")
      show_ratings && !rated
    end

  end

  require 'topic_list_item_serializer'
  class ::TopicListItemSerializer
    attributes :average_rating, :average_rating1, :average_rating2,:average_rating3,:average_rating4,:average_rating5, :show_average

    def average_rating
      object.custom_fields["average_rating"]
    end
	def average_rating1
      object.custom_fields["average_rating1"]
    end
	def average_rating2
      object.custom_fields["average_rating2"]
    end
	def average_rating3
      object.custom_fields["average_rating3"]
    end
	def average_rating4
      object.custom_fields["average_rating4"]
    end
	def average_rating5
      object.custom_fields["average_rating5"]
    end

    def show_average
      return false if !average_rating
      has_rating_tag = TopicCustomField.exists?(topic_id: object.id, name: "tags", value: "rating")
      is_rating_category = CategoryCustomField.where(category_id: object.category_id, name: "rating_enabled").pluck('value')
      has_rating_tag || is_rating_category.first == "true"
    end
  end

  ## Add the new fields to the serializers
  add_to_serializer(:basic_category, :rating_enabled) {object.custom_fields["rating_enabled"]}
  add_to_serializer(:post, :rating1) {post_custom_fields["rating1"]}
  add_to_serializer(:post, :rating2) {post_custom_fields["rating2"]}
  add_to_serializer(:post, :rating3) {post_custom_fields["rating3"]}
  add_to_serializer(:post, :rating4) {post_custom_fields["rating4"]}
  add_to_serializer(:post, :rating5) {post_custom_fields["rating5"]}
end
