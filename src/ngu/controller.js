/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 2/3/2016
 * Time: 2:30 PM
 */


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

