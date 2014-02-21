'use strict';

var ValidationController = function ($scope, $sce, testUtils) {
	
	$scope.showTestResults = false;
	
	var afterTests = function(pResult) {
		$scope.showTestResults = true;
		$scope.testResult = $sce.trustAsHtml(pResult);
	};
	
	$scope.validate = function() {
		if ($scope.getTests != undefined) {
			testUtils.doTests($scope.getTests(), afterTests.bind(this));
		}
	};
	
	$scope.closePopup = function() {
		$scope.showTestResults = false;
	};
};

directives.directive('buttonValid', function() {
	return {
		template : '<div><div class="right-header">Validate exercise: <button class="btn" ng-click="validate()"><img src="images/valid.png"/></button></div>' + 
			'<div ng-if="showTestResults" class="test-result-popup"><img src="images/close.gif" ng-click="closePopup()" class="close-icon"/><span ng-bind-html="testResult"></span></div></div>',
		restrict : 'E',
		controller : [ '$scope', '$sce', 'TestUtils', function($scope, $sce, testUtils) {
			return new ValidationController($scope, $sce, testUtils);
		}]
	};
});

/** Test VO */
var TestVO = function(pTestName, pSetupFunction, pVerifyFunction) {
	
	/** Tests name */
	this.testName = pTestName;
	
	this.setupFunction = pSetupFunction != null ? pSetupFunction : function() {};
	
	this.verifyFunction = pVerifyFunction != null ? pVerifyFunction : function() {};
};

/** Utility functions to test DOM. */
var TestUtils = function($timeout) {
	
	/** Tests report. */
	var textResult = "";
	/** Tests errors number. */
	var nbErrors = 0;
	/** Use to bind this to asynchronous functions. */
	var self = this;
	/** Index of the current test. */
	var currentTestIndex;
	/** List of the tests currently done. */
	var tests;
	/** Function called after the tests are finished. */
	var callback;
	
	/** Add info line in current test report. */
	this.info = function(pInfo) {
		textResult += "[INFO] " + pInfo + "<br/>";
	};
	
	/** Add error line in current test report. */
	this.error = function(pError) {
		textResult += "<span style='color: red'>[ERROR] " + pError + "</span><br/>";
		nbErrors++;
	};
	
	/** Launches tests. */
	this.doTests = function(pTests, pCallback) {
		textResult = "";
		nbErrors = 0;
		currentTestIndex = -1;
		tests = pTests;
		callback = pCallback;
		this.info("Starting tests...<br/>");
		this.doNextTest();
	};
	
	this.doNextTest = function() {
		currentTestIndex++;
		if (tests) {
			if (tests.length == currentTestIndex) {
				this.finishTests();
			} else {
				var test = tests[currentTestIndex];
				if (test instanceof TestVO) {
					if (typeof(test.setupFunction) == 'function' && typeof(test.verifyFunction) == 'function') {
						self.info("Setup test: " + test.testName);
						
						var potentialPromise = test.setupFunction();
						
						var afterWaiting = function() {
							self.info("Checking test: " + test.testName);
							test.verifyFunction();
							self.info("Ending test: " + test.testName + "<br/>");
							self.doNextTest();
						};
						
						if (potentialPromise == null) {
							this.waitForAngularToUpdate().then(afterWaiting);
						} else {
							potentialPromise.then(function(result) {
								self.waitForAngularToUpdate().then(afterWaiting);
							});
						}
					} else {
						this.error("Properties setupFunction and verifyFunction have to be functions.");
					}
				}
			}
		}
	};
	
	/** Checks if all promises have been done, and finishes the tests if so. */
	this.finishTests = function() {
		self.info("Ending tests...");
		self.info("Errors: " + nbErrors);
		//console.log(textResult);
		if (typeof(callback) == 'function') {
			callback(textResult);
		}
	};
	
	this.getEltPropertyValue = function(pHtml, pPropertyNames) {
		if (pHtml != null && pPropertyNames != null) {
			var properties = pHtml.trim().substring(pHtml.indexOf(' ')).split('"');
			for (var index = 0; index < properties.length; index++) {
				var property = properties[index];
				property = property.replace("=", "").trim();
				if (pPropertyNames.indexOf(property) > -1) {
					return properties[index + 1];
				}
			}
		}
		return null;
	};
	
	this.getAngularPropertyValue = function(pHtml, pProp) {
		return this.getEltPropertyValue(pHtml, 
				[ 'ng-' + pProp, 'ng:' + pProp, 'ng_' + pProp, 'x-ng-' + pProp, 'data-ng-' + pProp ]);
	};
	
	this.changeInputModel = function(pId, pValue) {
		var input = document.getElementById(pId);
		if (input != null) {
			var ngModelValue = this.getAngularPropertyValue(input.outerHTML, 'model');
			if (ngModelValue) {
				this.changeScopesValue(ngModelValue, pValue);
			}
		}
	};
	
	this.changeScopeValue = function(pId, pKey, pValue) {
		var scope = this.getElementScope(pId);
		if (scope) {
			this.affectScopeValue(scope, pKey, pValue);
		}
	};
	
	/** Changes the value of a property of all scopes. */
	this.changeScopesValue = function(pKey, pValue) {
		var scopes = this.getScopes();
		for (var index = 0; index < scopes.length; index++) {
			this.affectScopeValue(scopes[index], pKey, pValue);
		}
	};
	
	/** Changes the value of a property of a given scope. */
	this.affectScopeValue = function(pScope, pKey, pValue) {
		var keys = pKey.split(".");
		var currentObject = pScope;
		for (var index = 0; index < keys.length; index++) {
			var key = keys[index];
			if (currentObject == undefined || currentObject == null) {
				return;
			}
			if (index == keys.length - 1) {
				currentObject[key] = pValue;
			} else {
				currentObject = currentObject[key];
			}
		}
	};
	
	/** Returns all page scopes. */
	this.getScopes = function() {
		var elements = document.getElementsByClassName('ng-scope');
		var scopes = [];
		for (var index = 0; index < elements.length; index++) {
			var element = elements[index];
			scopes.push(angular.element(element).scope());
		}
		return scopes;
	};
	
	/** Returns scope of element whose id is equals to pId. */
	this.getElementScope = function(pId) {
		var elements = document.getElementsByClassName('ng-scope');
		for (var index = 0; index < elements.length; index++) {
			var element = elements[index];
			if (element.id == pId) {
				return angular.element(element).scope();
			}
		}
		// If scope on element not found, get the global scope.
		var parentElement = document.getElementsByClassName('html-content');
		if (parentElement) {
			return angular.element(parentElement).scope();
		}
		return null;
	};
	
	/** Waits the end of the next digest cycle. */
	this.waitForAngularToUpdate = function() {
		return $timeout(function() {});
	};
	
	/** Simulates click on element with id equals to pId. */
	this.clickOnButton = function(pId) {
		var button = document.getElementById(pId);
		if (button) {
			var property = this.getAngularPropertyValue(button.outerHTML, 'click');
			var scope = this.getElementScope(pId);
			if (property && scope) {
				scope.$eval(property);
			}
		}
	};
	
	this.hasValue = function(pId, pValue) {
		var element = document.getElementById(pId);
		return element && element.value.indexOf(pValue) > -1;
	};
	
	this.hasInnerHTML = function(pId, pValue) {
		var element = document.getElementById(pId);
		return element && element.innerHTML.indexOf(pValue) > -1;
	};
	
	this.hasNotInnerHTML = function(pId, pValue) {
		var element = document.getElementById(pId);
		return element && element.innerHTML.indexOf(pValue) == -1;
	};
	
	this.expectTrue = function(pValue, pError) {
		if (!pValue) {
			this.error(pError);
		}
	};
};

directives.factory('TestUtils', [ '$timeout', function($timeout) {
	return new TestUtils($timeout);
}]);