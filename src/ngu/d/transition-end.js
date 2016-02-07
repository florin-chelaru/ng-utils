/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 2/6/2016
 * Time: 1:58 AM
 */

goog.provide('ngu.d.TransitionEnd');

goog.require('ngu.Directive');

/**
 * @param {angular.Scope} $scope
 * @constructor
 * @extends {ngu.Directive}
 */
ngu.d.TransitionEnd = function ($scope) {
  ngu.Directive.apply(this, arguments);
};

goog.inherits(ngu.d.TransitionEnd, ngu.Directive);

/**
 * @param {angular.Scope} $scope
 * @param {jQuery} $element
 * @param {angular.Attributes} $attrs
 * @override
 */
ngu.d.TransitionEnd.prototype.link = function ($scope, $element, $attrs) {
  var self = this;

  $element[0].addEventListener('transitionend', function() {
    var action = $attrs['nguTransitionEnd'];
    if (action) {
      $scope.$eval(action);

      if(!$scope.$$phase) {
        $scope.$apply();
      }
    }
  });
};
