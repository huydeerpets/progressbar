export default Ember.Component.extend({
  tagName: "input",
  disabled: Ember.computed.not('enabled'),
  attributeBindings: [ "value", "checked:checked", "disabled:disabled"],

  willInsertElement: function() {
    this.$().prop('type', 'radio')
  },

  click: function() {
    this.set("rating3", this.$().val());
  },

  checked: function() {
    return this.get("value") <= this.get("rating3")
  }.property('rating3'),

});
