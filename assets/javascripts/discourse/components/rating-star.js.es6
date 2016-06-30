export default Ember.Component.extend({
  tagName: "div",
  disabled: Ember.computed.not('enabled'),
  attributeBindings: [ "value", "checked:checked", "disabled:disabled"],

  
  didInsertElement: function() {
     Ember.$('.camera-lens-rating' ).append( '<span class="rating-' + Math.round(this.get("rating"))*10+ '" id="reviewsbar" style="box-shadow:0 0 5px 0 #222 inset;width:'+ this.get("rating")*10+'%" max="100"><span class="exact-rating">('+this.get("rating")+')</span></span>' );
	 
	 Ember.$('.camera-lens-rating1').replaceWith('<div style="width: 200px; height: 19px; position: relative; background-color: rgb(204, 204, 204); color: rgb(0, 0, 0); "><div style="position: relative; float:left;padding-left: 3px;">Sharpness</div><div style="position: relative; float: right; padding-right: 3px;">'+this.get("rating1")+'</div></div>');
	 
	 Ember.$('.camera-lens-rating2').replaceWith('<div style="width: 200px; height: 19px; position: relative; background-color: rgb(204, 204, 204); color: rgb(0, 0, 0); "><div style="position: relative; float:left;padding-left: 3px;">Aberrations</div><div style="position: relative; float: right; padding-right: 3px;">'+this.get("rating2")+'</div></div>');
	 
	 Ember.$('.camera-lens-rating3').replaceWith('<div style="width: 200px; height: 19px; position: relative; background-color: rgb(204, 204, 204); color: rgb(0, 0, 0); "><div style="position: relative; float:left;padding-left: 3px;">Bokeh</div><div style="position: relative; float: right; padding-right: 3px;">'+this.get("rating3")+'</div></div>');
	 
	 Ember.$('.camera-lens-rating4').replaceWith('<div style="width: 200px; height: 19px; position: relative; background-color: rgb(204, 204, 204); color: rgb(0, 0, 0); "><div style="position: relative; float:left;padding-left: 3px;">Handling</div><div style="position: relative; float: right; padding-right: 3px;">'+this.get("rating4")+'</div></div>');
	 
	 Ember.$('.camera-lens-rating5').replaceWith('<div style="width: 200px; height: 19px; position: relative; background-color: rgb(204, 204, 204); color: rgb(0, 0, 0); "><div style="position: relative; float:left;padding-left: 3px;">Value</div><div style="position: relative; float: right; padding-right: 3px;">'+this.get("rating5")+'</div></div>');
	
  },

});
