var renderUnboundRating = function(topic) {
  var stars = ''
  for (var i = 0; i < 10; i++) {
    var value = i + 1,
        checked = value <= topic.average_rating ? 'checked' : '',
        disabled = disabled ? 'disabled' : '',
        star = '<input type="radio" value="' + value + '" ' + checked + ' disabled><i></i>';
    stars = stars.concat(star)
  }
  //return '<span id="'+ topic.id + '" class="rating">' + stars + '</span>';
  return '<div id="' + 'jRate' + topic.id + '" style="height:50px;width: 200px;"></div>';
};

export default renderUnboundRating;
