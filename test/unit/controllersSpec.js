'use strict';

var response = {"highNumberOnCard": 80,
    "numberOfDraws": 10,
    "payouts": [
        {
            "numSpots": 1,
            "numMatches": [
                {
                    "id": 1,
                    "match": 1,
                    "multiplier": 3
                }
            ]
        },
        {
            "numSpots": 2,
            "numMatches": [
                {
                    "id": 2,
                    "matches": 2,
                    "multiplier": 12
                }
            ]
        },
        {
            "numSpots": 3,
            "numMatches": [
                {
                    "id": 3,
                    "matches": 3,
                    "multiplier": 42
                },
                {
                    "id": 4,
                    "matches": 2,
                    "multiplier": 1
                }
            ]
        },
        {
            "numSpots": 4,
            "numMatches": [
                {
                    "id": 5,
                    "numMatches": 4,
                    "multiplier": 120
                }
                ,
                {
                    "id": 5,
                    "numMatches": 3,
                    "multiplier": 3
                },
                {
                    "id": 6,
                    "numMatches": 2,
                    "multiplier": 1
                }
            ]

        }
    ]
};

///* jasmine specs for controllers go here */
//describe('PhoneCat controllers', function () {
//
//    beforeEach(function () {
//        this.addMatchers({
//            toEqualData: function (expected) {
//                return angular.equals(this.actual, expected);
//            }
//        });
//    });
//
//
//    beforeEach(module('phonecatServices'));
//
//
//    describe('PhoneListCtrl', function () {
//        var scope, ctrl, $httpBackend;
//
//        beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
//            $httpBackend = _$httpBackend_;
//            $httpBackend.expectGET('phones/phones.json').
//                respond([
//                    {name: 'Nexus S'},
//                    {name: 'Motorola DROID'}
//                ]);
//
//            scope = $rootScope.$new();
//            ctrl = $controller(PhoneListCtrl, {$scope: scope});
//        }));
//
//
//        it('should create "phones" model with 2 phones fetched from xhr', function () {
//            expect(scope.phones).toEqual([]);
//            $httpBackend.flush();
//
//            expect(scope.phones).toEqualData(
//                [
//                    {name: 'Nexus S'},
//                    {name: 'Motorola DROID'}
//                ]);
//        });
//
//
//        it('should set the default value of orderProp model', function () {
//            expect(scope.orderProp).toBe('age');
//        });
//    });
//
//
//    describe('PhoneDetailCtrl', function () {
//        var scope, $httpBackend, ctrl,
//            xyzPhoneData = function () {
//                return {
//                    name: 'phone xyz',
//                    images: ['image/url1.png', 'image/url2.png']
//                }
//            };
//
//
//        beforeEach(inject(function (_$httpBackend_, $rootScope, $routeParams, $controller) {
//            $httpBackend = _$httpBackend_;
//            $httpBackend.expectGET('phones/xyz.json').respond(xyzPhoneData());
//
//            $routeParams.phoneId = 'xyz';
//            scope = $rootScope.$new();
//            ctrl = $controller(PhoneDetailCtrl, {$scope: scope});
//        }));
//
//
//        it('should fetch phone detail', function () {
//            expect(scope.phone).toEqualData({});
//            $httpBackend.flush();
//
//            expect(scope.phone).toEqualData(xyzPhoneData());
//        });
//    });
//});

describe('Evolve Gaming controller', function () {


    describe('EvolveGamingCtrl', function () {
        var scope, ctrl, $httpBackend;

        beforeEach(module('underscore'));

        beforeEach(inject(function (_$httpBackend_, $rootScope, $controller,_) {
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET('backend/backend1.json').
                respond(response);

            scope = $rootScope.$new();
            ctrl = $controller(EvolveGamingCtrl, {$scope: scope});
            $httpBackend.flush();
        }));


        it('should create "payoutTable" model some JSON info from xhr', function () {
            expect(scope.payoutTable).toBeDefined();
            expect(scope.payoutTable).toEqual(response);
        });


        it('the scope should contain a list of payouts', function () {
            expect(scope.getPayoutValues(jasmine.any(Number))).toEqual(jasmine.any(Array));
        });

        it('should return an array given any number', function () {
            var spots = 3;
            expect(scope.getSpotsSelect(jasmine.any(Number))).toEqual(jasmine.any(Array));
        });

        it('should return an array with lenght 2 given a spotNumber that exists', function () {
            var spots = 3;
            expect(scope.getSpotsSelect(spots)).toEqual(jasmine.any(Array));
            expect(scope.getSpotsSelect(spots).length).toBe(2);
        });

    });

});
