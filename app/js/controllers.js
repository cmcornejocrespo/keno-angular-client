'use strict';

/* Controllers */

/**
 * This controller manages the interaction with the selections of the board
 * @param $scope
 * @param sharedService
 * @param popUpService
 * @constructor
 */
function NumbersTableCtrl($scope, sharedService, popUpService) {

    $scope.played = false;
    $scope.numbersTable = sharedService.numbersTable;

    var numOfRows = sharedService.getNumberOfRowsToShow();

    for (var r = 0; r < numOfRows; r++) {
        $scope.numbersTable[r] = [];
    }
    var rowIndex = 0;

    for (var i = 1; i <= sharedService.MAX_NUMBERS; i++) {
        $scope.numbersTable[rowIndex].push({number: i, class: "number", selected: false});
        if (i % sharedService.MAX_COLS == 0) {
            rowIndex++;
        }
    }

    $scope.select = function (item) {

        var selectedNumber = item.number;

        if (selectedNumber in sharedService.selectedNumbers) {

            delete sharedService.selectedNumbers[selectedNumber];
        } else {

            if (_.size(sharedService.selectedNumbers) >= sharedService.MAX_SELECTIONS) {

                alert("You can select a maximum of " + sharedService.MAX_SELECTIONS + " number.")
            } else {

                sharedService.selectedNumbers[selectedNumber] = true;
                popUpService.showPayoutPanel();
            }
        }

    }

    $scope.getStyle = function (item) {

        var number = item.number;
        if (number in sharedService.selectedNumbers & number in sharedService.resultNumbers) {
            return "btn-success";
        } else if (number in sharedService.resultNumbers) {
            return "btn-warning";
        } else if (number in sharedService.selectedNumbers) {
            return "btn-info";
        }
    }

}

/**
 * This controller represents the interaction with the play buttons
 * @param $scope
 * @param sharedService
 * @param popUpService
 * @param animationService
 * @constructor
 */
function ButtonsCtrl($scope, sharedService, popUpService, animationService) {

    $scope.open = function () {
        $scope.shouldBeOpen = true;
        $scope.message = "Please select at least " + sharedService.MIN_SELECTIONS + " number";
    };

    $scope.close = function () {
        $scope.shouldBeOpen = false;
    };

    $scope.opts = {
        backdropFade: true,
        dialogFade: true
    };

    $scope.stake = sharedService.stake;
    $scope.numbersTable = sharedService.numbersTable;

    $scope.play = function () {
        if (_.size(sharedService.selectedNumbers) >= sharedService.MIN_SELECTIONS) {

            animationService.clear();
            sharedService.balance -= sharedService.stake;
            sharedService.resultNumbers = {};
            popUpService.hidePayoutPanel();
            sharedService.played = true;

            sharedService.generateResults($scope, animationService);

        } else {
            alert("Please select at least " + sharedService.MIN_SELECTIONS + " numbers.")
        }
    }

    $scope.clear = function () {

        sharedService.clear();
        popUpService.hidePayoutPanel();

        animationService.clear();
    }

    $scope.quickPick = function () {

        sharedService.clear();
        sharedService.generateQuickPick();
        popUpService.showPayoutPanel();
        animationService.clear();
    }


    $scope.isStake = function (stake) {
        if (sharedService.stake == stake) {
            return "btn-primary";
        } else {
            return "";
        }
    }

    $scope.setStake = function (stake) {
        sharedService.stake = stake;
    }

    $scope.getWinningAmount = function () {
        return sharedService.winnings;
    }
}

/**
 *
 * This controller represents the life cycle of the game
 * @param $scope
 * @param evolveGamingKenoService
 * @param sharedService
 * @constructor
 */
function EvolveGamingCtrl($scope, evolveGamingKenoService, sharedService) {

    $scope.selectedNumbers = sharedService.selectedNumbers;

    sharedService.payoutTable = evolveGamingKenoService.getGameConfiguration();

    $scope.getSpotsSelect = function () {

        var numSpotsSelected = _.size(sharedService.selectedNumbers);

        var temp = new Array();

        if (numSpotsSelected != null && numSpotsSelected != '') {
            var payouts = sharedService.payoutTable.payouts;


            for (var i = 0; i < payouts.length; i++) {
                if (payouts[i].numSpots == numSpotsSelected) {
                    sharedService.currentPayoutTable = payouts[i].numMatches;
                    return payouts[i].numMatches;
                }
            }
        }
        return temp;
    }
}

function BalanceCtrl($scope, sharedService) {

    $scope.getBalance = function () {
        return sharedService.balance
    };
}

function PanelCtrl($scope, popUpService, sharedService) {

    $scope.balance = sharedService.balance;


    $scope.showRightPanel = function () {
        $scope.isOpen = true;
    };

    $scope.hideRightPanel = function () {
        popUpService.hideRightPanel();
    };

    $scope.showLeftPanel = function () {
        popUpService.isUserPanelOpen = true;

    };
    $scope.hideLeftPanel = function () {
        popUpService.isUserPanelOpenOpen = false;
    };
    $scope.showPayoutPanel = function () {
        popUpService.isPayoutPanelOpen = true;

    };
    $scope.hidePayoutPanel = function () {
        popUpService.isPayoutPanelOpen = false;
    };

}

/**
 * This controller deals with the logic of the accordion created in the userPanel
 * @param $scope
 * @constructor
 */
function AccordionCtrl($scope) {
    $scope.oneAtATime = true;

    $scope.groups = [
        {
            title: "Dynamic Group Header - 1",
            content: "Dynamic Group Body - 1"
        },
        {
            title: "Dynamic Group Header - 2",
            content: "Dynamic Group Body - 2"
        }
    ];

}

/**
 * Injections area
 * @type {Array}
 */
ButtonsCtrl.$inject = ['$scope', 'kenoGameService', 'popUpService', 'animationService'];
NumbersTableCtrl.$inject = ['$scope', 'kenoGameService', 'popUpService'];
EvolveGamingCtrl.$inject = ['$scope', 'evolveGamingKenoService', 'kenoGameService'];
PanelCtrl.$inject = ['$scope', 'popUpService', 'kenoGameService'];
AccordionCtrl.$inject = ['$scope'];
BalanceCtrl.$inject = ['$scope', 'kenoGameService'];
