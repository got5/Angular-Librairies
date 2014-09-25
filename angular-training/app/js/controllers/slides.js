/** data_binding_ex controller */
var DataBindingExCtrl =  function($scope, testUtils) {

    var initTests = function() {
        testUtils.changeInputModel("txtFirstName", "");
        testUtils.changeInputModel("txtLastName", "");
    };

    var editInputs = function() {
        testUtils.changeInputModel("txtFirstName", "Bob");
        testUtils.changeInputModel("txtLastName", "Sponge");
    };

    var checkInputResult = function() {
        testUtils.expectTrue(testUtils.hasInnerHTML("lblName", "Bob"),
            "Input 'txtFirstName' value is not binded to label 'lblName'.");
        testUtils.expectTrue(testUtils.hasInnerHTML("lblName", "Sponge"),
            "Input 'txtLastName' value not binded to label 'lblName'.");
    };

    var clickButton = function() {
        testUtils.clickOnButton("btnReset");
    };

    var checkButtonResult = function() {
        testUtils.expectTrue(testUtils.hasNotInnerHTML("lblName", "Bob"),
            "Label 'lblName' should be reset after click on button 'btnReset'.");
    };

    $scope.getTests = function() {
        return [
            new TestVO("Tests Initialization...", initTests, null),
            new TestVO("Check Data-binding on firstName/lastName inputs...", editInputs, checkInputResult),
            new TestVO("Check btnReset click...", clickButton, checkButtonResult)
        ];
    };
};
DataBindingExCtrl.$inject = [ '$scope', 'TestUtils' ];

/** expressions_ex controller */
var ExpressionsExCtrl = function($scope, testUtils) {

    var initTableValues = function(pPrice, pQty) {
        var scope = testUtils.getElementScope('products');
        if (scope) {
            scope.price = pPrice;
            scope.qty = pQty;

            // Second question, with a complex object.
            if (scope.product != undefined) {
                scope.product.price = pPrice;
                scope.product.qty = pQty;
            }
        }
    };

    var checkTableValues = function(pPrice, pQty, pTotal) {
        testUtils.expectTrue(testUtils.hasInnerHTML("price", pPrice),
            "Price value is not binded to column 'price'.");
        testUtils.expectTrue(testUtils.hasInnerHTML("qty", pQty),
            "Quantity value is not binded to column 'qty'.");
        testUtils.expectTrue(testUtils.hasInnerHTML("total", pTotal),
            "Total value is not binded to column 'total'.");
    };

    $scope.getTests = function() {
        return [
            new TestVO("Check columns bindings...", function() {
                initTableValues(285, 12);
            }, function() {
                checkTableValues("285", "12", "3420");
            }),
            new TestVO("Check columns bindings with other values...", function() {
                initTableValues(481, 54);
            }, function() {
                checkTableValues("481", "54", "25974");
            })
        ];
    };
};
ExpressionsExCtrl.$inject = [ '$scope', 'TestUtils' ];


/** watch_ex controller */
var WatchExCtrl =  function($scope, testUtils) {

    var initProduct = function() {
        var scope = testUtils.getElementScope('productForm');
        if (scope && scope.product) {
            scope.product.name = "TestProduct";
            scope.product.price = 58;
            scope.product.qty = 21;
        }
    };

    var checkInputs = function() {
        testUtils.expectTrue(testUtils.hasValue("inputName", "TestProduct"),
            "Name value is not binded to text field 'inputName'.");
        testUtils.expectTrue(testUtils.hasValue("inputPrice", "58"),
            "Price value is not binded to text field 'inputPrice'.");
        testUtils.expectTrue(testUtils.hasValue("inputQty", "21"),
            "Qty value is not binded to text field 'inputQty'.");
    };

    var changeInputValues = function(pName, pPrice, pQty) {
        testUtils.changeInputModel("inputName", pName);
        testUtils.changeInputModel("inputPrice", pPrice);
        testUtils.changeInputModel("inputQty", pQty);
    };

    var checkErrorMsgIsDisplayed = function(pMsg) {
        testUtils.expectTrue(testUtils.hasInnerHTML("errorMsg", "All fields are mandatory!"),
            "Mandatory message sould be displayed with empty values.");
    };

    var checkErrorMsgIsNotDisplayed = function(pMsg) {
        testUtils.expectTrue(testUtils.hasNotInnerHTML("errorMsg", "All fields are mandatory!"),
            "Mandatory message sould be hidden, because all fields have non null values.");
    };

    $scope.getTests = function() {
        return [
            new TestVO("Check input bindings...", initProduct, checkInputs),
            new TestVO("Check if error msg is hidden...", function() {
                changeInputValues("Product", 50, 1);
            }, checkErrorMsgIsNotDisplayed),
            new TestVO("Check if error msg is displayed...", function() {
                changeInputValues("", null, null);
            }, checkErrorMsgIsDisplayed)
        ];
    };
};
WatchExCtrl.$inject = [ '$scope', 'TestUtils' ];



/** controller_ex controller */
var ControllerExCtrl =  function($scope, testUtils) {

    var checkCurrentUser = function() {
        testUtils.expectTrue(testUtils.hasInnerHTML("mainApp", "BobSponge"),
            "MainCtrl has not been linked correctly.");
    };

    var checkUserMails = function() {
        testUtils.expectTrue(testUtils.hasInnerHTML("mainApp", "have 1 mail"),
            "MailCtrl has not been linked correctly.");
    };

    var checkProfileView = function() {
        testUtils.expectTrue(testUtils.hasValue("inputLogin", "BobSponge"),
            "EditCtrl has not been linked correctly.");
    };

    $scope.getTests = function() {
        return [
            new TestVO("Check currentUser...", null, checkCurrentUser),
            new TestVO("Check user mails...", null, checkUserMails),
            new TestVO("Check profile view...", null, checkProfileView)
        ];
    };
};
ControllerExCtrl.$inject = [ '$scope', 'TestUtils' ];

/** http_ex controller */
var HttpExCtrl = function($scope, testUtils) {

    var nbUsers = null;
    var scope = null;

    var callGetNbUsers = function() {
        scope = testUtils.getElementScope("userPanel");
        if (scope) {
            testUtils.expectTrue(scope.getNbUsers != undefined, "UserCtrl should have a $scope.getNbUsers() function.");
            if (scope.getNbUsers != undefined) {
                var promise = scope.getNbUsers();
                testUtils.expectTrue(promise != undefined && promise.then != undefined, "Function getNbUsers() should return a promise ($http.get).");
                if (promise != undefined && promise.then != undefined) {
                    promise.then(function(result) {
                        nbUsers = result && result.data ? result.data.length : null;
                    });
                    return promise;
                }
            }
        }
    };

    var checkGetNbUsers = function() {
        testUtils.expectTrue(nbUsers == 2, "result.data.length from $http.get() in getNbUsers() should be 2.");
    };

    var callAsynchGetNbUsers = function() {
        nbUsers = null;
        if (scope) {
            testUtils.expectTrue(scope.asynchGetNbUsers != undefined, "UserCtrl should have a $scope.asynchGetNbUsers() function.");
            if (scope.asynchGetNbUsers != undefined) {
                var promise = scope.asynchGetNbUsers();
                testUtils.expectTrue(promise != undefined && promise.then != undefined, "Function asynchGetNbUsers() should return a promise ($timeout).");
                if (promise != undefined && promise.then != undefined) {
                    promise.then(function(result) {
                        nbUsers = result;
                    });
                    return promise;
                }
            }
        }
    };

    var checkAsynchGetNbUsers = function() {
        testUtils.expectTrue(nbUsers == 2, "Result returned in the resolve() from asynchGetNbUsers() should be 2.");
    };

    $scope.getTests = function() {
        return [
            new TestVO("Check getNbUsers function...", callGetNbUsers, checkGetNbUsers),
            new TestVO("Check asynchGetNbUsers function...", callAsynchGetNbUsers, checkAsynchGetNbUsers)
        ];
    };
};
HttpExCtrl.$inject = ['$scope', 'TestUtils'];
