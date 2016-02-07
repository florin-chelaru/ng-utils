/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 2/6/2016
 * Time: 1:21 PM
 */

goog.provide('ngu.d.ShowAfterTransition');

goog.require('ngu.Directive');

/**
 * @param {angular.Scope} $scope
 * @constructor
 * @extends {ngu.Directive}
 */
ngu.d.ShowAfterTransition = function ($scope) {
  ngu.Directive.apply(this, arguments);
};

goog.inherits(ngu.d.ShowAfterTransition, ngu.Directive);

/**
 * @param {angular.Scope} $scope
 * @param {jQuery} $element
 * @param {angular.Attributes} $attrs
 * @override
 */
ngu.d.ShowAfterTransition.prototype.link = function ($scope, $element, $attrs) {
  var self = this;

  $element[0].addEventListener('transitionend', function() {
    var action = $attrs['nguShowAfterTransition'];
    if (action) {
      if ($scope.$eval(action)) {
        $element.css('display', 'block');
      } else {
        $element.css('display', 'none');
      }

      if(!$scope.$$phase) {
        $scope.$apply();
      }
    }
  });
};


