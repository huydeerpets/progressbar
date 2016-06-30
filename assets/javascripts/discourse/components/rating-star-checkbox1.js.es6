export default Ember.Component.extend({
  tagName: "input",
  disabled: Ember.computed.not('enabled'),
  attributeBindings: [ "value", "checked:checked", "disabled:disabled"],

  willInsertElement: function() {
    this.$().prop('type', 'radio')
  },

  click: function() {
    this.set("rating1", this.$().val());
  },

  checked: function() {
    return this.get("value") <= this.get("rating1")
  }.property('rating1'),

});
