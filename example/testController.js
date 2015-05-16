angular.module('test', ['tangcloud'])
    .controller('TestCtrl', ['$scope', function ($scope) {
        $scope.words = [
            {id: 1, word: "woord1", size: 1},
            {id: 2, word: "woord6", size: 6},
            {id: 3, word: "woord7", size: 7},
            {id: 4, word: "woord2", size: 2},
            {id: 5, word: "woord10", size: 10},
            {id: 6, word: "woord3", size: 3},
            {id: 7, word: "woord4", size: 4},
            {id: 8, word: "woord5", size: 5},
            {id: 9, word: "woord8", size: 8},
            {id: 10, word: "woord9", size: 9}
        ];
        
        $scope.test = function(word) {
            console.log("clicked on " + word);
        }

    }]);