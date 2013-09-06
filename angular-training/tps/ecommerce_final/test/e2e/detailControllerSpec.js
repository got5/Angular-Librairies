describe("DetailCtrl e2e Tests", function() {
	beforeEach(function() {
		browser().navigateTo('/');
	});
	
	it('should have a functionnal product detail page.', function() {
		
		browser().navigateTo('#/book/2');
		
		// Test URL path.
		expect(browser().location().path()).toBe("/book/2");
		
		// Use pause() to suspend the test execution.
		//pause();
		
		// Waits 3 seconds.
		sleep(2);
		
		// Test the binding done to $scope.product.name
		expect(binding('product.name')).toBe('Angularjs in Action');
		
		// Test the text content of the html block where id = productName.
		expect(element('#productName').text()).toMatch('Angularjs in Action');
		
		// Change quantity
		input("quantity").enter(2);
		
		expect(element('.price').text()).toContain('69.02');
		
		// Click on the add to basket button.
		//element('#btnBasket').click();
		
		// Checks the product image url.
		expect(element('.photo').attr('src')).toContain('img/catalog/2.jpg');
	});
});

