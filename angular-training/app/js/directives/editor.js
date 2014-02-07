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
	$scope.showPopup = false;

	/** Currently edited file */
	var currentFile = null;

	/** Ace editor creation and configuration. */
	var editor = ace.edit("editor");
	editor.setTheme("ace/theme/" + settings.theme);
	
	if (settings.enableCompletion) {
		/** Add auto-completion command to the editor. */
		editor.commands.addCommand({
			name : 'autocompletion',
			bindKey : {
				win : 'Ctrl-Space',
                mac: 'Cmd-Space'
			},
			exec : function(editor) {
				$scope.$apply(function() {
					if (!$scope.showPopup) {
						var textBefore = getTextBeforeCursor();
						$scope.suggestions = completionService.getSuggestions(
								textBefore, currentFile.type);
						
						if ($scope.suggestions != null && $scope.suggestions.length > 0) {
							
							//Auto-insert
							if ($scope.suggestions.length == 1 && $scope.suggestions[0].autoInsert == true) {
								$scope.chosenSuggestion = $scope.suggestions[0];
							} else {
								$scope.startedWord = completionService.getStartedWord(textBefore, currentFile.type);
								$scope.showPopup = true;
							}
						}
					} else {
						$scope.showPopup = false;
					}
				});
			}
		});
		
		$scope.$watch('showPopup', function(newValue, oldValue) {
			if (newValue != oldValue &&  newValue) {
				editor.focus();
			}
		});
		
		$scope.$watch('userInput', function() {
			if ($scope.userInput != undefined && $scope.userInput != '') {
				timeout(function() {
					editor.focus();
					editor.insert($scope.userInput);
					$scope.userInput = '';
				});
			}
		});
		
		$scope.$watch('chosenSuggestion', function() {
			if ($scope.chosenSuggestion != undefined) {
				timeout(function() {
					
					// Removes currently written word if replace is set to true.
					if ($scope.chosenSuggestion.replace == true) {
						editor.removeWordLeft();
					}
					
					var codeToInsert = $scope.chosenSuggestion.name.trim();
					
					// Expression suffix (for example, ="")
					if ($scope.chosenSuggestion.suffix != undefined) {
						codeToInsert += $scope.chosenSuggestion.suffix;
					}
					
					// If a part of the suggestion has already been written.
					if ($scope.startedWord != undefined && $scope.startedWord.length > 0) {
						codeToInsert = codeToInsert.substring($scope.startedWord.length);
					}
					
					if ($scope.chosenSuggestion.addWhitespace == true) {
						var codeAfter = getTextAfterCursor();
						if (codeAfter.length > 0 && codeAfter[0] != " ") {
							codeToInsert += " ";
							$scope.chosenSuggestion.cursorPosition--;
						}
					}
					
					editor.insert(codeToInsert);
					
					moveCursor($scope.chosenSuggestion.cursorPosition);
					
					$scope.chosenSuggestion = undefined;
				});
			}
		});
	}
	
	/** Move cursor position */
	var moveCursor = function(pDelta) {
		if (pDelta > 0) {
			editor.navigateRight(pDelta);
		} else if (pDelta < 0) {
			editor.navigateLeft(-pDelta);
		}
	};
	
	/*var getElementBeforePosition = function(pPosition, pString, pTrim) {
		var lines = currentFile.content.split('\n');
		for (var indexRow = pPosition.row; indexRow >= 0; indexRow--) {
			var line = lines[indexRow];
			
			var convertedLine = pTrim ? line.replace(" ", "") : line;
		}
	};*/
	
	/** Returns text after given position. */
	var getTextAfterPosition = function(position) {
		var lines = currentFile.content.split('\n');
		var textAfter = "";
		
		var lastLine = lines[position.row];
		for ( var indexCol = position.column; indexCol < lastLine.length; indexCol++) {
			textAfter += lastLine[indexCol];
		}
		if (position.row < lines.length) {
			for ( var indexRow = position.row; indexRow < lines.length; indexRow++) {
				textAfter += lines[indexRow];
			}
		}
		return textAfter;
	};
	
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
	
	/** Returns text after current cursor position. */
	var getTextAfterCursor = function() {
		return getTextAfterPosition(editor.selection.getCursor());
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
			} else if (file.type == "html") {
				content += "<div class='html-content'>" + file.content + "</div>";
			} else {
				content += file.content;
			}
		}
		return content;
	};
	
	/** Updates started word written when suggestion popup is visible. Used to filter suggestions. */
	var updateStartedWord = function() {
		if ($scope.showPopup) {
			var position = editor.selection.getCursor();
			position.column++; // Cursor position has not been yet
								// updated.
			// Used to filter suggestions in the auto-completion popup.
			$scope.startedWord = completionService.getStartedWord(
					getTextBeforePosition(position), currentFile.type);
		}
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

				updateStartedWord();
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
		editor.resize(true);
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

/** Base directive definition object */
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
var SaveService = function() {
	
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
directives.service('SaveService', [ SaveService]);
