"use strict";
var point_1 = require("./point");
var cropperSettings_1 = require("../cropperSettings");
var Handle = (function () {
    function Handle(x, y, radius, settings) {
        this.cropperSettings = new cropperSettings_1.CropperSettings();
        this.over = false;
        this.drag = false;
        this._position = new point_1.Point(x, y);
        this.offset = new point_1.Point(0, 0);
        this.radius = radius;
        this.cropperSettings = settings;
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
        return (x > this.position.x - this.radius + this.offset.x) &&
            (x < this.position.x + this.radius + this.offset.x) &&
            (y > this.position.y - this.radius + this.offset.y) &&
            (y < this.position.y + this.radius + this.offset.y);
    };
    Object.defineProperty(Handle.prototype, "position", {
        get: function () {
            return this._position;
        },
        enumerable: true,
        configurable: true
    });
    Handle.prototype.setPosition = function (x, y) {
        this._position.x = x;
        this._position.y = y;
    };
    return Handle;
}());
exports.Handle = Handle;
//# sourceMappingURL=handle.js.map