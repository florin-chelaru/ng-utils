/**
* @license ng-utils.js
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




goog.provide('ngu.Configuration');

/**
 * @constructor
 */
ngu.Configuration = function() {};

/**
 * @returns {ngu.Configuration}
 */
ngu.Configuration.prototype.$get = function() { return this; };


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


goog.provide('ngu');

goog.require('ngu.Configuration');
goog.require('ngu.Provider');

goog.require('ngu.Directive');
goog.require('ngu.Controller');
goog.require('ngu.Service');

goog.require('ngu.d.Fade');
goog.require('ngu.d.IncludeReplace');
goog.require('ngu.d.ShowAfterTransition');
goog.require('ngu.d.TransitionEnd');

ngu.main = angular.module('ngu', []);

ngu.main.directive('nguTransitionEnd', [function() {
  return ngu.Directive.createNew('nguTransitionEnd', /** @type {function(new: ngu.Directive)} */ (ngu.d.TransitionEnd), arguments, {restrict: 'AC'});
}]);

ngu.main.directive('nguShowAfterTransition', [function() {
  return ngu.Directive.createNew('nguShowAfterTransition', /** @type {function(new: ngu.Directive)} */ (ngu.d.ShowAfterTransition), arguments, {restrict: 'AC'});
}]);

ngu.main.directive('nguFade', [function() {
  return ngu.Directive.createNew('nguFade', /** @type {function(new: ngu.Directive)} */ (ngu.d.Fade), arguments, {restrict: 'AC'});
}]);

ngu.main.directive('nguIncludeReplace', [function() {
  return ngu.Directive.createNew('nguIncludeReplace', /** @type {function(new: ngu.Directive)} */ (ngu.d.IncludeReplace), arguments, {restrict: 'A', require: 'ngInclude'});
}]);


// Pure jQuery utilities

/**
 * @param {string} ua
 * @returns {{browser: string, version: string}}
 */
ngu.uaMatch = function( ua ) {
  ua = ua.toLowerCase();

  var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
    /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
    /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
    /(msie) ([\w.]+)/.exec( ua ) ||
    ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
    [];

  return {
    'browser': match[ 1 ] || "",
    'version': match[ 2 ] || "0"
  };
};

/**
 * @returns {{chrome: (boolean|undefined), safari: (boolean|undefined), webkit: (boolean|undefined), mozilla: (boolean|undefined), version: (string|undefined)}}
 */
ngu.browser = function() {
  var matched = ngu.uaMatch(navigator.userAgent);
  var browser = {};

  if (matched['browser']) {
    browser[matched['browser']] = true;
    browser['version'] = matched['version'];
  }

  // Chrome is Webkit, but Webkit is also Safari.
  if (browser['chrome']) {
      browser['webkit'] = true;
  } else if (browser['webkit']) {
    browser['safari'] = true;
  }

  return browser;
};

/**
 * @param {boolean} [keepScrollbar]
 * @returns {{$doc: jQuery, scrollTop: number}}
 */
ngu.disableBodyScroll = function(keepScrollbar) {
  var ret = {$doc: null, scrollTop: null};
  var $html = $('html'); // this will not work in chrome, but will in firefox...
  var $body = $('body'); // just body will not work in firefox, but will in chrome...
  var $doc = ($body.scrollTop() || 0) > 0 ? $body : $html;

  ret.$doc = $doc;
  ret.scrollTop = $doc.scrollTop() || 0;

  if (ngu.browser().webkit) {
    var width = $doc.width();

    // Optional: leave scrollbar if body already had it.
    if (keepScrollbar) {
      var hasScrollbar = $doc.get(0).scrollHeight > $doc.height() + parseFloat($doc.css('padding-top')) + parseFloat($doc.css('padding-bottom'));
      $doc.css('overflow-y', hasScrollbar ? 'scroll' : 'hidden'); // scroll disables the scrollbar for body, but keeps it
    } else {
      $doc.css('overflow-y', 'hidden'); // scroll disables the scrollbar for body, but keeps it
    }
    $doc.css('position', 'fixed');
    $doc.css('top', -ret.scrollTop);
    $doc.css('width', width);
  }

  return ret;
};

/**
 * @param {{$doc: jQuery, scrollTop: number}} previousState
 */
ngu.reEnableBodyScroll = function(previousState) {
  var $doc = previousState.$doc;
  $doc.css('overflow-y', '');

  if (ngu.browser().webkit) {
    $doc.css('position', '');
    $doc.css('top', '');
    $doc.css('width', '');
  }
  $doc.scrollTop(previousState.scrollTop);
};
