'use strict';


/** Compile directive */
directives.directive('compile',['$compile','$controller','$timeout', function ($compile, $controller, $timeout) {
    // directive factory creates a link function
    return {
        terminal: true,
        link: function (scope, element, attrs) {
            var currentError, promise;

            var handleErrors = function () {
                if (currentError) {
                    console.error(currentError.message);
                }
            };
            scope.$watch(function (scope) {
                    // watch the 'compile' expression for changes
                    return scope.$eval(attrs.compile);
                },

                function (value) {

                    if (value) {

                        var compileDom = function(currentError, promise) {
                            /** Code has changed, we will wait another second before displaying errors. */
                            if (promise) {
                                $timeout.cancel(promise);
                                promise = null;
                            }

                            /** Waits for one second before displaying a potential error. */
                            promise = $timeout(handleErrors, 1000);

                            try {
                                /** Assigns compile expression to the DOM. */
                                element.html(value.html);
                                /** Compile the new DOM and link it to the current scope. */
                                $compile(element.contents())(scope);

                            } catch (error) {
                                currentError = error;
                            }

                        };

                        if(!scope.angularApp){
                            compileDom(promise,currentError);
                        }
                        if (value.js != '') {
                            var script = document.createElement('script');
                            script[(script.textContent === undefined ? 'innerText' : 'textContent')] = '' + value.js;
                            currentError = null;
                            element.parent().find('script').remove();
                            element.parent().append(script);
                        }

                        if (value.css != '') {
                            var style = document.createElement('style');
                            style[(style.textContent === undefined ? 'innerText' : 'textContent')] = '' + value.css;
                            currentError = null;
                            element.parent().find('style').remove();
                            element.parent().append(style);
                        }

                       if(scope.angularApp){
                           compileDom(promise,currentError);
                       }
                    }
                });
        }}
}]);

directives.value('escape', function (text) {
    return text.replace(/\&/g, '&amp;').replace(/\</g, '&lt;').replace(/\>/g, '&gt;').replace(/"/g, '&quot;');
}).factory('script', function () {
    var version = {
        angular:'1.2.16',
        jquery:'1.11.1',
        uiBootstrap:'0.10.0'
    }

    return {
        jquery:'<script src="//ajax.googleapis.com/ajax/libs/jquery/' + version.jquery + '/jquery.min.js"></script>',
        angular: '<script src="https://ajax.googleapis.com/ajax/libs/angularjs/' + version.angular + '/angular.min.js"></script>\n',
        uiBootstrap: '<script src="//cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/' + version.uiBootstrap + '/ui-bootstrap-tpls.min.js"></script>\n'
    };
});

directives
    .service('saveService', function () {

        /** Used to register the content of files of a given url. */
        var savedContent = {};

        /** Current file names for each url. */
        var currentFiles = {};

        /** Saved content of files for a given url. */
        this.saveContent = function (pUrl, pFiles) {
            var save = {};
            for (var index = 0; index < pFiles.length; index++) {
                var file = pFiles[index];
                save[file.name] = file.content;
            }
            savedContent[pUrl] = save;
        };

        /** Gets saved content for a given url. */
        this.getSavedContent = function (pUrl) {
            return savedContent[pUrl] != undefined ? savedContent[pUrl] : null;
        };

        /** Saves current file name for a given url. */
        this.saveCurrentFileName = function (pUrl, pName) {
            currentFiles[pUrl] = pName;
        };

        /** Gets current file name for a given url. */
        this.getCurrentFileName = function (pUrl) {
            return currentFiles[pUrl] != undefined ? currentFiles[pUrl] : null;
        };
    }).constant('editorConfig', {});

var EditorConstructor = function ($timeout, $location, editorConfig, saveService, escape, script) {
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
        link: function (scope, elm, attrs, controller, transcludeFn) {
            var options, opts, acee, session, onChange;

            options = editorConfig.ace || {};
            var defaultOptions = {
                theme: 'twilight',
                mode: 'html',
                showPreview: false,
                showTabs: false,
                showPopup: false,
                enableCompletion: true,
                angular:true,
                compileCode: true,
                height: '200'};

            opts = angular.extend(defaultOptions, options, scope.$eval(attrs.editorOptions));

            /** Editor height */
            scope.height = opts.height;

            /**
             * scope properties
             */
            scope.showPreview = opts.showPreview;
            scope.showTabs = opts.showTabs;
            scope.showPopup = opts.showPopup;
            scope.angularApp = opts.angular;

            var e = elm.find("pre")[0];
            acee = window.ace.edit(e);

            var langTools = require("ace/ext/language_tools");

            session = acee.getSession();

            var hiddenField = function (name, value) {
                return '<input type="hidden" name="' + name + '" value="' + escape(value) + '">';
            };

            onChange = function (callback) {
                return function (e) {
                    var newValue = session.getValue();
                    if (newValue !== scope.$eval(attrs.value) && !scope.$$phase && !scope.$root.$$phase) {
                        if (angular.isDefined(controller)) {
                            scope.$apply(function () {
                                controller.$setViewValue(newValue);
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
            if (angular.isDefined(controller)) {
                controller.$formatters.push(function (value) {
                    if (angular.isUndefined(value) || value === null) {
                        return '';
                    }
                    else if (angular.isObject(value) || angular.isArray(value)) {
                        throw new Error('object and array are not supported');
                    }
                    return value;
                });

                controller.$render = function () {
                    session.setValue(controller.$viewValue);
                };
            }

            // EVENTS
            session.on('change', onChange(opts.onChange));

            elm.on('$destroy', function () {
                acee.session.$stopWorker();
                acee.destroy();
                saveService.saveContent(currentURL, scope.files);
                saveService.saveCurrentFileName(currentURL, currentFile.name);
            });

            var currentURL = $location.url();


            var getFileContent = function (file) {
                var ret = file.childNodes[0] != undefined && file.childNodes[0].nodeValue != undefined ? file.childNodes[0].nodeValue.trim() : file.outerText.trim();
                return ret;
            };

            /** Transclude function. Used to init the editor content. */
            transcludeFn(function (clone) {
                scope.files = [];
                var savedContent = saveService.getSavedContent(currentURL);
                var lastCurrentFileName = saveService.getCurrentFileName(currentURL);
                for (var index = 0; index < clone.length; index++) {
                    var child = clone[index];
                    if (child.attributes != undefined
                        && child.attributes['name'] != undefined
                        && child.attributes['type'] != undefined) {
                        var file = {
                            name: child.attributes['name'].nodeValue,
                            type: child.attributes['type'].nodeValue,
                            content: getFileContent(child),
                            isCurrent: false
                        };

                        /** Gets saved content. */
                        if (savedContent && savedContent[file.name] != undefined) {
                            file.content = savedContent[file.name];
                        }
                        scope.files.push(file);
                        if (lastCurrentFileName && lastCurrentFileName == file.name) {
                            file.isCurrent = true;
                        }
                    }
                }
            });

            scope.$watch(function () {
                var e = elm.find("pre");
                return [e.offsetWidth, e.offsetHeight];
            }, function () {
                acee.resize();
                acee.renderer.updateFull();
            }, true);

            scope.$watch(function () {

                var hWin = window.innerHeight;
                return hWin
            }, function (hWin) {

                var height = function (elm) {
                    return Math.max(elm.scrollHeight, elm.offsetHeight);
                };

                $timeout(function () {
                    var hBody = height(document.body);
                    var diff = hWin - hBody;
                    var newHeight;
                    if (diff < 0) {
                        newHeight = opts.height + (diff - ((hWin / hBody) * 25));
                    } else {
                        newHeight = opts.height;
                    }
                    var editorHeight = angular.element(document.querySelector('#editor'))[0].clientHeight;

                    if (newHeight > 0) {
                        scope.height = newHeight;
                    }
                }, 100);

            }, true);

            if (opts.enableCompletion) {
                /** Add auto-completion command to the acee. */
                acee.setOptions({
                    enableBasicAutocompletion: true,
                    enableSnippets: true
                });
            }
            /** Returns text after given position. */
            var getTextAfterPosition = function (position) {
                var lines = currentFile.content.split('\n');
                var textAfter = "";

                var lastLine = lines[position.row];
                for (var indexCol = position.column; indexCol < lastLine.length; indexCol++) {
                    textAfter += lastLine[indexCol];
                }
                if (position.row < lines.length) {
                    for (var indexRow = position.row; indexRow < lines.length; indexRow++) {
                        textAfter += lines[indexRow];
                    }
                }
                return textAfter;
            };

            /** Returns text before given position. */
            var getTextBeforePosition = function (position) {
                var lines = currentFile.content.split('\n');
                var textBefore = "";
                if (position.row > 0) {
                    for (var indexRow = 0; indexRow < position.row; indexRow++) {
                        textBefore += lines[indexRow];
                    }
                }
                var lastLine = lines[position.row];
                for (var indexCol = 0; indexCol < position.column; indexCol++) {
                    textBefore += lastLine[indexCol];
                }
                return textBefore;
            };

            /** Returns text after current cursor position. */
            var getTextAfterCursor = function () {
                return getTextAfterPosition(acee.selection.getCursor());
            };

            /** Returns text before current cursor position. */
            var getTextBeforeCursor = function () {
                return getTextBeforePosition(acee.selection.getCursor());
            };

            var bApply = true;

            /** Sets editor value. */
            var setEditorValue = function (content) {
                bApply = false;
                acee.getSession().setValue(content);
                bApply = true;
            };

            /** File switch. */
            scope.switchToFile = function (file) {
                acee.getSession().setMode("ace/mode/" + file.type);
                setEditorValue(file.content);
                currentFile = file;
            };


            /** Handler on editor content change. */
            var onEditorChange = function (event) {
                if (bApply) {
                    scope.$apply(function () {

                        var editorContent = getEditorContent();
                        if (opts.compileCode) {
                            // Code content is updated and compiled.
                            scope.code = editorContent;
                        }

                    });
                }
            };


            /** Returns JS wrapped in HTML script tag. */
            var wrapJSScript = function (content) {

                var script = document.createElement('script');
                script[(script.textContent === undefined ? 'innerText' : 'textContent')] = '' + content;
                return script;

            };

            var wrapCSS = function (content) {
                var style = document.createElement('style');
                style[(script.textContent === undefined ? 'innerText' : 'textContent')] = '' + content;
                return style;
            };

            /** Returns editor content (concat every tab code, formats js, etc.). */
            var getEditorContent = function () {
                var content = {html: '', js: '', css: ''};

                for (var index = 0; index < scope.files.length; index++) {
                    var file = scope.files[index];

                    if (file == currentFile) {
                        currentFile.content = acee.getSession().getValue();
                    }

                    if (file.type == "javascript") {
                        var script = wrapJSScript(file.content);

                        /**
                         * The javascript code don't need to be compiled, so it's simply happen to the dom.
                         * Still the DOM must be compiled if the javascript change, so we leave it in content !
                         */
                        content.js += file.content;


                    } else if (file.type == "html") {
                        content.html += "<div class='html-content'>" + file.content + "</div>";
                    } else if (file.type == "css") {
                        content.css += file.content;
                    } else {
                        content.html += file.content;
                    }
                }
                return content;
            };


            /** Used to correct a resize problem on the editor. */
            var onFocus = function (event) {

                acee.resize(true);

            };


            if (opts.compileCode) {
                var content = getEditorContent();

                scope.code = content;
            }

            if (angular.isDefined(opts.jsFiddle) && opts.jsFiddle) {
                var name = '',
                    stylesheet = '<link rel="stylesheet" href="http://netdna.bootstrapcdn.com/bootstrap/3.0.3/css/bootstrap.min.css">\n',
                    fields = {
                        html: '',
                        css: scope.code.css ? scope.code.css : '',
                        js: scope.code.js ? scope.code.js : ''
                    };

                fields.html +=
                    '<div ng-app' + (opts.module ? '="' + opts.module + '"' : '') + '>\n' + scope.code.html + '</div>\n';


                var jf = angular.element('<div><div class="right-header">' +
                    '<form class="jsfiddle" method="post" action="http://jsfiddle.net/api/post/library/pure/" target="_blank">' +
                    hiddenField('title', 'AngularJS Example: ' + name) +
                    hiddenField('css', '</style> <!-- Ugly Hack due to jsFiddle issue: http://goo.gl/BUfGZ --> \n' +
                        stylesheet +
                        (opts.angular ? script.angular : '' ) +
                        (opts.uiBootstrap ? script.uiBootstrap : '') +
                        '<style>\n' +
                        fields.css) +
                    hiddenField('html', fields.html) +
                    hiddenField('js', fields.js) +
                    'JsFiddle: <button class="btn">' +
                    '<i class="icon-white icon-pencil"></i> ' +
                    '<img src="images/play.png"/>' +
                    '</button>' +
                    '</form></div></div>');
                elm.parent().after(jf);

            }

            acee.on("change", onEditorChange);
            acee.on("focus", onFocus);


        }
    };
};

/** Editor (with preview/tabs options) directive */
directives.directive('editor', ['$timeout', '$location', 'editorConfig', 'saveService', 'escape', 'script', function ($timeout, $location, editorConfig, saveService, escape, script) {
    var editor = new EditorConstructor($timeout, $location, editorConfig, saveService, escape, script);
    editor.templateUrl = "editor/templates/editor-horizontal.html";
    return editor;
}]);

/** Editor with vertical layout. */
directives.directive('editorVertical', ['$timeout', '$location', 'editorConfig', 'saveService', 'escape', 'script', function ($timeout, $location, editorConfig, saveService, escape, script) {
    var editor = new EditorConstructor($timeout, $location, editorConfig, saveService, escape, script);
    editor.templateUrl = "editor/templates/editor-vertical.html";
    return editor;
}]);