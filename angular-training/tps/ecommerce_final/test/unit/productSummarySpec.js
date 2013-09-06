describe('productSummary directive unit test', function() {
	var elem, scope;

	// Load the directive.
	beforeEach(module('app'));
	
	// Load the directive template.
	beforeEach(module('templates/partials/productSummary.html'));
  
	// Done before each test. Creates the tested DOM.
	beforeEach(inject(function($rootScope, $compile) {
		
		// Create a html snippet which uses the directive to test.
		elem = angular.element('<product-summary></products-summary>');

		scope = $rootScope;
		
		// Set a product property in the scope attached to the tested directive.
		scope.product = { name: "AngularJS" };
		
		// Compile the HTML snippet.
		$compile(elem)(scope);
		scope.$digest();
	}));
	
	it('should display the product title', inject(function($compile, $rootScope) {
		// Class selector works because jquery is loaded.
		expect(elem.find('h3.name a').text()).toMatch('AngularJS');
	}));
});

