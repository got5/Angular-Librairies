'use strict';

var MainController = function ($scope, $document, $http, $route, $location, $window) {

    var animation = "view-animate";;
    var currentLocation = $location.url();
    $scope.slideIndexAsPc = 0;


    $scope.$watch('slideIndex', function (newSlide, oldSlide) {
        $scope.updateSlideIndexAsPc();
        if (oldSlide != newSlide && $scope.slides != undefined) {
            var route = $scope.slides[$scope.slideIndex];
            $location.path("/" + route.content);
        }
    });

    /** Gets all slides and create urls for each one. */
    setTimeout(function () {
        $scope.slides = application.slides;
        $scope.updateSlideIndexAsPc();

        if (currentLocation == "/" || currentLocation == "") {
            //Redirects to the first slide.
            $scope.slideIndex = 0;
        } else {
            var index = getSlideIndexFromURL(currentLocation);
            $scope.slideIndex = index != -1 ? index : 0;
        }
    }, 0);

    var getSlideIndexFromURL = function (url) {
        if ($scope.slides != undefined) {
            for (var index = 0; index < $scope.slides.length; index++) {
                var route = $scope.slides[index];
                if (url == ("/" + route.content)) {
                    return index;
                }
            }
        }
        return -1;
    };

    $scope.nextSlide = function () {
        animation = "view-animate";

        if ($scope.slides != undefined && $scope.slideIndex < $scope.slides.length) {
            $scope.slideIndex++;
        }
    };

    $scope.previousSlide = function () {
       animation = "view-back-animate";

        if ($scope.slideIndex > 0) {
            $scope.slideIndex--;
        }
    };

    $scope.updateSlideIndexAsPc = function () {
        if ($scope.slideIndex != undefined && $scope.slides != undefined && $scope.slides.length > 0) {
            $scope.slideIndexAsPc = $scope.slideIndex / $scope.slides.length * 100;
        } else {
            $scope.slideIndexAsPc = 0;
        }
    };

    $document.on("keydown", function (event) {
        if (event.keyCode == 37) {
            $scope.$apply(function () {
                $scope.previousSlide();
            });
        } else if (event.keyCode == 39) {
            $scope.$apply(function () {
                $scope.nextSlide();
            });
        }
    });

    var indexSlide = 0;

    /** Changes selected slide index. */
    $scope.gotoSelectedSlide = function () {
        $scope.slideIndex = indexSlide;
    };


    /** Updates popup text with slide title (depends on mouse position on the progress bar). */
    $scope.setPopupText = function (e) {
        if ($scope.slides != undefined) {
            indexSlide = Math.floor((e.x * $scope.slides.length) / $window.innerWidth) + 1;
            var progressBarSlide = $scope.slides[indexSlide];
            if (progressBarSlide != undefined) {
                $scope.popupText = indexSlide + (progressBarSlide.title != undefined ? " : " + progressBarSlide.title : '');
            }
        }
    };


    /** Listen to routes changes, to synchronize $scope.slideIndex with current location path. */
    $scope.$on('$routeChangeStart', function (event, next) {
        //TODO: no better way to have the next location...?
        if (next != null && next.$$route != undefined) {
            var templateUrl = next.$$route.templateUrl;
            var url;
            if (templateUrl == null) {
                url = '/'
            } else {
                url = templateUrl.replace("partials", "").replace(".html", "");
            }
            var indexURL = getSlideIndexFromURL(url);
            if (indexURL > -1 && indexURL != $scope.slideIndex) {
                $scope.slideIndex = indexURL;
            }
        }
    });

    $scope.getAnimation = function(){
        return animation;
    }
};


MainController.$inject = [ '$scope', '$document', '$http', '$route', '$location', '$window', '$animate' ];