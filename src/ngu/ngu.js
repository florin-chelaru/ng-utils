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
 * @param {boolean} [keepScrollbar]
 * @returns {{$doc: jQuery, scrollTop: number}}
 */
ngu.disableBodyScroll = function(keepScrollbar) {
  var ret = {$doc: null, scrollTop: null};
  var $html = $('body,html'); // this will not work in chrome, but will in firefox...
  var $body = $('body'); // just body will not work in firefox, but will in chrome...
  var $doc = ($body.scrollTop() || 0) > 0 ? $body : $html;

  ret.$doc = $doc;
  ret.scrollTop = $doc.scrollTop() || 0;
  var width = $doc.width();

  // Optional: leave scrollbar if body already had it.
  if (keepScrollbar) {
    var hasScrollbar = $doc.get(0).scrollHeight > $doc.height() + parseFloat($doc.css('padding-top')) + parseFloat($doc.css('padding-bottom'));
    $doc.css('overflow-y', hasScrollbar ? 'scroll' : 'hidden'); // scroll disables the scrollbar for body, but keeps it
  }

  $doc.css('overflow-y', 'hidden'); // scroll disables the scrollbar for body, but keeps it
  $doc.css('position', 'fixed');
  $doc.css('top', -ret.scrollTop);
  $doc.css('width', width);

  return ret;
};

/**
 * @param {{$doc: jQuery, scrollTop: number}} previousState
 */
ngu.reEnableBodyScroll = function(previousState) {
  var $doc = previousState.$doc;
  $doc.css('overflow-y', '');
  $doc.css('position', '');
  $doc.css('top', '');
  $doc.css('width', '');
  $doc.scrollTop(previousState.scrollTop);
};
