var app = angular.module('teleBillApp', ['ngRoute', 'ngAnimate']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
	$routeProvider
		.when('/:chatId', {
			templateUrl: './teleBill.html',
			controller: 'teleBillCtrl'
		})
		.otherwise({
			redirectTo: '/:chatId'
		});
}]);

app.controller('teleBillCtrl', ["$scope", '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location) {

    $scope.eventStep = true;
    $scope.eventName = 'Tele Bill';
    $scope.eventDate = new Date();
    $scope.loadingParticipants = false;
    $scope.loaded = false; // In case back button is pressed, so no double http calls.
    $scope.goParticipants = function() {
        $scope.loadingParticipants = true;
        if (!$scope.loaded) {
            $http({
                method: 'POST',
                url: urlRoot + 'getAdmins',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { 
                    chatId: $routeParams.chatId,
                }
            })
            .then(function(response) {
                for (i = 0; i < response.data.length; i++) {
                    $scope.participants.push({
                        name: response.data[i],
                        // For split by items mode
                        pay: 0,
                        bought: [],
                        addingItem: false,
                        newItemName: '',
                        newItemCount: 1
                    })
                }
                $scope.loaded = true;
                $scope.participantCount = $scope.participants.length >= 2 
                    ? $scope.participants.length 
                    : 2;
                $scope.loadingParticipants = false;
                $scope.eventStep = false;
                $scope.participantsStep = true;
            }, function() {
                alert('Post Error');
            })
        } else {
            $scope.loadingParticipants = false;
            $scope.eventStep = false;
            $scope.participantsStep = true;
        }
    }

    $scope.participantsStep = false;
    $scope.participants = [];
    $scope.listParticipants = function() {
        if ($scope.participantCount < 2) {
            alert('Number of participants has to be at least 2.');
        } else {
            if ($scope.participants.length > $scope.participantCount) {
                $scope.participants.splice($scope.participantCount, $scope.participants.length - $scope.participantCount);
            }
            for (i = $scope.participants.length; i < $scope.participantCount; i++) {
                $scope.participants.push({
                    name: '',
                    // For split by items mode
                    pay: 0,
                    bought: [],
                    addingItem: false,
                    newItemName: '',
                    newItemCount: 1
                })
            }
            $scope.participantsList = true;
        }
    }
    $scope.participantsList = false;
    $scope.goModes = function() {
        var cont = true;
        for (i = 0; i < $scope.participants.length; i++) {
            if ($scope.participants[i].name === '') {
                cont = false;
                break;
            }
        }
        if (cont) {
            $scope.participantsStep = false;
            $scope.modesStep = true;
        } else {
            alert('Ensure each participant has a name.\nPLEASE USE TELEGRAM HANDLES!!!');
        }
    }

    $scope.modesStep = false;
    $scope.goTotalBill = function() {
        $scope.modesStep = false;
        $scope.totalBillMode = true;
    }
    $scope.goItemsBought = function() {
        $scope.modesStep = false;
        $scope.itemsBoughtMode = true;
    }

    $scope.totalBillMode = false;
    $scope.totalBill = 0.01;
    $scope.gst = false;
    $scope.serviceCharge = false;
    $scope.addOn = 1;
    $scope.splitBill = 0;
    $scope.goTotalBillFinal = function() {
        if ($scope.totalBill < 0.01) {
            alert('Total bill has to be at least $0.01.');
        } else {
            if ($scope.gst && $scope.serviceCharge) {
                $scope.addOn = 1.177;
            } else if ($scope.gst) {
                $scope.addOn = 1.07;
            } else if ($scope.serviceCharge) {
                $scope.addOn = 1.10;
            }
            $scope.totalBill *= $scope.addOn;
            $scope.splitBill = $scope.totalBill / $scope.participants.length;
            for (i = 0; i < $scope.participants.length; i++) {
                $scope.participants[i].pay = $scope.splitBill;
            }
            $scope.totalBillMode = false;
            $scope.totalBillFinal = true;
        }
    }

    $scope.totalBillFinal = false;
    $scope.teleMsg = function() {
        $http({
            method: 'POST',
            url: urlRoot + 'teleMsg',
            headers: {
                'Content-Type': 'application/json'
            },
            data: { 
                chatId: $routeParams.chatId,
                eventName: $scope.eventName,
                eventDate:  ($scope.eventDate.getUTCDate()) + "/" + ($scope.eventDate.getMonth() + 1)+ "/" + ($scope.eventDate.getUTCFullYear()),
                participants: $scope.participants,
                payment: $scope.splitBill     
            }
        })
        .then(function(response) {
            alert(response.data);
        }, function() {
            alert('Post Error');
		})
    }

    $scope.itemsBoughtMode = false;
    $scope.items = [{
        name: 'Item 1',
        cost: 0,
        count: 0
    }];
    $scope.newItem = function() {
        $scope.items.push({
            name: 'Item ' + ($scope.items.length + 1),
            cost: 0,
            count: 0
        })
    }
    $scope.goSplitItemsStep = function() {
        var promptName = false;
        var promptCost = false;
        for (i = 0; i < $scope.items.length; i++) {
            if ($scope.items[i].cost === undefined || $scope.items[i].cost < 0.01) {
                promptCost = true;
                break;
            } else if ($scope.items[i].name === '') {
                promptName = true;
            }
        }
        if (promptCost) {
            alert('Ensure all item costs are at least $0.01.');
        } else if (promptName) {
            var cont = confirm('Some item names are blank. Do you want to continue?');
            if (cont) {
                $scope.itemsBoughtMode = false;
                $scope.splitItemsStep = true;
            }
        } else {
            $scope.itemsBoughtMode = false;
            $scope.splitItemsStep = true;
        }
    }

    $scope.splitItemsStep = false;
    $scope.addItem = function(pIndex) {
        $scope.participants[pIndex].addingItem = true;
    }
    $scope.cancelAddItem = function(pIndex) {
        $scope.participants[pIndex].addingItem = false;
    }
    $scope.confirmItem = function(pIndex, itemName, itemCount) {
        if (itemCount < 0) {
            alert('Amount of items bought has to be at least 1. Enter 0 to remove item.');
        } else {
            var iIndex = getIndex(itemName, $scope.items);
            if (iIndex === -1) {
                alert('Item does not exist in item list.')
            } else {
                var bIndex = getIndex(itemName, $scope.participants[pIndex].bought);
                if (bIndex === -1) {
                    if (itemCount === 0) {
                        // Do nothing
                    } else {
                        $scope.items[iIndex].count += itemCount;
                        $scope.participants[pIndex].pay += $scope.items[iIndex].cost * itemCount;
                        $scope.participants[pIndex].bought.push({
                            name: itemName,
                            count: itemCount
                        });
                    }
                } else {
                    $scope.items[iIndex].count -= $scope.participants[pIndex].bought[bIndex].count;
                    $scope.participants[pIndex].pay -= $scope.participants[pIndex].bought[bIndex].count * $scope.items[iIndex].cost;
                    if (itemCount === 0) {
                        $scope.participants[pIndex].bought.splice(bIndex, 1);
                    } else {
                        $scope.items[iIndex].count += itemCount
                        $scope.participants[pIndex].pay += itemCount * $scope.items[iIndex].cost;
                        $scope.participants[pIndex].bought[bIndex].count = itemCount;
                    }
                }
                $scope.participants[pIndex].newItemName = '';
                $scope.participants[pIndex].newItemCount = 1;  
                $scope.participants[pIndex].addingItem = false;
            }
        }
    }
    $scope.editItem = function(pIndex, bIndex) {
        $scope.participants[pIndex].newItemName = $scope.participants[pIndex].bought[bIndex].name;
        $scope.participants[pIndex].newItemCount = $scope.participants[pIndex].bought[bIndex].count;
        $scope.addItem(pIndex);
    }
    function getIndex(name, arr) {
        for(i = 0; i < arr.length; i++) {
            if (name === arr[i].name) {
                return i;
            }
        }
        return -1;
    }
    $scope.dropDownSelect = function(pIndex, itemName) {
        $scope.participants[pIndex].newItemName = itemName;
    }
    $scope.goSplitItemsAddOns = function() {
        var prompt = false;
        for (i = 0; i < $scope.participants.length; i++) {
            if ($scope.participants[i].bought.length === 0) {
                prompt = true;
            }
        }
        if (prompt) {
            var cont = confirm('Some participants have no items bought. Do you still want to continue?');
            if (cont) {
                $scope.splitItemsStep = false;
                $scope.splitItemsAddOns = true;
            }
        } else {
            $scope.splitItemsStep = false;
            $scope.splitItemsAddOns = true; 
        }
    }

    $scope.splitItemsAddOns = false;
    $scope.deliveryCost = 0;
    $scope.goSplitItemsFinal = function() {
        if ($scope.deliveryCost < 0) {
            alert('Delivery cost has to be at least $0.00.');
        } else {
            if ($scope.gst && $scope.serviceCharge) {
                $scope.addOn = 1.177;
            } else if ($scope.gst) {
                $scope.addOn = 1.07;
            } else if ($scope.serviceCharge) {
                $scope.addOn = 1.10;
            }
            var deliverySplit = $scope.deliveryCost / $scope.participants.length;
            for (i = 0; i < $scope.participants.length; i++) {
                $scope.participants[i].pay += deliverySplit;
                $scope.participants[i].pay *= $scope.addOn;
            }
            $scope.splitItemsAddOns = false;
            $scope.splitItemsFinal = true;
        }
    }

    $scope.splitItemsFinal = false;

    $scope.back = function() {
        if ($scope.participantsStep) {
            $scope.eventStep = true;
            $scope.participantsStep = false;
        } else if ($scope.modesStep) {
            $scope.participantsStep = true;
            $scope.modesStep = false;
        } else if ($scope.totalBillMode) {
            $scope.modesStep = true;
            $scope.totalBillMode = false;
        } else if ($scope.totalBillFinal) {
            $scope.totalBillMode = true;
            $scope.totalBillFinal = false;
        } else if ($scope.itemsBoughtMode) {
            $scope.modesStep = true;
            $scope.itemsBoughtMode = false;
        } else if ($scope.splitItemsStep) {
            $scope.itemsBoughtMode = true;
            $scope.splitItemsStep = false;
        } else if ($scope.splitItemsAddOns) {
            $scope.splitItemsStep = true;
            $scope.splitItemsAddOns = false; 
        } else if ($scope.splitItemsFinal) {
            $scope.splitItemsAddOns = true;
            $scope.splitItemsFinal = false;
        }
    }

    // $scope.filterBy = function(search) {
    //     if (search === '') return false;

    //     return true;
    // }
}]);

app.directive("limitToMax", function() {
	return {
		link: function(scope, element, attributes) {
			element.on("keydown keyup", function(e) {
				if (element.val() > Number(attributes.max) &&
					e.keyCode != 46 // delete
					&&
					e.keyCode != 8 // backspace
				) {
					e.preventDefault();
					element.val(attributes.max);
				}
			});
		}
	};
});
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
app.directive("wholeNumber", function() {
	return {
		link: function(scope, element, attributes) {
			element.on("keydown keyup", function(e) {
				if (element.val().toString().split('.').length > 1 &&
					e.keyCode != 46 // delete
					&&
					e.keyCode != 8 // backspace
				) {
					e.preventDefault();
					element.val(Math.floor(element.val()));
				}
			});
		}
	};
});
app.filter('filterBy', function() {
    return function(items, searchBar) {
    
        if (searchBar === '') return [];

        return items.filter(function(item) {
            return item.name.substr(0, searchBar.length).toUpperCase() === searchBar.toUpperCase();
        });
    };
});