var stats = angular.module('statsCtrl', []);

stats.controller('StatsCtrl', ['$scope', '$location', 'sharedVariables', '$rootScope',
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
        // $scope.zhuang = sharedVariables.zhuang;
        // $scope.tableFeng = sharedVariables.tableFeng;
        // $scope.events = sharedVariables.events;
    }
    init();

    new Chart('netChart', {
        type: "bar",
        data: {
            labels: $scope.players,
            datasets: [
                {
                    backgroundColor: $scope.playerColors,
                    data: [
                        $scope.playerData[0].net.toFixed(2),
                        $scope.playerData[1].net.toFixed(2),
                        $scope.playerData[2].net.toFixed(2),
                        $scope.playerData[3].net.toFixed(2),
                    ]
                }
            ]
        },
        options: {
            legend: {display: false},
            scales: {
                yAxes: [{
                    ticks: {
                        maxTicksLimit: 6,
                        fontSize: 10
                    }, 
                }]
            }
        }
    });

    new Chart('taiChart', {
        type: "bar",
        data: {
            labels: ['1台','2台','3台','4台','5台'],
            datasets: [
                {
                    label: $scope.playerData[0].name,
                    backgroundColor: $scope.playerColors[0],
                    data: $scope.playerData[0].wins[4]
                },
                {
                    label: $scope.playerData[1].name,
                    backgroundColor: $scope.playerColors[1],
                    data: $scope.playerData[1].wins[4]
                },
                {
                    label: $scope.playerData[2].name,
                    backgroundColor: $scope.playerColors[2],
                    data: $scope.playerData[2].wins[4]
                },
                {
                    label: $scope.playerData[3].name,
                    backgroundColor: $scope.playerColors[3],
                    data: $scope.playerData[3].wins[4]
                }
            ]
        },
        options: {
            legend: {display: true},
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0, 
                        maxTicksLimit: 6,
                        fontSize: 10
                    }, 
                }]
            }
        }
    });

    new Chart('diaoZhengChart', {
        type: "doughnut",
        data: {
            labels: $scope.players,
            datasets: [
                {
                    backgroundColor: $scope.playerColors,
                    data: $scope.diaoZheng,
                }
            ]
        },
        options: {
            legend: {display: true},
        }
    });

    new Chart('flower0', {
        type: "doughnut",
        data: {
            labels: [
                $scope.playerData[1].name,
                $scope.playerData[2].name,
                $scope.playerData[3].name
            ],
            datasets: [
                {
                    data: [
                        $scope.playerData[1].flowers[0][0] + $scope.playerData[1].flowers[1][0],
                        $scope.playerData[2].flowers[0][0] + $scope.playerData[2].flowers[1][0],
                        $scope.playerData[3].flowers[0][0] + $scope.playerData[3].flowers[1][0]
                    ],
                    backgroundColor: [
                        $scope.playerColors[1],
                        $scope.playerColors[2],
                        $scope.playerColors[3]
                    ],
                }
            ]
        },
        options: {
            title: {
                display: true,
                text: $scope.playerData[0].name,
                position: 'bottom',
                fontSize: 30
            }
        }
    });
    new Chart('flower1', {
        type: "doughnut",
        data: {
            labels: [$scope.playerData[0].name,
                    $scope.playerData[2].name,
                    $scope.playerData[3].name],
            datasets: [{
                data: [
                    $scope.playerData[0].flowers[0][1] + $scope.playerData[0].flowers[1][1],
                    $scope.playerData[2].flowers[0][1] + $scope.playerData[2].flowers[1][1],
                    $scope.playerData[3].flowers[0][1] + $scope.playerData[3].flowers[1][1]
                ],
                backgroundColor: [
                    $scope.playerColors[0],
                    $scope.playerColors[2],
                    $scope.playerColors[3]
                ],
            }]
        },
        options: {
            title: {
                display: true,
                text: $scope.playerData[1].name,
                position: 'bottom',
                fontSize: 30
            }
        }
    });
    new Chart('flower2', {
        type: "doughnut",
        data: {
            labels: [$scope.playerData[0].name,
                    $scope.playerData[1].name,
                    $scope.playerData[3].name],
            datasets: [{
                data: [
                    $scope.playerData[0].flowers[0][2] + $scope.playerData[0].flowers[1][2],
                    $scope.playerData[1].flowers[0][2] + $scope.playerData[1].flowers[1][2],
                    $scope.playerData[3].flowers[0][2] + $scope.playerData[3].flowers[1][2]
                ],
                backgroundColor: [
                    $scope.playerColors[0],
                    $scope.playerColors[1],
                    $scope.playerColors[3]
                ],
            }]
        },
        options: {
            title: {
                display: true,
                text: $scope.playerData[2].name,
                position: 'bottom',
                fontSize: 30
            }
        }
    });
    new Chart('flower3', {
        type: "doughnut",
        data: {
            labels: [$scope.playerData[0].name,
                    $scope.playerData[1].name,
                    $scope.playerData[2].name],
            datasets: [{
                data: [
                    $scope.playerData[0].flowers[0][3] + $scope.playerData[0].flowers[1][3],
                    $scope.playerData[1].flowers[0][3] + $scope.playerData[1].flowers[1][3],
                    $scope.playerData[2].flowers[0][3] + $scope.playerData[2].flowers[1][3]
                ],
                backgroundColor: [
                    $scope.playerColors[0],
                    $scope.playerColors[1],
                    $scope.playerColors[2]
                ],
            }]
        },
        options: {
            title: {
                display: true,
                text: $scope.playerData[3].name,
                position: 'bottom',
                fontSize: 30
            }
        }
    });

    new Chart('gangWinnings', {
        type: "line",
        data: {
            labels: $scope.players,
            datasets: [
                {
                    fill: false,
                    backgroundColor: $scope.playerColors,
                    data: [
                        $scope.playerData[0].gangWinnings.toFixed(2),
                        $scope.playerData[1].gangWinnings.toFixed(2),
                        $scope.playerData[2].gangWinnings.toFixed(2),
                        $scope.playerData[3].gangWinnings.toFixed(2)
                    ]
                }
            ]
        },
        options: {
            legend: {display: false},
            title: {
                display: true,
                text: "Each player's 杠 winnings",
                position: 'top',
                fontSize: 30,
                fontColor: 'black'
            },
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0, 
                        maxTicksLimit: 6,
                        fontSize: 10
                    }, 
                }]
            }
        }
    });

    new Chart('gangShooters', {
        type: "line",
        data: {
            labels: $scope.players,
            datasets: [
                {
                    label: $scope.players[0],
                    fill: false,
                    borderColor: $scope.playerColors[0],
                    backgroundColor: $scope.playerColors[0],
                    data: [
                        0,
                        $scope.playerData[1].gangs[0][0],
                        $scope.playerData[2].gangs[0][0],
                        $scope.playerData[3].gangs[0][0]
                    ]
                },
                {
                    label: $scope.players[1],
                    fill: false,
                    borderColor: $scope.playerColors[1],
                    backgroundColor: $scope.playerColors[1],
                    data: [
                        $scope.playerData[0].gangs[0][1],
                        0,
                        $scope.playerData[2].gangs[0][1],
                        $scope.playerData[3].gangs[0][1]
                    ]
                },
                {
                    label: $scope.players[2],
                    fill: false,
                    borderColor: $scope.playerColors[2],
                    backgroundColor: $scope.playerColors[2],
                    data: [
                        $scope.playerData[0].gangs[0][2],
                        $scope.playerData[1].gangs[0][2],
                        0,
                        $scope.playerData[3].gangs[0][2]
                    ]
                },
                {
                    label: $scope.players[3],
                    fill: false,
                    borderColor: $scope.playerColors[3],
                    backgroundColor: $scope.playerColors[3],
                    data: [
                        $scope.playerData[0].gangs[0][3],
                        $scope.playerData[1].gangs[0][3],
                        $scope.playerData[2].gangs[0][3],
                        0,
                    ]
                }
            ]
        },
        options: {
            legend: {display: true},
            title: {
                display: true,
                text: 'Number of times you shot others a 杠',
                position: 'top',
                fontSize: 30,
                fontColor: 'black'
            },
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0, 
                        maxTicksLimit: 6,
                        fontSize: 10
                    }, 
                }]
            }
        }
    });

    new Chart('gangTypes', {
        type: "line",
        data: {
            labels: $scope.players,
            datasets: [
                {
                    label: 'Draw after 碰',
                    fill: false,
                    borderColor: 'orange',
                    backgroundColor: $scope.playerColors,
                    data: [
                        $scope.playerData[0].gangs[1][0],
                        $scope.playerData[1].gangs[1][0],
                        $scope.playerData[2].gangs[1][0],
                        $scope.playerData[3].gangs[1][0]
                    ]
                },
                {
                    label: 'From hand',
                    fill: false,
                    borderColor: 'green',
                    backgroundColor: $scope.playerColors,
                    data: [
                        $scope.playerData[0].gangs[1][1],
                        $scope.playerData[1].gangs[1][1],
                        $scope.playerData[2].gangs[1][1],
                        $scope.playerData[3].gangs[1][1]
                    ]
                }
            ]
        },
        options: {
            legend: {display: true},
            title: {
                display: true,
                text: 'Number of times each player 杠 after 碰 / from hand',
                position: 'top',
                fontSize: 30,
                fontColor: 'black'
            },
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0, 
                        maxTicksLimit: 6,
                        fontSize: 10
                    }, 
                }]
            }
        }
    });

    $scope.gangWinningsChart = true;
    $scope.gangShootersChart = false;
    $scope.gangTypesChart = false;
    $scope.changeGangChart = function(chart) {
        switch(chart) {
            case 1: $scope.gangShootersChart = false; $scope.gangTypesChart = false; break;
            case 2: $scope.gangWinningsChart = false; $scope.gangTypesChart = false; break;
            case 3: $scope.gangWinningsChart = false; $scope.gangShootersChart = false; break;
        }
    }

    new Chart('animalChart', {
        type: "pie",
        data: {
            labels: $scope.players,
            datasets: [
                {
                    label: 'winnings',
                    data: [
                        $scope.playerData[0].animalWinnings.toFixed(2),
                        $scope.playerData[1].animalWinnings.toFixed(2),
                        $scope.playerData[2].animalWinnings.toFixed(2),
                        $scope.playerData[3].animalWinnings.toFixed(2)
                    ],
                    backgroundColor: $scope.playerColors,
                },
                {
                    label: 'total 🐗s',
                    data: [
                        $scope.playerData[0].animals[2],
                        $scope.playerData[1].animals[2],
                        $scope.playerData[2].animals[2],
                        $scope.playerData[3].animals[2]
                    ],
                    backgroundColor: $scope.playerColors,
                },
                {
                    label: ['🐗s drawns', '🐗s from hand',],
                    data: [
                        $scope.playerData[0].animals[0], $scope.playerData[0].animals[1],
                        $scope.playerData[1].animals[0], $scope.playerData[1].animals[1],
                        $scope.playerData[2].animals[0], $scope.playerData[2].animals[1],
                        $scope.playerData[3].animals[0], $scope.playerData[3].animals[1]
                        
                    ],
                    backgroundColor: [
                        $scope.playerColors[0], $scope.playerColors[0],
                        $scope.playerColors[1], $scope.playerColors[1],
                        $scope.playerColors[2], $scope.playerColors[2],
                        $scope.playerColors[3], $scope.playerColors[3]
                    ],
                }
            ]
        },
        options: {
            legend: {display: true},
            tooltips: {
                mode: 'point',
                callbacks: {
                    label: function(tooltipItem, data) { 
                        var dataset = data.datasets[tooltipItem.datasetIndex];
                        var dslabelamt = dataset.data[tooltipItem.index];
                        var label;
                        if (tooltipItem.datasetIndex === 2) {
                            if (tooltipItem.index % 2 !== 0) {
                                label = dataset.label[0];
                            } else {
                                label = dataset.label[1];
                            }
                        } else {
                            label = dataset.label;
                        }
                        return label + ': ' + dslabelamt;
                    }
                }
            }
        }
    });

    $scope.goBackMainGame = function() {
        $location.path('game');
    }

    $scope.restart = function() {
        var cont = confirm('Start new game? All data will be lost.');
        if (cont) {
            sharedVariables.tai = 0.1;
            sharedVariables.players = [];
            sharedVariables.playerData = [];
            sharedVariables.totalRounds = 1;
            sharedVariables.diaoZheng = [0, 0, 0, 0];
            sharedVariables.totalDraws = 0; 
            sharedVariables.totalReShuffles = 0;
            sharedVariables.gameEnd = false;
            sharedVariables.zhuang = 0;
            sharedVariables.tableFeng = 0;
            sharedVariables.zhaHu = [0, 0, 0, 0];
            sharedVariables.flowerWins = [0, 0, 0, 0];
            sharedVariables.events = [];
            $location.path('');
        }
    }
}]);


