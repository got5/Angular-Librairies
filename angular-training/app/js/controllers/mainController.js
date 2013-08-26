'use strict';

var MainController = function($scope, $document, $http, $route, $location, $position, $window) {
	
	var currentLocation = $location.url();
	
	$scope.$watch('slideIndex', function(newSlide, oldSlide) {
		if (oldSlide != newSlide && $scope.slides != undefined) {
			var route = $scope.slides[$scope.slideIndex];
			$location.path("/" + route.content);
		}
	});
	
	/** Gets all slides and create urls for each one. */
	$http.get("data/slides.json").success(function(data) {
		$scope.slides = data;
		angular.forEach($scope.slides, function(route) {
			$route.routes["/" + route.content] = { templateUrl: "partials/" + route.content + ".html" };
		});
		
		if (currentLocation == "/") {
			//Redirects to the first slide.
			$scope.slideIndex = 0;
		} else {
			var index = getSlideIndexFromURL(currentLocation);
			$scope.slideIndex = index != -1 ? index : 0;
		}
	}).error(function(data) {
		console.log("Error loading slides.json file...");
	});
	
	var getSlideIndexFromURL = function(url) {
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

	$scope.nextSlide = function() {
		if ($scope.slides != undefined && $scope.slideIndex < $scope.slides.length) {
			$scope.slideIndex++;
		}
	};

	$scope.previousSlide = function() {
		if ($scope.slideIndex > 0) {
			$scope.slideIndex--;
		}
	};
	
	/** Used for progress bar */
	var progressBarIndicator = {
		index: 0,
		value: { value: 0, type: "danger" }
	};
	
	$scope.getProgressLength = function() {
		if ($scope.slides != undefined && progressBarIndicator.index != $scope.slideIndex) {
			progressBarIndicator.index = $scope.slideIndex;
			progressBarIndicator.value = { value: $scope.slideIndex/ $scope.slides.length * 100, type: "danger" };
		}
		return progressBarIndicator.value;
	};

	$document.keydown(function(event) {
		if (event.keyCode == 37) {
			$scope.$apply(function() {
				$scope.previousSlide();
			});
		} else if (event.keyCode == 39) {
			$scope.$apply(function() {
				$scope.nextSlide();
			});
		}
	});
	
	var indexSlide = 0;

    /** Changes selected slide index. */
	$scope.gotoSelectedSlide = function() {
		$scope.slideIndex = indexSlide;
	};

    /** Updates popup text with slide title (depends on mouse position on the progress bar). */
	$scope.setPopupText = function() {
		if ($scope.slides != undefined) {
			var mousePos = $position.mouse();
			indexSlide = (mousePos.x * $scope.slides.length)/$window.document.width;
			indexSlide = Math.floor(indexSlide) + 1;
			var progressBarSlide = $scope.slides[indexSlide];
			if (progressBarSlide != undefined) {
				$scope.popupText = indexSlide + (progressBarSlide.title != undefined ? " : " + progressBarSlide.title : '');
			}
		}
	};

    /** Listen to routes changes, to synchronize $scope.slideIndex with current location path. */
	$scope.$on('$routeChangeStart', function(event, next) {
        //TODO: no better way to have the next location...?
        if (next != null && next.$$route != undefined) {
            var indexURL = getSlideIndexFromURL(next.$$route.templateUrl.replace("partials", "").replace(".html", ""));
            if (indexURL > -1 && indexURL != $scope.slideIndex) {
                $scope.slideIndex = indexURL;
            }
        }
	});
};


MainController.$inject = [ '$scope', '$document', '$http', '$route', '$location', '$position', '$window' ];