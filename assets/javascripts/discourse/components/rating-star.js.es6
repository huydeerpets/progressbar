export default Ember.Component.extend({
  tagName: "div",
  disabled: Ember.computed.not('enabled'),
  attributeBindings: [ "value", "checked:checked", "disabled:disabled"],

  
  didInsertElement: function() {
     Ember.$('.review-rating' ).append( '<progress class="reviews-' + Math.round(this.get("rating"))*10+ '" id="reviewsbar" value="'+ this.get("rating")*10+'" max="100"></progress>' );
  },

});
