angular.module('tangcloud', [])
    .directive('tangCloud', ['$interpolate', '$compile', '$timeout', function ($interpolate, $compile, $timeout) {

        var directive = {
            restrict: 'E',
            scope: {
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
                    var div = elem.children().eq(0)[0];
                    setupCustomScopeVariables();
                    formWordCloud();

                    function setupCustomScopeVariables() {
                        scope.width = div.offsetWidth;
                        scope.height = div.offsetHeight;

                        scope.centerX = scope.width / 2;
                        scope.centerY = scope.height / 2;

                        scope.borders = {
                            left: scope.centerX - scope.width / 2,
                            right: scope.centerX + scope.width / 2,
                            bottom: scope.centerY - scope.height / 2,
                            top: scope.centerY + scope.height / 2
                        };

                        scope.outOfBoundsCount = 0;
                        scope.takenSpots = [];
                        scope.lastCollisionSpot = -1;
                    }

                    function formWordCloud() {
                        if (scope.words) {
                            shuffleWords();
                            determineWordPositions();
                        }
                    }

                    function shuffleWords() {
                        for (var i = scope.words.length - 1; i > 0; i--) {
                            var j = Math.floor(Math.random() * (i + 1));
                            var temp = scope.words[i];
                            scope.words[i] = scope.words[j];
                            scope.words[j] = temp;
                        }
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
                        var spot = setupDefaultSpot(span[0]);
                        var angleMultiplier = 0;

                        while (spotNotUsable(spot) && scope.outOfBoundsCount < 50) {
                            spot = moveSpotOnSpiral(spot, angleMultiplier);
                            angleMultiplier += 1;
                        }

                        if (scope.outOfBoundsCount < 50) {
                            scope.takenSpots.push(spot);
                            moveSpanToEmptySpot(span, spot.startX, spot.startY);
                        }

                        scope.outOfBoundsCount = 0;
                    }

                    function setupDefaultSpot(span) {
                        var width = span.offsetWidth;
                        var height = parseInt(window.getComputedStyle(span).lineHeight, 10);

                        return {
                            width: width,
                            height: height,
                            startX: scope.centerX - width / 2,
                            startY: scope.centerY - height / 2,
                            endX: scope.centerX + width / 2,
                            endY: scope.centerY + height / 2
                        };
                    }

                    function moveSpotOnSpiral(spot, angleMultiplier) {
                        var angle = angleMultiplier * 0.1;
                        spot.startX = scope.centerX + (1.5 * angle) * Math.cos(angle) - (spot.width / 2);
                        spot.startY = scope.centerY + angle * Math.sin(angle) - (spot.height / 2);
                        spot.endX = spot.startX + spot.width;
                        spot.endY = spot.startY + spot.height;
                        return spot;
                    }


                    function spotNotUsable(spot) {

                        if (spotOutOfBounds(spot)) return true;
                        if (scope.lastCollisionSpot != -1 && collisionDetected(spot, scope.takenSpots[scope.lastCollisionSpot])) return true;

                        for (var i = 0; i < scope.takenSpots.length; i++) {
                            if (i != scope.lastCollisionSpot && collisionDetected(spot, scope.takenSpots[i])) {
                                scope.lastCollisionSpot = i;
                                return true;
                            }
                        }

                        scope.lastCollisionSpot = -1;
                        return false;
                    }

                    function spotOutOfBounds(spot) {
                        if (spot.startX < scope.borders.left ||
                            spot.endX > scope.borders.right ||
                            spot.startY < scope.borders.bottom ||
                            spot.endY > scope.borders.top) {
                            scope.outOfBoundsCount++;
                            return true;
                        } else {
                            return false;
                        }
                    }

                    function collisionDetected(spot, takenSpot) {
                        if (spot.startX > takenSpot.endX || spot.endX < takenSpot.startX) {
                            return false;
                        }

                        return !(spot.startY > takenSpot.endY || spot.endY < takenSpot.startY);
                    }

                    function moveSpanToEmptySpot(span, startX, startY) {
                        var style = "position: absolute; left:" + startX + "px; top: " + startY + "px;";
                        span.attr("style", style);
                        span.removeClass("tangcloud-item-hidden");
                    }
                };
            }
        };

        return directive;
    }]);