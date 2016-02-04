/**
* @license slide.js
* Copyright (c) 2016 Florin Chelaru
* License: MIT
*
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
* documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
* rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
* permit persons to whom the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
* Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
* WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
* COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
* OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


goog.provide('ngu.Service');

/**
 * @constructor
 */
ngu.Service = function() {
  /**
   * @type {string}
   * @private
   */
  this._id = u.generatePseudoGUID(6);
};


/**
 * @type {string}
 * @name ngu.Service#id
 */
ngu.Service.prototype.id;

Object.defineProperties(ngu.Service.prototype, {
  'id': { get: /** @type {function (this:ngu.Service)} */ (function() { return this._id; }) }
});





goog.provide('ngu.Controller');

/**
 * @param {angular.Scope} $scope Angular scope
 * @constructor
 */
ngu.Controller = function($scope) {
  /**
   * Angular scope
   * @private
   */
  this._$scope = $scope;

  /**
   * @type {string}
   * @private
   */
  this._id = u.generatePseudoGUID(6);
};

/**
 * @type {string}
 * @name ngu.Controller#id
 */
ngu.Controller.prototype.id;

/**
 * @type {angular.Scope}
 * @name ngu.Controller#$scope
 */
ngu.Controller.prototype.$scope;

Object.defineProperties(ngu.Controller.prototype, {
  'id': { get: /** @type {function (this:ngu.Controller)} */ (function() { return this._id; }) },
  '$scope': { get: /** @type {function (this:ngu.Controller)} */ (function() { return this._$scope; }) }
});



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
 * @returns {{controller: (Array|Function), link: Function, restrict: string, transclude: boolean, replace: boolean}}
 */
ngu.Directive.createNew = function(name, controllerCtor, args, options) {
  var controller = ['$scope', function($scope) {
    var params = [].concat(args || []);
    params.unshift($scope);

    // Usage of 'this' is correct in this scope: we are accessing the 'this' of the controller
    this['handler'] = u.reflection.applyConstructor(controllerCtor, params);
  }];
  var link;
  if (typeof controllerCtor.prototype.link == 'function') {
    link = function ($scope, $element, $attrs) {
      var ctrl = $scope[name];
      return ctrl['handler'].link($scope, $element, $attrs, ctrl);
    };
  } else {
    link = {};
    if ('pre' in controllerCtor.prototype.link) {
      link['pre'] = function($scope, $element, $attrs) {
        var ctrl = $scope[name];
        ctrl['handler'].link['pre'].call(ctrl['handler'], $scope, $element, $attrs, ctrl);
      };
    }
    if ('post' in controllerCtor.prototype.link) {
      link['post'] = function($scope, $element, $attrs) {
        var ctrl = $scope[name];
        ctrl['handler'].link['post'].call(ctrl['handler'], $scope, $element, $attrs, ctrl);
      };
    }
  }

  return u.extend({}, options, { 'link': link, 'controller': controller, 'controllerAs': name });
};



goog.provide('ngu');

goog.require('ngu.Directive');
goog.require('ngu.Controller');
goog.require('ngu.Service');
