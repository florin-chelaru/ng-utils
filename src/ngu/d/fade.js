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

  $element.css({
    'display': 'none',
    'opacity': '0'
  });

  $scope.$watch($attrs['nguFade'], function(newVal, oldVal) {
    if (newVal) {
      $element.css('display', 'block');

      // This is called to initialize display:block, so that the transition actually happens
      u.reflowForTransition($element[0]);

      $element.css('opacity', '1');
    } else {
      var opacity = parseInt($element.css('opacity'), 10);
      if (!opacity) {
        $element.css('display', 'none');
        $element.css('opacity', '0');
        return;
      }
      $element.css('opacity', '0');
      $element.one('transitionend', function() {
        $element.css('display', 'none');
      });
    }
  });
};
