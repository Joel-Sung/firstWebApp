var game = angular.module('gameCtrl', []);

game.controller('GameCtrl', ['$scope', '$location', 'sharedVariables', '$rootScope',
    function($scope, $location, sharedVariables, $rootScope) {

    function init() {
        $scope.tai = sharedVariables.tai;
        $scope.players = sharedVariables.players;
        $scope.playerData = sharedVariables.playerData;
        $scope.totalRounds = sharedVariables.totalRounds;
        $scope.diaoZheng = sharedVariables.diaoZheng;
        $scope.totalDraws = sharedVariables.totalDraws;
        $scope.totalReShuffles = sharedVariables.totalReShuffles;
        $scope.gameEnd = sharedVariables.gameEnd;
        $scope.playerColors = sharedVariables.playerColors;
        $scope.zhaHu = sharedVariables.zhaHu;
        $scope.flowerWins = sharedVariables.flowerWins;
        $scope.zhuang = sharedVariables.zhuang;
        $scope.tableFeng = sharedVariables.tableFeng;
        $scope.events = sharedVariables.events;
    }
    init();

    $scope.showColors = [false,false,false,false];
    $scope.chooseColor = function(index) {
        $scope.showColors[index] = true;
    }
    $scope.confirmColor = function(player, color) {
        $scope.playerColors[player] = $scope.colors[color];
        $scope.showColors[player] = false;
    }

    $scope.action = false;
    $scope.goDefault = function(index) {
        $scope.action = false;
        $scope.taiWon = 0;
        $scope.fromHand = false;

        $scope.playerData[index].default = true;
        $scope.playerData[index].chooseTai = false;
        $scope.playerData[index].chooseShooter = false;
        $scope.playerData[index].flower = false;
        $scope.playerData[index].gang = false;
        $scope.playerData[index].animal = false;
    }
    // Win Action
    $scope.taiWon = 0;
    $scope.getWin = function(index) {
        $scope.action = true;
        $scope.playerData[index].default = false;
        $scope.playerData[index].chooseTai = true;
    }
    $scope.getShooter = function(index, taiWon) {
        $scope.taiWon = taiWon;
        $scope.playerData[index].chooseTai = false;
        $scope.playerData[index].chooseShooter = true;
    }
    $scope.confirmWin = function(winner, shooter) {
        updateWin(winner, shooter, $scope.taiWon, 'win');
        $scope.goDefault(winner);
    }
    function updateWin(winner, payer, taiWon, event, zhuang) {
        var winnings = $scope.tai * Math.pow(2, taiWon);
        if (event === 'win') {
            if (winner === payer) {
                allPayOne(winner, winnings);
                $scope.playerData[winner].winWinnings += winnings * 3;
            } else {
                onePayOne(winner, payer, winnings * 2);
                $scope.playerData[winner].winWinnings += winnings * 2;
            }
            $scope.playerData[winner].wins[payer][taiWon - 1]++; // win against player
            $scope.playerData[winner].wins[payer][5]++; // total wins against player
            $scope.playerData[winner].wins[4][taiWon - 1]++; // total tai wins
            $scope.playerData[winner].wins[5]++; // total wins
            insertRoundData();
            $scope.events.push({
                name: 'win',
                winner: winner,
                payer: payer,
                taiWon: taiWon,
                zhuang: $scope.zhuang
            });
            nextRound(winner);
        } else if (event === 'undo') {
            if (winner === payer) {
                onePayAll(winner, winnings);
                $scope.playerData[winner].winWinnings -= winnings * 3;
            } else {
                onePayOne(payer, winner, winnings * 2);
                $scope.playerData[winner].winWinnings -= winnings * 2;
            }
            if (winner !== zhuang) {
                // Reduce zhuang only if win is not diao zheng
                if ($scope.zhuang === 0) {
                    $scope.zhuang = 3;
                } else {
                    $scope.zhuang--;
                }
            } else {
                $scope.diaoZheng[winner]--;
            }
            $scope.playerData[winner].wins[payer][taiWon - 1]--; // win against player
            $scope.playerData[winner].wins[payer][5]--; // total wins against player
            $scope.playerData[winner].wins[4][taiWon - 1]--; // total tai wins
            $scope.playerData[winner].wins[5]--; // total wins
        }
    }
    // Flower Action
    $scope.fromHand = false;
    $scope.getFlower = function(index) {
        $scope.action = true;
        $scope.playerData[index].default = false;
        $scope.playerData[index].flower = true;
    }
    $scope.changeFromHand = function () {
        $scope.fromHand = !$scope.fromHand;
    }
    $scope.confirmFlower = function(winner, flower) {
        if (flower === 'all red') {
            updateFlower(winner, flower, $scope.fromHand, 'all red', 'flower');
        } else if (flower === 'all blue') {
            updateFlower(winner, flower, $scope.fromHand, 'all blue', 'flower');
        } else {
            updateFlower(winner, flower, $scope.fromHand, null, 'flower');
        }
        $scope.goDefault(winner);
    }
    function updateFlower(winner, payer, fromHand, type, event) {
        var winnings = fromHand ? $scope.tai * 2 : $scope.tai;
        var updateStats = fromHand ? 1 : 0;
        if (event === 'flower') {
            if (type === null) {
                if (winner === payer) {
                    allPayOne(winner, winnings);
                    $scope.playerData[winner].flowerWinnings += winnings * 3;
                } else {
                    onePayOne(winner, payer, winnings);
                    $scope.playerData[winner].flowerWinnings += winnings;
                }
                $scope.playerData[winner].flowers[updateStats][payer]++; // flower against player
                $scope.playerData[winner].flowers[updateStats][4]++; // total flowers against player
                takeFlower(winner, payer, null);
            } else {
                allPayOne(winner, winnings);
                $scope.playerData[winner].flowerWinnings += winnings * 3;
                if (type === 'all red') {
                    $scope.playerData[winner].flowers[2][0]++; // total all red flowers
                    takeFlower(winner, null, 'all red');
                } else if (type === 'all blue') {
                    $scope.playerData[winner].flowers[2][1]++; // total all blue flowers
                    takeFlower(winner, null, 'all blue');
                }
            }
            $scope.events.push({
                name: 'flower',
                winner: winner,
                payer: payer,
                fromHand: fromHand,
                type: type
            });
            // Check for all flowers win
            if ($scope.playerData[winner].flowersTaken.length === 4 &&
                    $scope.playerData[winner].redBlueFlowers[0] &&
                    $scope.playerData[winner].redBlueFlowers[1]) {
                var cont = confirm('Confirm ' + $scope.playerData[winner].name + ' 八仙过海(got all 8 flowers)?');
                if (cont) {
                    $scope.flowerWins[winner]++;
                    updateWin(winner, winner, 5, 'win');
                    $scope.events.push({
                        name: 'flowerWin',
                    });
                } else {
                    $scope.undo();
                }
            }
        /* ----- undo ----- */
        } else if (event === 'undo') {
            if (type === null) {
                if (winner === payer) {
                    onePayAll(winner, winnings);
                    $scope.playerData[winner].flowerWinnings -= winnings * 3;
                } else {
                    onePayOne(payer, winner, winnings);
                    $scope.playerData[winner].flowerWinnings -= winnings;
                }
                if (fromHand) {
                    $scope.playerData[winner].flowers[1][payer]--; // flower against player
                    $scope.playerData[winner].flowers[1][4]--; // total flowers against player
                } else {
                    $scope.playerData[winner].flowers[0][payer]--; // flower against player
                    $scope.playerData[winner].flowers[0][4]--; // total flowers against player
                }
                undoTakeFlower(winner, payer, null);
            } else {
                onePayAll(winner, winnings);
                $scope.playerData[winner].flowerWinnings -= winnings * 3;
                if (type === 'all red') {
                    $scope.playerData[winner].flowers[2][0]--; // total all red flowers
                    undoTakeFlower(winner, null, 'all red');
                } else if (type === 'all blue') {
                    $scope.playerData[winner].flowers[2][1]--; // total all blue flowers
                    undoTakeFlower(winner, null, 'all blue');
                }
            }  
        } 
    }
    // Gang Action
    $scope.getGang = function(index) {
        $scope.action = true;
        $scope.playerData[index].default = false;
        $scope.playerData[index].gang = true;
    }
    $scope.confirmGang = function(winner, payer) {
        var first = $scope.gangCurrentRound ? false : true;
        if (first) $scope.gangCurrentRound = true;
        if (payer === 'draw after pong') {
            updateGang(winner, null, 'draw after pong', first, 'gang');
        } else if (payer === 'from hand') {
            updateGang(winner, null, 'from hand', first, 'gang');
        } else {
            updateGang(winner, payer, null, first, 'gang');
        }
        $scope.goDefault(winner);
    }
    function updateGang(winner, payer, type, first, event) {
        var winnings = $scope.tai;
        if (event === 'gang') {
            if (type === null) {
                var payerIndex = payer >= winner ? payer + 1 : payer;
                onePayOne(winner, payerIndex, winnings * 3);
                $scope.playerData[winner].gangWinnings += winnings * 3;
                $scope.playerData[winner].gangs[0][payer]++; // gang against player
                $scope.playerData[winner].gangs[0][3]++; // total gang against players
            } else if (type === 'draw after pong') {
                allPayOne(winner, winnings);
                $scope.playerData[winner].gangWinnings += winnings * 3;
                $scope.playerData[winner].gangs[1][0]++; // total gangs after pong
            } else if (type === 'from hand') {
                allPayOne(winner, winnings * 2);
                $scope.playerData[winner].gangWinnings += winnings * 2 * 3;
                $scope.playerData[winner].gangs[1][1]++; // total gangs from hand
            }
            $scope.events.push({
                name: 'gang',
                winner: winner,
                payer: payer,
                type: type,
                first: first
            });
        /* ----- undo ----- */
        } else if (event === 'undo') {
            if (type === null) {
                var payerIndex = payer >= winner ? payer + 1 : payer;
                onePayOne(payerIndex, winner, winnings * 3);
                $scope.playerData[winner].gangWinnings -= winnings * 3;
                $scope.playerData[winner].gangs[0][payer]--; // gang against player
                $scope.playerData[winner].gangs[0][3]--; // total gang against players
            } else if (type === 'draw after pong') {
                onePayAll(winner, winnings);
                $scope.playerData[winner].gangWinnings -= winnings * 3;
                $scope.playerData[winner].gangs[1][0]--; // total gangs after pong
            } else if (type === 'from hand') {
                onePayAll(winner, winnings * 2);
                $scope.playerData[winner].gangWinnings -= winnings * 2 * 3;
                $scope.playerData[winner].gangs[1][1]--; // total gangs from hand
            }
            if (first) $scope.gangCurrentRound = false;
        }
    }
    // Animal Action
    $scope.getAnimal = function(index) {
        $scope.action = true;
        $scope.playerData[index].default = false;
        $scope.playerData[index].animal = true;
    }
    $scope.confirmAnimal = function(winner, animal) {
        if (animal === 'draw') {
            updateAnimal(winner, 'draw', 'animal');
        } else if (animal === 'from hand') {
            updateAnimal(winner, 'from hand', 'animal');
        } 
        $scope.goDefault(winner);
    }
    function updateAnimal(winner, type, event) {
        var winnings = $scope.tai;
        if (event === 'animal') {
            if (type === 'draw') {
                allPayOne(winner, winnings);
                $scope.playerData[winner].animalWinnings += winnings * 3;
                $scope.playerData[winner].animals[0]++; // total animal draws
            } else if (type === 'from hand') {
                allPayOne(winner, winnings * 2);
                $scope.playerData[winner].animalWinnings += winnings * 2 * 3;
                $scope.playerData[winner].animals[1]++; // total animals from hand
            }
            $scope.playerData[winner].animals[2]++; // total animals
            takeAnimal(winner);
            $scope.events.push({
                name: 'animal',
                winner: winner,
                type: type
            });
        /* ----- undo ----- */
        } else if (event === 'undo') {
            if (type === 'draw') {
                onePayAll(winner, winnings);
                $scope.playerData[winner].animalWinnings -= winnings * 3;
                $scope.playerData[winner].animals[0]--; // total animal draws
            } else if (type === 'from hand') {
                onePayAll(winner, winnings * 2);
                $scope.playerData[winner].animalWinnings -= winnings * 2 * 3;
                $scope.playerData[winner].animals[1]--; // total animals from hand
            }
            $scope.playerData[winner].animals[2]--; // total animals
            undoTakeAnimal(winner);
        }
    }
    // Payment Functions
    function allPayOne(winner, amount) {
        for (i = 0; i < $scope.playerData.length; i++) {
            if (i !== winner) {
                $scope.playerData[i].net -= amount;
                $scope.playerData[winner].net += amount;
            }
        }
    }
    function onePayOne(winner, payer, amount) {
        $scope.playerData[payer].net -= amount;
        $scope.playerData[winner].net += amount;
    }
    function onePayAll(payer, amount) {
        for (i = 0; i < $scope.playerData.length; i++) {
            if (i !== payer) {
                $scope.playerData[i].net += amount;
                $scope.playerData[payer].net -= amount;
            }
        }
    }
    // Rounds tracking
    function nextRound(winner, zhaHu) {
        if (winner === $scope.zhuang && !zhaHu) {
            // Diao zheng
            $scope.diaoZheng[winner]++; // Diao zheng stats
        } else if ($scope.zhuang === 3 && $scope.tableFeng === 3) {
            // Finish game
            $scope.gameEnd = true;
            $scope.goStatsPage();
        } else {
            // Round moves
            if ($scope.zhuang === 3 ) {
                $scope.zhuang = 0;
                $scope.tableFeng++;
            } else {
                $scope.zhuang++;
            }
            for (i = 0; i < 4; i++) {
                if ($scope.playerData[i].currentFeng === 0) {
                    $scope.playerData[i].currentFeng = 3;
                } else {
                    $scope.playerData[i].currentFeng--;
                }
            }
        }
        $scope.totalRounds++;
        resetRound();
    }
    // Current round
    function takeFlower(winner, flower, type) {
        if (type === null) {
            var flowerNum = $scope.playerData[winner].currentFeng;
            var diff = 0;
            for (i = flowerNum; i <= 4; i++) {
                if (i > 3) i = 0;
                if (i === flower) break;
                diff++;
            }
            flowerNum += diff;
            if (flowerNum > 3) flowerNum -= 4;
            $scope.playerData[winner].flowersTaken.push(flowerNum + 1);
            // disable flower & all red and all blue for other players
            for (i = 0; i < 4; i++) {
                $scope.playerData[i].flowersAvailable[flower] = false;
                if (i !== winner) {
                    $scope.playerData[i].flowersAvailable[4] = false;
                    $scope.playerData[i].flowersAvailable[5] = false;
                }
            }
        } else {
            var index;
            if (type === 'all red') {
                $scope.playerData[winner].redBlueFlowers[0] = true;
                index = 4;
            } else if (type === 'all blue') {
                $scope.playerData[winner].redBlueFlowers[1] = true;
                index = 5;
            } 
            // disable all red / all blue for winner
            $scope.playerData[winner].flowersAvailable[index] = false;
            // disable other player flowers except all blue / all red
            for (i = 0; i < 4; i++) {
                if (i !== winner) {
                    for (j = 0; j < 4; j++) {
                        $scope.playerData[i].flowersAvailable[j] = false;
                    }
                    $scope.playerData[i].flowersAvailable[index] = false;
                }
            }
        }
    }
    function undoTakeFlower(winner, flower, type) {
        if (type === null) {
            var flowerNum = $scope.playerData[winner].currentFeng;
            var diff = 0;
            for (i = flowerNum; i <= 4; i++) {
                if (i > 3) i = 0;
                if (i === flower) break;
                diff++;
            }
            flowerNum += diff;
            if (flowerNum > 3) flowerNum -= 4;
            var toRemove = $scope.playerData[winner].flowersTaken.indexOf(flowerNum + 1);
            $scope.playerData[winner].flowersTaken.splice(toRemove, 1);
            // enable flower & all red and all blue for other players
            $scope.playerData[winner].flowersAvailable[flower] = true;
            // check if winner previously took all red/blue flowers
            var tookRedBlue = -1; // took neither
            if ($scope.playerData[winner].redBlueFlowers[0] && $scope.playerData[winner].redBlueFlowers[1]) {
                tookRedBlue = 2; // took both red and blue
            } else if ($scope.playerData[winner].redBlueFlowers[0]) {
                tookRedBlue = 0; // took red
            } else if ($scope.playerData[winner].redBlueFlowers[1]) {
                tookRedBlue = 1; // took blue
            }
            if (tookRedBlue !== 2) {
                for (i = 0; i < 4; i++) {
                    if (tookRedBlue === -1) {
                        $scope.playerData[i].flowersAvailable[flower] = true;
                        $scope.playerData[i].flowersAvailable[4] = true;
                        $scope.playerData[i].flowersAvailable[5] = true;
                    } else if (tookRedBlue === 0) {
                        $scope.playerData[i].flowersAvailable[5] = true;
                    } else if (tookRedBlue === 1) {
                        $scope.playerData[i].flowersAvailable[4] = true;
                    }
                }
            }
        } else {
            var index;
            var otherIndex;
            if (type === 'all red') {
                $scope.playerData[winner].redBlueFlowers[0] = false;
                index = 4;
                otherIndex = 5;
            } else if (type === 'all blue') {
                $scope.playerData[winner].redBlueFlowers[1] = false;
                index = 5;
                otherIndex = 4;
            } 
            // enable other player flowers
            for (i = 0; i < 4; i++) {
                // Do not enable flowers if another player has all flowers of the other color
                if ($scope.playerData[i].flowersAvailable[otherIndex] ||
                    $scope.playerData[i].redBlueFlowers[otherIndex - 4]) {
                    for (j = 0; j < 4; j++) {
                        // Do not enable flowers that winner has
                        if ($scope.playerData[winner].flowersTaken.indexOf(j + 1) === -1) {
                            $scope.playerData[i].flowersAvailable[j] = true;
                        } 
                    }
                }
                // Always enable flower of undo color
                $scope.playerData[i].flowersAvailable[index] = true;
            }
        }
    }
    $scope.totalAnimalsTaken = 0;
    $scope.noMoreAnimals = false;
    function takeAnimal(winner) {
        $scope.playerData[winner].animalsTaken++;
        $scope.totalAnimalsTaken++;
        if ($scope.totalAnimalsTaken === 2) {
            $scope.noMoreAnimals = true;
        }
    }
    function undoTakeAnimal(winner) {
        $scope.playerData[winner].animalsTaken--;
        $scope.totalAnimalsTaken--;
        $scope.noMoreAnimals = false;
    }
    function resetRound() {
        $scope.totalFlowersTaken = 0;
        $scope.noMoreFlowers = false;
        $scope.disableFlowers = [false, false, false, false, false, false];
        for (i = 0; i < 4; i++) {
            $scope.playerData[i].flowersTaken = [];
            $scope.playerData[i].redBlueFlowers = [false, false];
            $scope.playerData[i].flowersAvailable = [true, true, true, true, true, true];
            $scope.playerData[i].flowerButton = true;
            $scope.playerData[i].animalsTaken = 0;
        }
        $scope.totalAnimalsTaken = 0;
        $scope.noMoreAnimals = false;
        $scope.gangCurrentRound = false;
    }
    function insertRoundData() {
        var prevPlayerData = [{}, {}, {}, {}];
        for (i = 0; i < 4; i++) {
            prevPlayerData[i].currentFeng = $scope.playerData[i].currentFeng;
            prevPlayerData[i].flowersTaken = $scope.playerData[i].flowersTaken;
            prevPlayerData[i].redBlueFlowers = $scope.playerData[i].redBlueFlowers;
            prevPlayerData[i].flowersAvailable = $scope.playerData[i].flowersAvailable;
            prevPlayerData[i].flowerButton = $scope.playerData[i].flowerButton;
            prevPlayerData[i].animalsTaken = $scope.playerData[i].animalsTaken;
        }
        $scope.events.push({
            name: 'prevRoundState',
            tableFeng: $scope.tableFeng,
            playerData: prevPlayerData,
            totalAnimalsTaken: $scope.totalAnimalsTaken,
            noMoreAnimals: $scope.noMoreAnimals,
            gangCurrentRound: $scope.gangCurrentRound
        });
    }
    function undoRound(prev) {
        $scope.totalRounds--;
        $scope.tableFeng = prev.tableFeng
        for (i = 0; i < 4; i++) {
            $scope.playerData[i].currentFeng = prev.playerData[i].currentFeng;
            $scope.playerData[i].flowersTaken = prev.playerData[i].flowersTaken;
            $scope.playerData[i].redBlueFlowers = prev.playerData[i].redBlueFlowers;
            $scope.playerData[i].flowersAvailable = prev.playerData[i].flowersAvailable;
            $scope.playerData[i].flowerButton = prev.playerData[i].flowerButton;
            $scope.playerData[i].animalsTaken = prev.playerData[i].animalsTaken;
        }
        $scope.totalAnimalsTaken = prev.totalAnimalsTaken;
        $scope.noMoreAnimals = prev.noMoreAnimals;
        $scope.gangCurrentRound = prev.gangCurrentRound;
    }
    // Undo event
    $scope.undo = function() {
        if ($scope.events.length > 0) {
            var event = $scope.events.pop();
            if (event.name === 'win') {
                var prevRoundData = $scope.events.pop();
                undoRound(prevRoundData);
                updateWin(event.winner, event.payer, event.taiWon, 'undo', event.zhuang);
            } else if (event.name === 'flower') {
                updateFlower(event.winner, event.payer, event.fromHand, event.type, 'undo');
            } else if (event.name === 'gang') {
                updateGang(event.winner, event.payer, event.type, event.first, 'undo');
            } else if (event.name === 'animal') {
                updateAnimal(event.winner, event.type, 'undo');
            } else if (event.name === 'noWinner') {
                var prevRoundData = $scope.events.pop();
                undoRound(prevRoundData);
                undoNoWinner(event);
            } else if (event.name === 'flowerWin') {
                $scope.undo();
                $scope.undo();
            } else if (event.name === 'zhaHu') {
                var prevRoundData = $scope.events.pop();
                undoRound(prevRoundData);
                undoZhaHu(event.payer);
            } 
        }
    }
    // Special rounds
    $scope.gangCurrentRound = false;
    $scope.noWinner = function() {
        insertRoundData();
        $scope.events.push({
            name: 'noWinner',
            gangPrevRound: $scope.gangCurrentRound
        })
        if ($scope.gangCurrentRound) {
            nextRound(-1);
        } else {
            $scope.totalRounds++;
        }
        $scope.totalDraws++;
        resetRound();
    }
    function undoNoWinner(prev) {
        $scope.totalDraws--;
        if (prev.gangPrevRound) {
            $scope.zhuang--;
        }
    }
    $scope.reShuffle = function() {
        $scope.totalRounds++;
        $scope.totalReShuffles++;
        resetRound();
    }

    $scope.getZhaHu = function(payer) {
        var cont = confirm('Confirm ' + $scope.players[payer] + ' 詐胡?');
        if (cont) {
            onePayAll(payer, $scope.tai * Math.pow(2, 5) * 2);
            $scope.zhaHu[payer]++;
            insertRoundData();
            $scope.events.push({
                name: 'zhaHu',
                payer: payer
            });
            nextRound(payer, true);
        }
    }
    function undoZhaHu(payer) {
        allPayOne(payer, $scope.tai * Math.pow(2, 5) * 2);
        $scope.zhaHu[payer]--;
        $scope.zhuang--;
    }
    // Stats page button
    $scope.goStatsPage = function() {
        updateSharedVariables();
        $location.path('stats');
    }

    function updateSharedVariables() {
        sharedVariables.tai = $scope.tai;
        sharedVariables.players = $scope.players;
        sharedVariables.playerData = $scope.playerData;
        sharedVariables.totalRounds = $scope.totalRounds;
        sharedVariables.diaoZheng = $scope.diaoZheng;
        sharedVariables.totalDraws = $scope.totalDraws; 
        sharedVariables.totalReShuffles = $scope.totalReShuffles;
        sharedVariables.gameEnd = $scope.gameEnd;
        sharedVariables.playerColors = $scope.playerColors = sharedVariables.playerColors;
        sharedVariables.zhaHu = $scope.zhaHu;
        sharedVariables.flowerWins = $scope.flowerWins; 
        sharedVariables.zhuang = $scope.zhuang;
        sharedVariables.tableFeng = $scope.tableFeng;
        sharedVariables.events = $scope.events;
    }

}]);