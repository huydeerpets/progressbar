var renderUnboundRating2 = function(rating) {
  var stars = ''
  var roundvalue = Math.round(rating)*10
    var value = rating*10,
  
		star = '<div class="lens-rating"><span class="rating-'+roundvalue +'" id="reviewsbar" style=" width:'+value +'%" max="100"><span class="exact-rating">'+rating+'/10</span></span></div>';
		//stars = stars.concat('<span itemscope itemtype="http://schema.org/Review">');
 		//stars = stars.concat('<span itemprop="itemReviewed" itemscope itemtype="http://schema.org/Thing">');
        //star = stars.concat('<span itemprop="name">Super Book</span>');
		//stars = stars.concat('</span>');
		//stars = stars.concat('<span itemprop="author" itemscope itemtype="http://schema.org/Organization">');
		//stars = stars.concat('<span itemprop="name">lensshots.com</span>');
		//stars = stars.concat(' </span>');
		//stars = stars.concat('<span itemprop="reviewRating" itemscope itemtype="http://schema.org/Rating">');
		//stars = stars.concat('rating:');
		//stars = stars.concat('<span itemprop="ratingValue">'+ rating+'</span> out of ');
		//stars = stars.concat('<span itemprop="bestRating">10</span>');
		//stars = stars.concat('</span>');
		//stars = stars.concat('<span itemprop="publisher" itemscope itemtype="http://schema.org/Organization">');
		//stars = stars.concat('<meta itemprop="name" content="LensShots.com">');
		//stars = stars.concat('</span>');
		//stars = stars.concat('</span>');
		
		stars = stars.concat(star)

	return '<span class="total-review-rating">' + stars + '</span>';
};

export default renderUnboundRating2;
