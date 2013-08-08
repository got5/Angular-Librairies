//
// test/e2e/controllers/controllersSpec.js
//
describe("E2E: Testing Controllers", function() {

  beforeEach(function() {
    browser().navigateTo('/');
  });

  it('should have a working videos page controller that applies the videos to the scope', function() {
    browser().navigateTo('#/');
    expect(browser().location().path()).toBe("/404");
  });

  it('should have a working video page controller that applies the video to the scope', function() {
    browser().navigateTo('#/login');
    expect(browser().location().path()).toBe("/login");
    expect(element('#ng-view').html()).toContain('Not registered yet');
  });

});
