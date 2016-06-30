export default Ember.Component.extend({
  tagName: "input",
  disabled: Ember.computed.not('enabled'),
  attributeBindings: [ "value", "checked:checked", "disabled:disabled"],

  willInsertElement: function() {
    this.$().prop('type', 'radio')
  },

  click: function() {
    this.set("rating4", this.$().val());
  },

  checked: function() {
    return this.get("value") <= this.get("rating4")
  }.property('rating4'),

});
