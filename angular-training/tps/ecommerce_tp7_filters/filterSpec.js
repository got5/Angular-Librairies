describe('Filters Unit Tests', function() {

	// Loads app module before each test.
	beforeEach(angular.mock.module('app'));


	describe('StartFrom Filter Unit Tests', function() {
		
		it('should have a startFrom filter', inject(function($filter) {
			expect($filter('startFrom')).not.toEqual(null);
		}));
		
		it('should return a sub array starting from a given index.',
			inject(function($filter) {
			
			var arrTest = [ 1, 2, 3, 4, 5, 6, 7 ];
			
			var filterResult = $filter('startFrom')(arrTest, 5);
			expect(filterResult.length).toMatch(2);
		}));
	});
});

