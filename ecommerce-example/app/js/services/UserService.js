define(['appModule', 'data/User'], function(app, user)
{
	/** User service */
	var UserService = function(http, cookies) {
		
		var USER_URL = 'data/users.json';
		
		/** Currently logged user */
		this.currentUser = null;
		
		var login = null;
		var password = null;
		
		var onGetUsers = function(pUsers) {
			for (var index = 0; index < pUsers.length; index++) {
        		var user = pUsers[index];
        		if (user.login == login && user.password == password) {
        			this.currentUser = new User(user.id, user.firstName, user.lastName, user.login, 
        					user.password, user.mail, user.cart, user.role, user.address);
        			
        			// Registers current user in cookie.
        			cookies.loginECommerce = user.login;
        			cookies.passwordECommerce = user.password;
        			return;
        		}
        	}
		};
		
		this.logUser = function(pLogin, pPassword) {
			login = pLogin;
			password = pPassword;
			return http.get(USER_URL).success(onGetUsers.bind(this));
		};
		
		this.addToCart = function(pItem, pQty) {
			if (this.currentUser) {
				this.currentUser.cart.setItemQty(pItem, pQty);
			}
		};
		
		this.getCartItems = function() {
			if (this.currentUser) {
				return this.currentUser.cart.getItems();
			}
		};
		
		this.getCartNbItems = function() {
			if (this.currentUser) {
				return this.getCartItems().length;
			}
			return 0;
		};
		
		/** Returns true if the current user is authorized to see a page with a given access. */
		this.isAuthorized = function(pRole) {
			switch (pRole) {
				case null:
					return true;
				case "user":
					return this.isLoggedIn();
				case "admin":
					return this.currentUser && this.currentUser.role == "admin";
				default:
					return false;
			};
		};
		
		this.isLoggedIn = function() {
			return this.currentUser != null;
		};
		
		this.logout = function() {
			if (this.currentUser) {
				this.currentUser = null;
				delete cookies.loginECommerce;
    			delete cookies.passwordECommerce;
			}
		};
	};
	
    app.lazy.factory('UserService', ['$http', '$cookies', function($http, $cookies) {
    	return new UserService($http, $cookies);
    }]);
});