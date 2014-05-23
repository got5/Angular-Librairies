/**
 * Created by pierremarot on 13/05/2014.
 */
"use strict";
(function(){
    angular.module('trainingApp').directive("sideButton", function () {
        return {
            replace:true,
            template: '<div><div class="right-header"><a class="btn" title="{{title}}" ng-href="{{url}}" target="_blank"><i class="icon-white icon-pencil"></i><img ng-src="{{image}}"/></a></div></div>',
            scope:{
                title:"@?",
                url:"@?",
                image:"@?"
            }
        }
    });
})();