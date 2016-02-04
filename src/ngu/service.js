/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 2/3/2016
 * Time: 2:59 PM
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


