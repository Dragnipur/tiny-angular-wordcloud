angular.module('tangcloud', [])
    .directive('tangCloud', ['$interpolate', '$compile', '$timeout', function ($interpolate, $compile, $timeout) {

        var directive = {
            restrict: 'E',
            scope: {
                width: '=',
                height: '=',
                words: '=',
                onClick: '&',
                spin: '='
            },

            template: function (tElement, tAttrs) {
                var isClickable = angular.isDefined(tAttrs.onClick);

                var clickAttr = isClickable ? 'ng-click="onClick({word : entry.word, id : entry.id})"' : '';

                return "<div class='tangcloud'>" +
                    "<span ng-repeat='entry in words'" + clickAttr + ">{{entry.word}}</span>" +
                    "</div>";
            },

            compile: function (elem) {
                elem.children().children()
                    .addClass('tangcloud-item-' + $interpolate.startSymbol() + 'entry.size' + $interpolate.endSymbol())
                    .addClass('tangcloud-item-hidden');

                return function (scope, elem) {
                    var centerX = scope.width / 2;
                    var centerY = scope.height / 2;
                    var takenSpots = [];

                    scope.words = shuffleWords(scope.words);
                    determineWordPositions();

                    function shuffleWords(array) {
                        for (var i = array.length - 1; i > 0; i--) {
                            var j = Math.floor(Math.random() * (i + 1));
                            var temp = array[i];
                            array[i] = array[j];
                            array[j] = temp;
                        }
                        return array;
                    }

                    function determineWordPositions() {
                        $timeout(function () {
                            var trendSpans = elem.children().eq(0).children();
                            var length = trendSpans.length;

                            for (var i = 0; i < length; i++) {
                                setWordSpanPosition(trendSpans.eq(i));
                            }
                        });
                    }

                    function setWordSpanPosition(span) {
                        var height = parseInt(window.getComputedStyle(span[0]).lineHeight, 10);
                        var width = span[0].offsetWidth;
                        var spot = {
                            startX: centerX - width / 2,
                            startY: centerY - height / 2,
                            endX: centerX + width / 2,
                            endY: centerY + height / 2
                        };
                        var angleMultiplier = 0;

                        while (spotNotUsable(spot)) {
                            var angle = angleMultiplier * 0.1;
                            spot.startX = centerX + (1.5 * angle) * Math.cos(angle) - (width / 2);
                            spot.startY = centerY + angle * Math.sin(angle) - (height / 2);
                            spot.endX = spot.startX + width;
                            spot.endY = spot.startY + height;
                            angleMultiplier += 1;
                        }

                        takenSpots.push(spot);
                        addSpanPositionStyling(span, spot.startX, spot.startY);
                    }


                    function spotNotUsable(spot) {

                        var borders = {
                            left: centerX - scope.width / 2,
                            right: centerX + scope.width / 2,
                            bottom: centerY - scope.height / 2,
                            top: centerY + scope.height / 2
                        };

                        for (var i = 0; i < takenSpots.length; i++) {
                            if (spotInvalid(spot, borders) || collisionDetected(spot, takenSpots[i])) return true;
                        }
                        return false;
                    }

                    function spotInvalid(spot, borders) {
                        return spot.startX < borders.left ||
                            spot.endX > borders.right ||
                            spot.startY < borders.bottom ||
                            spot.endY > borders.top
                    }

                    function collisionDetected(spot, takenSpot) {
                        if (spot.startX > takenSpot.endX || spot.endX < takenSpot.startX) {
                            return false;
                        }

                        return !(spot.startY > takenSpot.endY || spot.endY < takenSpot.startY);
                    }

                    function addSpanPositionStyling(span, startX, startY) {
                        var style = "position: absolute; left:" + startX + "; top: " + startY;
                        span.attr("style", style);
                        span.removeClass("tangcloud-item-hidden");
                    }
                };


            }
        };

        return directive;
    }]);