'use strict';





directives
    .service('saveService',function(){

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
    })
    .constant('editorConfig', {})
    .directive('editor', ['$timeout','editorConfig', 'saveService', 'completionService', function ($timeout,editorConfig,saveService,completionService) {
        if (angular.isUndefined(window.ace)) {
            throw new Error('ace not found');
        }

        /** Currently edited file */
        var currentFile = null;

        return {
            restrict: 'E',
            require: '?ngModel',
            replace: true,
            transclude: true,
            templateUrl: "js/directives/templates/editor-horizontal.html",
            link: function (scope, elm, attrs, ngModel) {
                var options, opts, acee, session, onChange;

                options = editorConfig.ace || {};
                var defaultOptions = {
                    theme:'twilight',
                    mode:'html',
                    showPreview: false,
                    showTabs:false,
                    showPopup:false,
                    resetCache:false,
                    enableCompletion:true,
                    compileCode:true,
                    height:'200'};

                opts = angular.extend(defaultOptions, options, scope.$eval(attrs.editorOptions));

                /** Editor height */
                scope.height = opts.height + 'px';

                /**
                 * scope properties
                 */
                scope.showPreview = opts.showPreview;
                scope.showTabs = opts.showTabs;
                scope.showPopup = opts.showPopup;

                var e = elm.find("pre")[0];
                acee = window.ace.edit(e);
                session = acee.getSession();

                onChange = function (callback) {
                    return function (e) {
                        var newValue = session.getValue();
                        if (newValue !== scope.$eval(attrs.value) && !scope.$$phase && !scope.$root.$$phase) {
                            if (angular.isDefined(ngModel)) {
                                scope.$apply(function () {
                                    ngModel.$setViewValue(newValue);
                                });
                            }

                            /**
                             * Call the user onChange function.
                             */
                            if (angular.isDefined(callback)) {
                                scope.$apply(function () {
                                    if (angular.isFunction(callback)) {
                                        callback(e, acee);
                                    }
                                    else {
                                        throw new Error('function expected as callback.');
                                    }
                                });
                            }
                        }
                    };
                };


                // Boolean options
                if (angular.isDefined(opts.showGutter)) {
                    acee.renderer.setShowGutter(opts.showGutter);
                }
                if (angular.isDefined(opts.useWrapMode)) {
                    session.setUseWrapMode(opts.useWrapMode);
                }

                // onLoad callback
                if (angular.isFunction(opts.onLoad)) {
                    opts.onLoad(acee);
                }

                // Basic options
                if (angular.isString(opts.theme)) {
                    acee.setTheme('ace/theme/' + opts.theme);
                }
                if (angular.isString(opts.mode)) {
                    session.setMode('ace/mode/' + opts.mode);
                }

                attrs.$observe('readonly', function (value) {
                    acee.setReadOnly(value === 'true');
                });

                // Value Blind
                if (angular.isDefined(ngModel)) {
                    ngModel.$formatters.push(function (value) {
                        if (angular.isUndefined(value) || value === null) {
                            return '';
                        }
                        else if (angular.isObject(value) || angular.isArray(value)) {
                            throw new Error('object and array are not supported');
                        }
                        return value;
                    });

                    ngModel.$render = function () {
                        session.setValue(ngModel.$viewValue);
                    };
                }

                // EVENTS
                session.on('change', onChange(opts.onChange));

                elm.on('$destroy', function() {
                    acee.session.$stopWorker();
                    acee.destroy();
                });

                scope.$watch(function() {
                    var e = elm.find("pre");
                    return [e.offsetWidth, e.offsetHeight];
                }, function() {
                    acee.resize();
                    acee.renderer.updateFull();
                }, true);

                if (opts.enableCompletion) {
                    /** Add auto-completion command to the acee. */
                    acee.commands.addCommand({
                        name : 'autocompletion',
                        bindKey : {
                            win : 'Ctrl-Space',
                            mac: 'Cmd-Space'
                        },
                        exec : function() {
                            scope.$apply(function() {
                                if (!scope.showPopup) {
                                    var textBefore = getTextBeforeCursor();
                                    scope.suggestions = completionService.getSuggestions(
                                        textBefore, currentFile.type);

                                    if (scope.suggestions != null && scope.suggestions.length > 0) {

                                        //Auto-insert
                                        if (scope.suggestions.length == 1 && scope.suggestions[0].autoInsert == true) {
                                            scope.chosenSuggestion = scope.suggestions[0];
                                        } else {
                                            scope.startedWord = completionService.getStartedWord(textBefore, currentFile.type);
                                            scope.showPopup = true;
                                        }
                                    }
                                } else {
                                    scope.showPopup = false;
                                }
                            });
                        }
                    });

                    scope.$watch('showPopup', function(newValue, oldValue) {
                        if (newValue != oldValue &&  newValue) {
                            acee.focus();
                        }
                    });

                    scope.$watch('userInput', function() {
                        if (scope.userInput != undefined && scope.userInput != '') {
                            $timeout(function() {
                                acee.focus();
                                acee.insert(scope.userInput);
                                scope.userInput = '';
                            });
                        }
                    });

                    scope.$watch('chosenSuggestion', function() {
                        if (scope.chosenSuggestion != undefined) {
                            $timeout(function() {

                                // Removes currently written word if replace is set to true.
                                if (scope.chosenSuggestion.replace == true) {
                                    acee.removeWordLeft();
                                }

                                var codeToInsert = scope.chosenSuggestion.name.trim();

                                // Expression suffix (for example, ="")
                                if (scope.chosenSuggestion.suffix != undefined) {
                                    codeToInsert += scope.chosenSuggestion.suffix;
                                }

                                // If a part of the suggestion has already been written.
                                if (scope.startedWord != undefined && scope.startedWord.length > 0) {
                                    codeToInsert = codeToInsert.substring(scope.startedWord.length);
                                }

                                if (scope.chosenSuggestion.addWhitespace == true) {
                                    var codeAfter = getTextAfterCursor();
                                    if (codeAfter.length > 0 && codeAfter[0] != " ") {
                                        codeToInsert += " ";
                                        scope.chosenSuggestion.cursorPosition--;
                                    }
                                }

                                acee.insert(codeToInsert);

                                moveCursor(scope.chosenSuggestion.cursorPosition);

                                scope.chosenSuggestion = undefined;
                            });
                        }
                    });
                }

                var moveCursor = function(pDelta) {
                    if (pDelta > 0) {
                        acee.navigateRight(pDelta);
                    } else if (pDelta < 0) {
                        acee.navigateLeft(-pDelta);
                    }
                };
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
                    return getTextAfterPosition(acee.selection.getCursor());
                };

                /** Returns text before current cursor position. */
                var getTextBeforeCursor = function() {
                    return getTextBeforePosition(acee.selection.getCursor());
                };

                var bApply = true;

                /** Sets editor value. */
                var setEditorValue = function(content) {
                    bApply = false;
                    acee.getSession().setValue(content);
                    bApply = true;
                };

                /** File switch. */
                scope.switchToFile = function(file) {
                    acee.getSession().setMode("ace/mode/" + file.type);
                    setEditorValue(file.content);
                    currentFile = file;
                };




                /** Returns JS wrapped in HTML script tag. */
                var wrapJSScript = function(content) {
                    return "<script language='javascript' type='text/javascript'>"
                        + content + "</script>";
                };

                /** Returns editor content (concat every tab code, formats js, etc.). */
                var getEditorContent = function() {
                    var content = '';

                    for ( var index = 0; index < scope.files.length; index++) {
                        var file = scope.files[index];

                        if (file == currentFile) {
                            currentFile.content = acee.getSession().getValue();
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


                /** Removes all services/directives created in the editor. */
                var resetServiceCache = function() {
                    if (opts.resetCache) {
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
                    acee.resize(true);
                };

                resetServiceCache();

                if (opts.compileCode) {
                    scope.code = getEditorContent();
                }
            },
            controller: ['$scope', '$transclude', '$location', function($scope,$transclude,$location){

                var currentURL = $location.url();
                /** Saves the current editor content when current page is left. */
                $scope.$on('$destroy', function (event) {
                    saveService.saveContent(currentURL, $scope.files);
                    saveService.saveCurrentFileName(currentURL, currentFile.name);
                });

                var getFileContent = function(file) {
                    return file.childNodes[0] != undefined && file.childNodes[0].nodeValue != undefined ? file.childNodes[0].nodeValue : file.outerText;
                };

                /** Transclude function. Used to init the editor content. */
                $transclude(function(clone) {
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

            }]
        };
    }]);