/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 2/6/2016
 * Time: 1:21 PM
 */

goog.provide('ngu.d.Fade');

goog.require('ngu.Directive');

/**
 * @param {angular.Scope} $scope
 * @constructor
 * @extends {ngu.Directive}
 */
ngu.d.Fade = function ($scope) {
  ngu.Directive.apply(this, arguments);
};

goog.inherits(ngu.d.Fade, ngu.Directive);

/**
 * @param {angular.Scope} $scope
 * @param {jQuery} $element
 * @param {angular.Attributes} $attrs
 * @override
 */
ngu.d.Fade.prototype.link = function ($scope, $element, $attrs) {
  var self = this;

  $scope.$watch($attrs['nguFade'], function(newVal, oldVal) {
    if (newVal) {
      $element.addClass('active'); // display: block

      // This is called to initialize display:block, so that the transition actually happens
      $element[0].offsetWidth; // reflow for transition

      $element.addClass('in'); // opacity: 1
    } else {
      $element.removeClass('in');
      $element.one('transitionend', function() {
        $element.removeClass('active');
      });
    }
  });
};
