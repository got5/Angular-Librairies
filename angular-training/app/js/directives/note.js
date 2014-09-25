/**
 * Created by pierremarot on 13/05/2014.
 */
"use strict";
(function () {
    angular.module('trainingApp').directive("contenteditable", ['$location', '$window', function ($location, $window) {
        return {
            restrict: 'A', // only activate on element attribute
            link: function (scope, element, attrs, ngModel) {
                var ls = $window.localStorage;
                var path = $location.path();
                if (!ls) return; // do nothing if no ng-model

                // Specify how UI should be updated
                 element.html(loadFromStorage());

                // Listen for change events to enable binding
                element.on('blur ', function () {
                    scope.$apply(read);
                });
                read(); // initialize

                // Write data to the model
                function read() {
                    var html = element.html();
                    // When we clear the content editable the browser leaves a <br> behind
                    // If strip-br attribute is provided then we strip this out
                    if (attrs.stripBr && html == '<br>') {
                        html = '';
                    }
                    saveToStorage(html)
                }

                function loadFromStorage() {
                    var key = path;
                    var val = ls.getItem(key);
                    return val || 'Note here';
                };

                function saveToStorage(value) {
                    var key = path;
                    if(value === 'Note here')
                        ls.removeItem(key);
                    else
                        ls[key] = value;
                };
            }
        };
    }]);
})();