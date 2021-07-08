var initialize = angular.module('initializeCtrl', []);

initialize.controller('InitializeCtrl', ['$scope', '$timeout', '$location', 'sharedVariables',
    function($scope, $timeout, $location, sharedVariables) {

    $scope.newGameStep = true;
    $scope.goNamesStep = function() {
        $scope.newGameStep = false;
        $scope.namesStep = true;
    }

    $scope.namesStep = false;
    $scope.playersTemp = ['P1', 'P2','P3', 'P4'];
    $scope.confirmNames = function() {
        if ($scope.playersTemp.indexOf('') !== -1) {
            // alert('Give everyone a name please.');
            $scope.namesStep = false;
            $scope.rollDiceStep = true;
        } else {
            for (i = 0; i < 4; i++) {
                $scope.dice.push({
                    value: 0,
                    rolling: false,
                    rolled: false,
                    player: $scope.playersTemp[i]
                });
            }
            $scope.namesStep = false;
            $scope.rollDiceStep = true;
        }
    }

    $scope.rollDiceStep = false;
    $scope.diceEqual = true;
    $scope.dice = [];
    $scope.rollDice = function(number) {
        $scope.dice[number].rolling = true;
        var val = getDiceResult();
        var reroll = false;
        // Prevent duplicates
        for (i = 0; i < 4; i++) {
            if (i === number) continue;
            if (val === $scope.dice[i].value) {
                reroll = true;
            }
        }
        if (reroll) {
            $scope.rollDice(number);
        } else {
            $scope.dice[number].value = val;
            $timeout(() => showResult(number), 2000);
        }
    }
    function getDiceResult() {
        return getRndInteger(1, 7) + getRndInteger(1, 7) + getRndInteger(1, 7);
    }
    function getRndInteger(min, max) { // min inclusive, max exclusive
        return Math.floor(Math.random() * (max - min)) + min;
    }
    function showResult(number) {
        $scope.dice[number].rolling = false;
        $scope.dice[number].rolled = true;
        if ($scope.dice[0].rolled && $scope.dice[1].rolled && $scope.dice[2].rolled && $scope.dice[3].rolled) {
            $scope.diceEqual = false;
        }
    }
    $scope.usePhysicalDice = function() {
        $scope.rollDiceStep = false;
        $scope.physicalDiceStep = true;
    }
    $scope.goChooseFengStep = function() {
        for (i = 0; i < 4; i++) {
            for (j = i + 1; j < 4; j++) {
                if ($scope.dice[i].value < $scope.dice[j].value) {
                    var temp = $scope.dice[j];
                    $scope.dice[j] = $scope.dice[i];
                    $scope.dice[i] = temp;
                }
            }
            $scope.playersTemp[i] = $scope.dice[i].player;         
        }
        $scope.rollDiceStep = false;
        $scope.chooseFengStep = true;
    }

    $scope.physicalDiceStep = false;
    $scope.goSetTaiStepV2 = function() {
        for (i = 0; i < 4; i++) {
            sharedVariables.players[i] = $scope.playersTemp[i];
        }
        $scope.physicalDiceStep = false;
        $scope.setTaiStep = true;
    }

    $scope.chooseFengStep = false;
    $scope.fengNotChosen = true;
    $scope.playerTurn = 0;
    $scope.tiles = ['', '', '', ''];
    $scope.clicked = [false, false, false, false];
    $scope.getFeng = function(tileIndex) {
        var tileValue = getRndInteger(0, 4 - $scope.playerTurn);
        while($scope.tiles.indexOf(tileValue) !== -1) {
            if (tileValue === 3) {
                tileValue = 0;
            } else {
                tileValue++;
            }
        }
        $scope.tiles[tileIndex] = tileValue;
        $scope.clicked[tileIndex] = true;
        sharedVariables.players[tileValue] = $scope.playersTemp[$scope.playerTurn];
        $scope.playerTurn++;
        if ($scope.playerTurn === 4) {
            $scope.fengNotChosen = false;
        }
    }
    $scope.goSetTaiStep = function() {
        $scope.chooseFengStep = false;
        $scope.setTaiStep = true;
    }

    $scope.tai = sharedVariables.tai;
    $scope.setTaiStep = false;
    $scope.goMainGame = function() {
        if ($scope.tai < 0.1) {
            alert('One Tai has to be at least $0.10.');
        } else {
            sharedVariables.tai = $scope.tai;
            initPlayerData();
            $location.path('game');
        }
    }

    function initPlayerData() {
        for (i = 0; i < 4; i++) {
            sharedVariables.playerData.push({
                name: sharedVariables.players[i],
                currentFeng: i,
                net: 0,
                // Current game state
                flowersTaken: [],
                redBlueFlowers: [false, false], // [0]: Took all red flowers [1]: Took all blue flowers
                flowersAvailable: [true, true, true, true, true, true], // [6]: 4 players & all red & all blue 
                flowerButton: true,
                animalsTaken: 0,
                // Ng-show
                default: true,
                chooseTai: false,
                chooseShooter: false,
                flower: false,
                gang: false,
                animal: false, 
                // Stats
                wins: [[0,0,0,0,0,0],
                        [0,0,0,0,0,0],
                        [0,0,0,0,0,0],
                        [0,0,0,0,0,0], // [4]: 3 other players + zi mo (own index), [6]: 1 to 5 tai & total wins
                        [0,0,0,0,0], // [5]: Total wins for each Tai
                        0], //Overall wins
                winWinnings: 0,
                flowers: [[0,0,0,0,0],
                        [0,0,0,0,0], // [2]: draw flower & flower from hand, [5]: 1 to 4 flower & total
                        [0,0]], // [2]: All red flowers & all blue flowers
                flowerWinnings: 0,
                gangs: [[0,0,0,0], // [4]: 3 other players & total
                        [0,0]], // [2]: Draw & from hand
                gangWinnings: 0,
                animals: [0,0,0], // 2 - draw & from hand & total
                animalWinnings: 0,
                zhuangCount: 0
            });
        }
    }
}]);