/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 2/10/2016
 * Time: 12:13 PM
 */

goog.provide('ngu.Provider');
goog.provide('ngu.ProviderService');

goog.require('ngu.Service');

/**
 * @param {function(new: ngu.ProviderService)} serviceCtor
 * @param {Array.<string>} [serviceArgs]
 * @constructor
 */
ngu.Provider = function(serviceCtor, serviceArgs) {
  /**
   * @type {string}
   * @private
   */
  this._id = u.generatePseudoGUID(6);

  var self = this;

  /**
   * @type {Array}
   * @private
   */
  this._$get = serviceArgs || [];
  this._$get.push(function() {
    // Prepare arguments for the service instance;
    // Arguments are: providerService, ...other services
    var args = u.array.fromArguments(arguments);
    args.unshift(self);
    return u.reflection.applyConstructor(serviceCtor, args);
  });
};

/**
 * @type {string}
 * @name ngu.Provider#id
 */
ngu.Provider.prototype.id;

/**
 * @type {Array}
 * @name ngu.Provider#$get
 */
ngu.Provider.prototype.$get;

Object.defineProperties(ngu.Provider.prototype, {
  'id': {
    get: /** @type {function (this:ngu.Provider)} */ (function () {
      return this._id;
    })
  },
  '$get': {
    get: /** @type {function (this:ngu.Provider)} */ (function () {
      return this._$get;
    })
  }
});

/**
 * @param {ngu.Provider} provider
 * @constructor
 * @extends {ngu.Service}
 */
ngu.ProviderService = function(provider) {
  ngu.Service.apply(this, arguments);

  /**
   * @type {ngu.Provider}
   * @private
   */
  this._provider = provider;
};

/**
 * @type {ngu.Provider}
 * @name ngu.ProviderService#provider
 */
ngu.ProviderService.prototype.provider;

Object.defineProperties(ngu.ProviderService.prototype, {
  'provider': {
    get: /** @type {function (this:ngu.ProviderService)} */ (function () {
      return this._provider;
    })
  }
});
