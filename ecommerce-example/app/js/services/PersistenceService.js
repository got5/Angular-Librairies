define(['appModule'], function(app)
{
	var PersistenceService = function() {
		
		var FIREBASE_BASE_URL = "https://ecommerce-training.firebaseio.com/";
		
		var dataRef.on('child_added', function(snapshot) {
			console.log('Added: ' + snapshot.val());
		});
		
		this.set = function(pData) {
			dataRef.set(pData);
		};
		
		this.push = function(pData) {
			dataRef.push(pData);
		};
		
		this.get = function(pUrl, pCallback) {
			var dataRef = new Firebase(FIREBASE_BASE_URL + pUrl);
			dataRef.on('value', pCallback);
		};
	};
	
	app.lazy.factory('PersistenceService', function() {
    	return new PersistenceService();
    });
});