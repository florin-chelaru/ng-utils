/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 2/3/2016
 * Time: 2:51 PM
 */

goog.provide('ngu.Directive');

/**
 * @param {angular.Scope} $scope Angular scope
 * @constructor
 */
ngu.Directive = function($scope) {
  /**
   * @type {angular.Scope}
   * @private
   */
  this._$scope = $scope;

  /**
   * @type {jQuery}
   * @private
   */
  this._$element = null;

  /**
   * @private
   */
  this._$attrs = null;
};

/**
 * @type {angular.Scope}
 * @name ngu.Directive#$scope
 */
ngu.Directive.prototype.$scope;

/**
 * @type {jQuery}
 * @name ngu.Directive#$element
 */
ngu.Directive.prototype.$element;

/**
 * @type {angular.Attributes}
 * @name ngu.Directive#$attrs
 */
ngu.Directive.prototype.$attrs;

Object.defineProperties(ngu.Directive.prototype, {
  '$scope': { get: /** @type {function (this:ngu.Directive)} */ (function() { return this._$scope; })},
  '$element': { get: /** @type {function (this:ngu.Directive)} */ (function() { return this._$element; })},
  '$attrs': { get: /** @type {function (this:ngu.Directive)} */ (function() { return this._$attrs; })}
});

/**
 * @type {{pre: (undefined|function(angular.Scope, jQuery, angular.Attributes, (*|undefined))), post: (undefined|function(angular.Scope, jQuery, angular.Attributes, (*|undefined)))}|function(angular.Scope, jQuery, angular.Attributes, (*|undefined))}
 */
ngu.Directive.prototype.link = {

  'pre': function($scope, $element, $attrs, controller) {
    this._$element = $element;
    this._$attrs = $attrs;
  },

  'post': function($scope, $element, $attrs, controller) {
    this._$element = $element;
    this._$attrs = $attrs;
  }
};

/**
 * @param {string} name
 * @param {function(new: ngu.Directive)} controllerCtor
 * @param {Array} [args]
 * @param {Object.<string, *>} [options]
 * @returns {Object.<string, *>}
 */
ngu.Directive.createNew = function(name, controllerCtor, args, options) {
  var controller = ['$scope', function($scope) {
    var params = [].concat(u.array.fromArguments(args || []));
    params.unshift($scope);

    return u.reflection.applyConstructor(controllerCtor, params);
  }];
  var link;
  if (typeof controllerCtor.prototype.link == 'function') {
    link = function ($scope, $element, $attrs) {
      var ctrl = $scope[name];
      return ctrl.link($scope, $element, $attrs, ctrl);
    };
  } else {
    link = {};
    if ('pre' in controllerCtor.prototype.link) {
      link['pre'] = function($scope, $element, $attrs) {
        var ctrl = $scope[name];
        ctrl.link['pre'].call(ctrl, $scope, $element, $attrs, ctrl);
      };
    }
    if ('post' in controllerCtor.prototype.link) {
      link['post'] = function($scope, $element, $attrs) {
        var ctrl = $scope[name];
        ctrl.link['post'].call(ctrl, $scope, $element, $attrs, ctrl);
      };
    }
  }
  return u.extend({}, options, { 'link': link, 'controller': controller, 'controllerAs': name }, controllerCtor['options'] || {});
};

