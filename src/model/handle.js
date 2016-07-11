"use strict";
var point_1 = require('./point');
var Handle = (function () {
    function Handle(x, y, radius, cropperSettings) {
        this.cropperSettings = cropperSettings;
        this.over = false;
        this.drag = false;
        this.position = new point_1.Point(x, y);
        this.offset = new point_1.Point(0, 0);
        this.radius = radius;
    }
    Handle.prototype.setDrag = function (value) {
        this.drag = value;
        this.setOver(value);
    };
    Handle.prototype.draw = function (ctx) {
    };
    Handle.prototype.setOver = function (over) {
        this.over = over;
    };
    Handle.prototype.touchInBounds = function (x, y) {
        return (x > this.position.x - this.radius + this.offset.x &&
            x < this.position.x + this.radius + this.offset.x &&
            y > this.position.y - this.radius + this.offset.y &&
            y < this.position.y + this.radius + this.offset.y);
    };
    Handle.prototype.getPosition = function () {
        return this.position;
    };
    Handle.prototype.setPosition = function (x, y) {
        this.position.x = x;
        this.position.y = y;
    };
    return Handle;
}());
exports.Handle = Handle;
//# sourceMappingURL=handle.js.map