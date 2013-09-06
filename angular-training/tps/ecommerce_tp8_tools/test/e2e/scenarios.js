describe("E2E Tests", function() {
    beforeEach(function() {
        browser().navigateTo('/');
    });

    it('should navigate to somewhere fancy', function() {
        browser().navigateTo('/#/books');
        var limit = 5;
        input('nbFilter').enter(limit);
        expect(repeater('article.k-product').count()).toBe(limit);

    });
});