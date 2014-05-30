describe("E2E Tests", function() {
    beforeEach(function() {
        browser().navigateTo('/');
    });

    it('should display a limited amount of products.', function() {
        browser().navigateTo('/#/books');
        var limit = 5;
        
        // Refers to the ng-model property of the input: ng-model="nbResults"
        input('nbResults').enter(limit);
        
        expect(repeater('article.k-product').count()).toBe(limit);

    });
});