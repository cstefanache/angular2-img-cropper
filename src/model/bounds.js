"use strict";
var pointPool_1 = require("./pointPool");
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
    Object.defineProperty(Bounds.prototype, "width", {
        get: function () {
            return this.right - this.left;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Bounds.prototype, "height", {
        get: function () {
            return this.bottom - this.top;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Bounds.prototype.getCentre = function () {
        var w = this.width;
        var h = this.height;
        return pointPool_1.PointPool.instance.borrow(this.left + (w / 2), this.top + (h / 2));
    };
    ;
    return Bounds;
}());
exports.Bounds = Bounds;
//# sourceMappingURL=bounds.js.map