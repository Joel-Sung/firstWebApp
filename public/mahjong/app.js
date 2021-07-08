var app = angular.module('mahjongApp', ['ngRoute', 'ngAnimate', 'ngSanitize', 
    'initializeCtrl', 'gameCtrl', 'statsCtrl']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
	$routeProvider
		.when('/initialize', {
			templateUrl: './initialize.html',
			controller: 'InitializeCtrl'
		})
        .when('/game', {
            templateUrl: './game.html',
			controller: 'GameCtrl'
        })
        .when('/stats', {
            templateUrl: './stats.html',
			controller: 'StatsCtrl'
        })
		.otherwise({
			redirectTo: '/initialize'
		});
}]);

app.controller('mahjongCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {

    $scope.fengs = ['东', '南', '西', '北'];
    $scope.colors = ['red', 'blue', 'green', 
                    'yellow', 'orange', 'purple',
                    'pink', 'brown', 'grey'];
    $scope.strongColors = ['strongred', 'strongblue', 'stronggreen', 
                        'strongyellow', 'strongorange', 'strongpurple',
                        'strongpink', 'strongbrown', 'stronggrey'];
    
}]);

app.factory('sharedVariables', function() {
    return {
        playerColors: ['red', 'blue', 'green', 'yellow'],

        tai: 0.1,
        players: [],
        playerData: [],
        totalRounds: 1,
        diaoZheng: [0, 0, 0, 0],
        totalDraws: 0,
        totalReShuffles: 0,
        gameEnd: false,

        zhuang: 0,
        tableFeng: 0,

        zhaHu: [0, 0, 0, 0],
        flowerWins: [0, 0, 0, 0],

        events: [],
    }
})

app.directive("currency", function() {
	return {
		link: function(scope, element, attributes) {
			element.on("keydown keyup", function(e) {
                if (element.val().toString().split('.')[1].length > 2 &&
					e.keyCode != 46 // delete
					&&
					e.keyCode != 8 // backspace
				) { 
					e.preventDefault();
					element.val(Number(element.val()).toFixed(2));
				} 
			});
		}
	};
});

app.filter('filterOwnIndex', function() {
    return function(input, parentIndex) {
        // alert(parentIndex)
        var output = [];
        for (i = 0; i < input.length; i++) {
            if (i !== parentIndex) {
                output.push(input[i]);
            }
        }
        return output;
    }
})