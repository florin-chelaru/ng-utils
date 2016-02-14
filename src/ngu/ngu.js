/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 2/3/2016
 * Time: 6:50 PM
 */

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
