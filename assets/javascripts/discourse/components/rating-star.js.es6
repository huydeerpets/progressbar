export default Ember.Component.extend({
  tagName: "div",
  disabled: Ember.computed.not('enabled'),
  attributeBindings: [ "value", "checked:checked", "disabled:disabled"],

  
  didInsertElement: function() {
     Ember.$('.lens-rating' ).append( '<span class="rating-' + Math.round(this.get("rating"))*10+ '" id="reviewsbar" style="width:'+ this.get("rating")*10+'%" max="100"><span class="exact-rating">('+this.get("rating")+')</span></span>' );
  },

});
