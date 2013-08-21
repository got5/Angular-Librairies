/** Suggestion popup controller. */
var SuggestController = function($scope, $timeout, element) {
	
	/** select component */
	var select = document.getElementById('suggestSelect');
	
	/** Checks if the element is located in the suggestion popup. */
	var isInPopup = function(element) {
		while (element) {
			if (element.id == "suggestPopup") {
				return true;
			}
			element = element.parentElement;
		};
		return false;
	};
	
	/** Closes the popup, registers the selected suggestion if wanted. */
	var closePopup = function(pApplySuggestion) {
		$scope.$apply(function() {
			$scope.showPopup = false;
			
			if (pApplySuggestion) {
				$scope.chosenSuggestion = $scope.selectedProperty;
			}
		});
		select.removeEventListener("keydown", keyDownHandler);
		select.removeEventListener("dblclick", dblclickHandler);
		document.removeEventListener("click", clickHandler);
	};
	
	/** Application keydown event handler. */
	var keyDownHandler = function(event) {
		if (event.keyCode == 13) { //Enter
			closePopup(true);
			event.preventDefault();
		} else if (event.keyCode == 27) { //Escape
			closePopup(false);
		} else if ((event.keyCode > 57 && event.keyCode < 91) || event.keyCode == 54) {
			// Valid editor user input while popup is visible: a-z OR -
			
			var unregister = $scope.$watch('userInput', function() {
				if ($scope.userInput == '') {
					$timeout(function() {
						select.focus();
						unregister();
					});
				}
			});
			
			var input = event.keyCode == 54 ? '-' : String.fromCharCode(event.keyCode).toLowerCase();
			$scope.$apply(function() {
				$scope.userInput = input;
				event.preventDefault();
			});
		}
	};
	
	/** Select click handler. */
	var clickHandler = function(event) {
		if (!isInPopup(event.target)) {
			closePopup(false);
		}
	};
	
	/** Select double click handler. */
	var dblclickHandler = function(event) {
		closePopup(true);
	};
	
	/** Called when the popup is shown or hidden. Inits the popup. */
	$scope.$watch('showPopup', function(showPopup) {
		if (showPopup) {
			$timeout(function() {
				select.focus();
				select.addEventListener("keydown", keyDownHandler, true);
				select.addEventListener("dblclick", dblclickHandler, true);
				document.addEventListener("click", clickHandler, true);
			});
		}
	});
	
	/** Checks the word written by the user to filter suggestions. */
	$scope.$watch('startedWord', function(newValue, oldValue) {
		if (newValue != oldValue) {
			var filteredSuggestions = [];
			for (var index = 0; index < $scope.suggestions.length; index++) {
				var suggestion = $scope.suggestions[index];
				if (suggestion.name.indexOf($scope.startedWord) == 0 ||
						(suggestion.compare != undefined && suggestion.compare.indexOf($scope.startedWord) == 0)) {
					filteredSuggestions.push(suggestion);
				}
			}
			$scope.filteredSuggestions = filteredSuggestions;
			$scope.selectedProperty = $scope.filteredSuggestions[0];
		}
	});
};

/** Auto-completion popup. */
directives.directive('suggestPopup', function() {
	return {
		restrict : 'E',
		templateUrl : "js/directives/templates/suggestPopup.html",
		replace : true,
		controller : [ '$scope', '$element', '$attrs', '$timeout', function($scope, element, attrs, $timeout) {
			return new SuggestController($scope, $timeout, element);
		}]
	};
});

/** Auto-completion service */
var CompletionService = function($http) {
	
	var ELSE_KEYWORD = "else";
	
	var SCOPE_CATEGORY = "scope";
	
	var properties = null;

	/** Loads all suggestions. */
	$http.get("data/angular-sheet.json").success(function(data) {
		properties = data;
	});
	
	/*var getScopes = function() {
		var elements = document.getElementsByClassName('ng-scope');
		var trueElements = [];
		var scopes = [];
		for (var index = 0; index < elements.length; index++) {
			var element = elements[index];
			var scope = angular.element(element).scope();
			if (scope.myValue != undefined) {
				scopes.push(scope);
				trueElements.push(element);
			}
		}
		console.log(trueElements);
		return scopes;
	};*/
	
	this.getScopeProperties = function(pContent) {
		// TODO: check another notations, and if the controller element wraps our current element.
		/*var hasController = pContent.indexOf('ng-controller');
		if (hasController) {
			
		}*/
	};

	/** Returns parse properties for a given type. */
	this.getProperties = function(type) {
		if (type == "javascript") {
			return properties.js;
		} else if (type == "html") {
			return properties.html;
		}
		return null;
	};

	/** Returns currently written word. */
	this.getStartedWord = function(content, type) {
		var word = "";
		var props = this.getProperties(type);
		for (var index = content.length - 1; index > -1; index--) {
			var char = content[index];
			if (props[char] != undefined) {
				return word;
			} else {
				word = char + word;
			}
		}
		return word;
	};

	/** Returns a suggestion list for given type and content. */
	this.getSuggestions = function(content, type) {
		var props = this.getProperties(type);
		var inputs = [];
		var input = '';
		// Parses content from end to beginning.
		for ( var index = content.length - 1; index > -1; index--) {
			var char = content[index];
		
			// Checks if current char is a special one (<, >, etc...)
			if (props[char] != undefined || props[ELSE_KEYWORD] != undefined) {
				props = props[char] != undefined ? props[char] : props[ELSE_KEYWORD];
				inputs.push(input);
				input = '';
				if (props.suggestions != undefined) {
					var list = [];
					//$scope.startedWord = inputs[0];
					for ( var indexProp = 0; indexProp < props.suggestions.length; indexProp++) {
						
						// Alias to category
						if (typeof props.suggestions[indexProp] == "string") {
							var suggestionName = props.suggestions[indexProp];
							
							// Displays all scope properties.
							if (suggestionName == SCOPE_CATEGORY) {
								
							}
							// Categories defined in the json file.
							else if (properties.categories[suggestionName] != undefined) {
								var category = properties.categories[suggestionName].list;
								if (category != undefined) {
									for (var key in category) {
										//Check that the started input matches the suggestion syntax.
										if (key.indexOf(inputs[0]) == 0 || 
												(category[key].compare != undefined && category[key].compare.indexOf(inputs[0]) == 0)) {
											category[key].name = key; // suggestion name
											category[key].type = suggestionName; // suggestion type (directive, etc...)
											
											// Suggestion suffix (ex: ="")
											if (category[key].suffix == undefined) {
												category[key].suffix = 
													properties.categories[suggestionName].defaultSuffix;
											}
												
											// Cursor position modifier
											if (category[key].cursorPosition == undefined) {
												category[key].cursorPosition = 
													properties.categories[suggestionName].defaultCursorPos;
											}
												
											// Add whitespace after if needed
											if (category[key].addWhitespace == undefined) {
												category[key].addWhitespace = 
													properties.categories[suggestionName].defaultAddWhitespace;
											}
											
											// Replaces currently written string with suggestion
											if (category[key].replace == undefined) {
												category[key].replace = 
													properties.categories[suggestionName].defaultReplace;
											}
											
											list.push(category[key]);
										}
									}
								}
							}
						} else {
							list.push(props.suggestions[indexProp]);
						}
					}
					return list;
				}
			} else {
				input = char + input;
			}
		}
		
		return null;
	};
};

directives.service('CompletionService', [ '$http', CompletionService ]);