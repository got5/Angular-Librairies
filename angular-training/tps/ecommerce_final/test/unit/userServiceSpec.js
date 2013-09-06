describe('UserService Unit Test', function() {
	
	var httpMock, userService;
	
	beforeEach(module('app'));
	
	// Checks if the UserService service has been registered.
	it('should contain an UserService service', 
		inject(function(UserService) {
		
		expect(UserService).not.toEqual(null);
	}));
	
	// $httpBackend is in module ngMock (angular-mock.js)
	beforeEach(inject(function($httpBackend, $http, UserService) {
		
		var users = [
		    { login: "Bob", password: "1234", lastName: "Sponge" },
		    { login: "Test", password: "test", lastName: "Nothing" }
		];
		
		
		// Fake http backend implementation for unit testing.	
		httpMock = $httpBackend;
		httpMock.when('GET', '/data/users.json').respond(users);
		
		userService = UserService;
	}));
	
	// Checks the login function.
	it('should login a user properly', inject(function(UserService) {
		
		// Creates a new request expectation for GET requests.
		httpMock.expectGET('/data/users.json');
		
		// Calls the login service function, which uses the $http.get('/data/users.json')
		userService.logUser("Bob", "1234");
		
		// Simulates the response returning from the backend.
		// Calls the success function bound to the http request.
		httpMock.flush();
		
		// Test the currentUser from the userService.
		var user = userService.getCurrentUser();
		
		expect(user.lastName).toMatch('Sponge');
		
	}));
});