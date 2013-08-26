define(['app'], function(app) 
{
	/** Products utility service */
	var ProductUtils = function() {
	
		/** Returns rating for a given product. */
		var getProductRating = function(pItem) {
			if (pItem.comments) {
				var sumRatings = 0;
				for ( var index = 0; index < pItem.comments.length; index++) {
					var comment = pItem.comments[index];
					sumRatings += comment.rate;
				}
				return Math.floor(sumRatings / pItem.comments.length);
			}
			return 0;
		};
	
		/** Returns the CSS class for the average rating of a given product. */
		this.getRatingCss = function(pItem) {
			var cssClass = {
				rating : true
			};
			if (pItem != undefined) {
				switch (getProductRating(pItem)) {
				case 5:
					cssClass.five = true;
					break;
				case 4:
					cssClass.four = true;
					break;
				case 3:
					cssClass.three = true;
					break;
				case 2:
					cssClass.two = true;
					break;
				case 1:
					cssClass.one = true;
					break;
				case 0:
					cssClass.zero = true;
					break;
				default:
					break;
				}
			}
			return cssClass;
		};
	};
	
	app.lazy.value('ProductUtils', new ProductUtils());
});