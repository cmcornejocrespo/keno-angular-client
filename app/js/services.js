'use strict';

angular.module('kenoGameServices', ['ngResource'])
    .factory('kenoGameService', function ($timeout) {
        var sharedService = {};

        sharedService.numbersTable = {};
        sharedService.selectedNumbers = {};
        sharedService.resultNumbers = {};
        sharedService.played = false;
        sharedService.stake = 1;
        sharedService.balance = 500;

        sharedService.MAX_NUMBERS = 80;
        sharedService.MAX_COLS = 10;
        sharedService.MAX_RESULTS = 20;
        sharedService.MAX_SELECTIONS = 10;
        sharedService.MIN_SELECTIONS = 1;

        sharedService.currentPayoutTable = {};
        sharedService.winnings = 0;

        sharedService.getNumberOfRowsToShow = function () {
            return sharedService.MAX_NUMBERS / sharedService.MAX_COLS;
        };

        sharedService.clear = function () {

            sharedService.selectedNumbers = {};
            sharedService.resultNumbers = {};
            sharedService.played = false;
        }

        sharedService.generateResults = function ($scope, animationService) {

            var newNumber = _.random(1, sharedService.MAX_NUMBERS);
            while (newNumber in sharedService.resultNumbers) {
                newNumber = _.random(1, sharedService.MAX_NUMBERS);
            }

            var winner = (newNumber in sharedService.selectedNumbers);
            console.log('#' + newNumber + ' is ' + winner);
            animationService.extractNumber(newNumber, winner);

            $timeout(function () {
                sharedService.resultNumbers[newNumber] = true;

                if (_.size(sharedService.resultNumbers) < sharedService.MAX_RESULTS) {
                    sharedService.generateResults($scope, animationService);
                } else {
                    sharedService.updateBalance();
                }
            }, 1000);
        }

        sharedService.generateQuickPick = function () {

            var newNumber = _.random(1, sharedService.MAX_NUMBERS);
            while (newNumber in sharedService.selectedNumbers) {
                newNumber = _.random(1, sharedService.MAX_NUMBERS);
            }

            $timeout(function () {

                sharedService.selectedNumbers[newNumber] = true;

                if (_.size(sharedService.selectedNumbers) < sharedService.MAX_SELECTIONS) {
                    sharedService.generateQuickPick();
                }
            }, 100);
        }

        sharedService.updateBalance = function () {

            var winnings = 0;
            var multiplier = 0;
            for (var selectedNumber in sharedService.selectedNumbers) {

                if (selectedNumber in sharedService.resultNumbers) {
                    winnings++;
                }
            }
            for (var p = 0; p < sharedService.currentPayoutTable.length; p++) {
                var payout = sharedService.currentPayoutTable[p];
                if (payout.match == winnings) {
                    multiplier = payout.multiplier;
                }
            }

            var pay = sharedService.stake * multiplier;
            sharedService.winnings = pay;
            sharedService.balance += pay;
        }

        return sharedService;
    })
    .factory('animationService', function () {

        var animations = {};

        animations.CONTAINER_HEIGHT = 250;
        animations.BALL_SIZE = 20;
        animations.TUBES_DISTANCE = 40;
        animations.NUMBERS = 80;

        animations._counter;
        animations._extractedBalls;
        animations._maxExtraction;
        animations._container;


        animations.initAnimation = function (maxExtraction, container) {
            animations._maxExtraction = maxExtraction;
            animations._counter = [];
            animations._extractedBalls = [];
            animations._container = container;

            for (var i = 1; i <= animations.NUMBERS; i++) {
                var ballDiv = $('<div></div>');
                ballDiv.addClass('ball');
                ballDiv.text(i);
                ballDiv.attr('id', 'ball' + i);
                container.append(ballDiv);
            }
        }
        animations.initAnimation(20, $('#animation'));

        animations.extractNumber = function (number, winner) {

            var tube = _.random(0, 1);
            if (animations._counter[tube] == null) {
                animations._counter[tube] = 0;
            }
            if (animations._counter[tube] >= (animations._maxExtraction / 2)) {
                if (tube == 0) {
                    tube = 1;
                } else {
                    tube = 0;
                }
            }
            var hPos = 40 + (tube * animations.TUBES_DISTANCE);
            var vPos = animations.CONTAINER_HEIGHT - (animations._counter[tube] * animations.BALL_SIZE);
            var ball = $('#ball' + number);

            ball.css({top: '0px', left: hPos + 'px', display: 'inline-block'});
            if (winner) {
                ball.addClass("winner");
            }
            ball.animate({
                'top': vPos + 'px'
            }, 500);
            ball.animate({
                'top': '-=10px'
            }, 100);
            ball.animate({
                'top': '+=10px'
            }, 100);
            ball.animate({
                'top': '-=5px'
            }, 100);
            ball.animate({
                'top': '+=5px'
            }, 100);

            animations._extractedBalls.push(ball);
            animations._counter[tube]++;
        }

        animations.clear = function () {

            animations._counter = [0, 0];
            for (var b = 0; b < animations._extractedBalls.length; b++) {
                var ball = animations._extractedBalls[b];
                ball.css({display: 'none'});
                ball.removeClass('winner');
            }
        }

        return animations;
    })
    .factory('evolveGamingKenoService', function ($resource) {
        return $resource('http://10.64.4.77\\:8080/CasinoProxy/rest/keno/gameconfiguration\\/', {}, {
            getGameConfiguration: {method: 'GET'}
        });
    })
    .factory('popUpService', function () {

        var service = {};

        service = {};
        service.isUserPanelOpen = false;
        service.isPayoutPanelOpen = false;

        service.showPayoutPanel = function () {
            service.isPayoutPanelOpen = true;

        }

        service.hidePayoutPanel = function () {
            service.isPayoutPanelOpen = false;
        }

        service.getLeftPanelClass = function () {
            if (service.isUserPanelOpen) {
                return "leftPanel";
            } else {
                return "leftPanelHidden";
            }
        }

        service.getPayoutPanelClass = function () {
            if (service.isPayoutPanelOpen) {
                return "payoutPanel";
            } else {
                return "payoutPanelHidden";
            }
        }
        return service;
    });
;

