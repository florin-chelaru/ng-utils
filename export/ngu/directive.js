/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 2/3/2016
 * Time: 2:51 PM
 */

goog.require('ngu.Directive');

goog.exportSymbol('ngu.Directive', ngu.Directive);
goog.exportProperty(ngu.Directive, 'createNew', ngu.Directive.createNew);

// Export for inheritance:

if (Object.getOwnPropertyDescriptor(ngu.Directive.prototype, 'link') == undefined) {
  Object.defineProperty(ngu.Directive.prototype, 'link', {
    configurable: true,
    enumerable: true,
    get: /** @type {function (this:ngu.Directive)} */ (function() { return this.link; }),
    set: /** @type {function (this:ngu.Directive)} */ (function(value) { this.link = value; })
  });
}
