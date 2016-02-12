/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 2/6/2016
 * Time: 5:12 PM
 */

goog.provide('ngu.d.IncludeReplace');

goog.require('ngu.Directive');

/**
 * @param {angular.Scope} $scope
 * @constructor
 * @extends {ngu.Directive}
 */
ngu.d.IncludeReplace = function ($scope) {
  ngu.Directive.apply(this, arguments);
};

goog.inherits(ngu.d.IncludeReplace, ngu.Directive);

/**
 * @param {angular.Scope} $scope
 * @param {jQuery} $element
 * @param {angular.Attributes} $attrs
 * @override
 */
ngu.d.IncludeReplace.prototype.link = function ($scope, $element, $attrs) {
  $element.replaceWith($element.children());
};
