define(['app'], function(app)
{
	/** Home view controller */
    app.lazy.controller('HomeController', [ '$scope', '$resource', function($scope, $resource) {
		$scope.message = "Welcome in our shop!!!";
		
		var News = $resource("/news/:id");
		
		/** Gets all the news. */
		$scope.lstNews = News.query();
		
		/** Gets the news with id = 1. */
		$scope.currentNews = News.get({ id: 1 });
		
		/** Creates a new news. */
		$scope.addedNews = new News;
		
		/** Increments the number of likes of a news, and saves the changes. */
		$scope.addLike = function(news) {
			news.likes++;
			news.$save();
		};
		
		/** Deletes a news. */
		$scope.deleteNews = function(news) {
			news.$delete();
			
			$scope.lstNews = News.query();
		};
		
		/** Adds a news. */
		$scope.addNews = function() {
			$scope.addedNews.id = -1;
			$scope.addedNews.$save();
			
			// We refresh the list with the added news.
			$scope.lstNews = News.query();
		};
    }]);
});