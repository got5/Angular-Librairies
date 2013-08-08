/** File editor directive (use Ace editor library). */

'use strict';

/** Editor settings */
var EditorSettings = function(mode, theme, showPreview, showTabs, resetCache,
		enableCompletion, compileCode) {
	/** Mode (html is default) */
	this.mode = mode != undefined ? mode : 'html';

	/** Theme (default is twilight) */
	this.theme = theme != undefined ? theme : 'twilight';

	/** Shows code preview panel (default is false) */
	this.showPreview = showPreview != undefined ? showPreview == "true" : false;

	/** Shows files tabs (default is false) */
	this.showTabs = showTabs != undefined ? showTabs == "true" : false;

	/** Resets cache on every compilation (default is false) */
	this.resetCache = resetCache != undefined ? resetCache == "true" : false;

	/** Enables auto-completion. (default is true) */
	this.enableCompletion = enableCompletion != undefined ? enableCompletion == "true"
			: true;

	/** Defines if the editor code is compiled. */
	this.compileCode = compileCode != undefined ? compileCode == "true" : true;
};

/** Editor controller. */
var FileEditorController = function($scope, window, transclude, location, timeout, completionService, saveService, settings) {

	/** ace.js is required to use this directive. */
	if (window.ace == undefined) {
		throw "ace not found.";
	}

	/** Editor height */
	$scope.height = ($scope.height == undefined) ? "200px" : $scope.height + "px";

	/** Scope properties */
	$scope.showPreview = settings.showPreview;
	$scope.showTabs = settings.showTabs;
	$scope.popupStyle = { 'right' : '0px', 'bottom' : '0px' };
	$scope.showPopup = false;

	/** Currently edited file */
	var currentFile = null;

	/** Ace editor creation and configuration. */
	var editor = ace.edit("editor");
	editor.setTheme("ace/theme/" + settings.theme);

	/** Add auto-completion command to the editor. */
	editor.commands.addCommand({
		name : 'autocompletion',
		bindKey : {
			win : 'Ctrl-Space'
		},
		exec : function(editor) {
			$scope.$apply(function() {
				if (!$scope.showPopup) {
					var textBefore = getTextBeforeCursor();
					$scope.suggestions = completionService.getSuggestions(
							textBefore, currentFile.type);
					$scope.showPopup = true;

					editor.container.addEventListener("keydown",
							function(event) {
								if (event.keyCode == 13) {
									$scope.showPopup = false;
								}
							}, true);
				} else {
					$scope.showPopup = false;
				}
			});
		}
	});
	
	$scope.$watch('chosenSuggestion', function() {
		if ($scope.chosenSuggestion != undefined) {
			timeout(function() {
				editor.insert($scope.chosenSuggestion);
				editor.focus();
			});
		}
	});

	/** Returns text before given position. */
	var getTextBeforePosition = function(position) {
		var lines = currentFile.content.split('\n');
		var textBefore = "";
		if (position.row > 0) {
			for ( var indexRow = 0; indexRow < position.row; indexRow++) {
				textBefore += lines[indexRow];
			}
		}
		var lastLine = lines[position.row];
		for ( var indexCol = 0; indexCol < position.column; indexCol++) {
			textBefore += lastLine[indexCol];
		}
		return textBefore;
	};

	/** Returns text before current cursor position. */
	var getTextBeforeCursor = function() {
		return getTextBeforePosition(editor.selection.getCursor());
	};

	var bApply = true;

	/** Sets editor value. */
	var setEditorValue = function(content) {
		bApply = false;
		editor.getSession().setValue(content);
		bApply = true;
	};
	
	/** File switch. */
	$scope.switchToFile = function(file) {
		editor.getSession().setMode("ace/mode/" + file.type);
		setEditorValue(file.content);
		currentFile = file;
	};
	
	var currentURL = location.url();
	/** Saves the current editor content when current page is left. */
	$scope.$on('$destroy', function (event) {	
		saveService.saveContent(currentURL, $scope.files);
		saveService.saveCurrentFileName(currentURL, currentFile.name);
    });
	
	var getFileContent = function(file) {
		return file.childNodes[0] != undefined && file.childNodes[0].nodeValue != undefined ? file.childNodes[0].nodeValue : file.outerText;
	};
	
	/** Transclude function. Used to init the editor content. */
	transclude(function(clone) {
		$scope.files = [];
		var savedContent = saveService.getSavedContent(currentURL);
		var lastCurrentFileName = saveService.getCurrentFileName(currentURL);
		for ( var index = 0; index < clone.length; index++) {
			var child = clone[index];
			if (child.attributes != undefined
					&& child.attributes['name'] != undefined
					&& child.attributes['type'] != undefined) {
				var file = {
					name : child.attributes['name'].nodeValue,
					type : child.attributes['type'].nodeValue,
					content : getFileContent(child),
					isCurrent : false
				};
				
				/** Gets saved content. */
				if (savedContent && savedContent[file.name] != undefined) {
					file.content = savedContent[file.name];
				}
				
				$scope.files.push(file);
				
				if (lastCurrentFileName && lastCurrentFileName == file.name) {
					file.isCurrent = true;
				}
			}
		}
	});

	/** Returns JS wrapped in HTML script tag. */
	var wrapJSScript = function(content) {
		return "<script language='javascript' type='text/javascript'>"
				+ content + "</script>";
	};

	/** Returns editor content (concat every tab code, formats js, etc.). */
	var getEditorContent = function() {
		var content = '';

		for ( var index = 0; index < $scope.files.length; index++) {
			var file = $scope.files[index];

			if (file == currentFile) {
				currentFile.content = editor.getSession().getValue();
			}

			if (file.type == "javascript") {
				content += wrapJSScript(file.content);
			} else {
				content += file.content;
			}
		}

		return content;
	};

	/** Handler on editor content change. */
	var onEditorChange = function(event) {
		if (bApply) {
			$scope.$apply(function() {
				resetServiceCache();
				
				var editorContent = getEditorContent();
				if (settings.compileCode) {
					// Code content is updated and compiled.
					$scope.code = editorContent;
				}

				if ($scope.showPopup) {
					var position = editor.selection.getCursor();
					position.column++; // Cursor position has not been yet
										// updated.
					// Used to filter suggestions in the auto-completion popup.
					$scope.startedWord = completionService.getStartedWord(
							getTextBeforePosition(position), currentFile.type);
				}
			});
		}
	};

	/** Removes all services/directives created in the editor. */
	var resetServiceCache = function() {
		if (settings.resetCache) {
			/*
			 * var services = application.injector.getRegisteredServices(); for
			 * (var index = services.length - 1; index > -1; index--) { if
			 * (services[index] == 'editorDirectiveProvider') { break; }
			 * application.injector.resetService(services[index]); }
			 * application.compileProvider.resetDirective('starRatingDirective');
			 * application.compileProvider.resetDirective('starRatingDirectiveProvider');
			 * application.injector.resetService('starRatingDirective');
			 * application.injector.resetService('starRatingDirectiveProvider');
			 */
			// TODO: Autocomplete
			// TODO: remove service
			// TODO: exceptionhandler
		}
	};
	
	/** Used to correct a resize problem on the editor. */
	var onFocus = function(event) {
		editor.resize();
	};
	
	resetServiceCache();

	if (settings.compileCode) {
		$scope.code = getEditorContent();
	}
	
	editor.on("change", onEditorChange);
	editor.on('focus', onFocus);
};

/** Compile directive */
directives.directive('compile', ['$compile', '$timeout', function($compile, $timeout) {
	// directive factory creates a link function
	return function(scope, element, attrs) {
		
		var currentError = null;
		var promise = null;
		
		/** Shows the error if there is one. */
		var handleErrors = function() {
			if (currentError) {
				console.error(currentError.message);
			}
		};
		
		scope.$watch(function(scope) {
				// watch the 'compile' expression for changes
				return scope.$eval(attrs.compile);
			},

			function(value) {
				currentError = null;
				
				/** Code has changed, we will wait another second before displaying errors. */
				if (promise) {
					$timeout.cancel(promise);
					promise = null;
				}
				
				/** Waits for one second before displaying a potential error. */
				promise = $timeout(handleErrors, 1000);
				
				try {
					/** Assigns compile expression to the DOM. */
					element.html(value);
	
					/** Compile the new DOM and link it to the current scope. */
					$compile(element.contents())(scope);
				} catch (error) {
					currentError = error;
				}
			});
	};
}]);

/** Suggestion popup controller. */
var SuggestController = function($scope, $timeout, element) {
	
	var select = document.getElementById('suggestSelect');
	
	var keyDownHandler = function(event) {
		if (event.keyCode == 13) {
			$scope.$apply(function() {
				$scope.showPopup = false;
				$scope.chosenSuggestion = $scope.selectedProperty;
			});
			select.removeEventListener("keydown", keyDownHandler);
		}
	};
	
	$scope.$watch('showPopup', function(showPopup) {
		if (showPopup) {
			$timeout(function() {
				select.focus();
				//select[0].selected = true;
				select.addEventListener("keydown", keyDownHandler, true);
				console.log($scope.suggestions);
			});
		}
	});

	$scope.showSuggest = function(suggest) {
		return $scope.startedWord == undefined
				|| suggest.name.indexOf($scope.startedWord) == 0;
	};
};

/** Auto-completion popup. */
directives.directive('suggestPopup', function() {
	return {
		restrict : 'E',
		template : "<div ng-show='showPopup' ng-style='popupStyle' class='autocomplete-popup'><select ng-model='selectedProperty' id='suggestSelect' size='5' class='suggest-select'>"
			+ "<option ng-repeat='suggestion in suggestions | filter:showSuggest'>{{suggestion.name}}</option></select></div>",
		replace : true,
		controller : [ '$scope', '$element', '$attrs', '$timeout', function($scope, element, attrs, $timeout) {
			return new SuggestController($scope, $timeout, element);
		}]
	};
});

/** Auto-completion service */
var CompletionService = function($http) {

	var properties = null;

	/** Loads all suggestions. */
	$http.get("data/angular-sheet.json").success(function(data) {
		properties = data;
	});

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
		for ( var index = content.length - 1; index > -1; index--) {
			var char = content[index];
			if (props[char] != undefined) {
				return word;
			} else {
				word = char + word;
			}
		}
		return word;
	},

	/** Returns a suggestion list for given type and content. */
	this.getSuggestions = function(content, type) {

		var props = this.getProperties(type);
		var inputs = [];
		var input = '';
		// Parses content from end to beginning.
		for ( var index = content.length - 1; index > -1; index--) {
			var char = content[index];
		
			// Checks if current char is a special one (<, >, etc...)
			if (props[char] != undefined) {
				props = props[char];
				inputs.push(input);
				input = '';
				if (props.suggestions != undefined) {
					var list = [];
					// $scope.startedWord = inputs[0];
					for ( var indexProp = 0; indexProp < props.suggestions.length; indexProp++) {
						var suggestionName = props.suggestions[indexProp];
		
						if (suggestionName.indexOf('*') == 0) {
							suggestionName = suggestionName.slice(1);
							var category = properties.categories[suggestionName];
							if (category != undefined) {
								for ( var key in category) {
									if (key.indexOf(inputs[0]) == 0) {
										category[key].name = key;
										category[key].type = suggestionName;
										list.push(category[key]);
									}
								}
							}
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


var EditorConstructor = function() {
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope: {
			code : '=?',
			height : '@?'
		},
		controller : [ '$scope', '$attrs', '$transclude', '$window', '$location', '$timeout', 'CompletionService', 'SaveService',
			function(scope, attrs, transclude, window, location, timeout, completionService, saveService) {
				return new FileEditorController(scope, window, transclude, location, timeout, completionService, saveService,
						new EditorSettings(attrs.mode, attrs.theme, attrs.showPreview, attrs.showTabs,
		   					attrs.resetCache, attrs.enableCompletion, attrs.compileCode));
		}]
	};
};

/** Editor (with preview/tabs options) directive */
directives.directive('editor', function() {
	var editor = new EditorConstructor();
	editor.templateUrl = "js/directives/templates/editor-horizontal.html";
	return editor;
});

/** Mobile Version Editor directive */
directives.directive('editorMobile', function() {
	var editor = new EditorConstructor();
	editor.templateUrl = "js/directives/templates/editor-mobile.html";
	return editor;
});

/** Editor with vertical layout. */
directives.directive('editorVertical', function() {
	var editor = new EditorConstructor();
	editor.templateUrl = "js/directives/templates/editor-vertical.html";
	return editor;
});

/** Service used to store the editor content, edited by the users. */
var SaveService = function($route) {
	
	/** Used to register the content of files of a given url. */
	var savedContent = {};
	
	/** Current file names for each url. */
	var currentFiles = {};
	
	/** Saved content of files for a given url. */
	this.saveContent = function(pUrl, pFiles) {
		var save = {};
		for (var index = 0; index < pFiles.length; index++) {
			var file = pFiles[index];
			save[file.name] = file.content;
		}
		savedContent[pUrl] = save;
	};
	
	/** Gets saved content for a given url. */
	this.getSavedContent = function(pUrl) {
		return savedContent[pUrl] != undefined ? savedContent[pUrl] : null;
	};
	
	/** Saves current file name for a given url. */
	this.saveCurrentFileName = function(pUrl, pName) {
		currentFiles[pUrl] = pName;
	};
	
	/** Gets current file name for a given url. */
	this.getCurrentFileName = function(pUrl) {
		return currentFiles[pUrl] != undefined ? currentFiles[pUrl] : null;
	};
};
directives.service('SaveService', [ '$route', SaveService]);
