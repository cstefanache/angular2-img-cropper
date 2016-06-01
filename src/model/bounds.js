"use strict";
var pointPool_1 = require('./pointPool');
var Bounds = (function () {
    function Bounds(x, y, width, height) {
        if (x === void 0) {
            x = 0;
        }
        if (y === void 0) {
            y = 0;
        }
        if (width === void 0) {
            width = 0;
        }
        if (height === void 0) {
            height = 0;
        }
        this.left = x;
        this.right = x + width;
        this.top = y;
        this.bottom = y + height;
    }
    Bounds.prototype.getWidth = function () {
        return this.right - this.left;
    };
    ;
    Bounds.prototype.getHeight = function () {
        return this.bottom - this.top;
    };
    ;
    Bounds.prototype.getCentre = function () {
        var w = this.getWidth();
        var h = this.getHeight();
        return pointPool_1.PointPool.instance.borrow(this.left + (w / 2), this.top + (h / 2));
    };
    ;
    return Bounds;
}());
exports.Bounds = Bounds;
//# sourceMappingURL=bounds.js.map