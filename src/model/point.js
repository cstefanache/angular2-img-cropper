"use strict";
var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype.getNext = function () {
        return this._next;
    };
    Point.prototype.setNext = function (p) {
        this._next = p;
    };
    Point.prototype.getPrev = function () {
        return this._prev;
    };
    Point.prototype.setPrev = function (p) {
        this._prev = p;
    };
    return Point;
}());
exports.Point = Point;
//# sourceMappingURL=point.js.map