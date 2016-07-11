"use strict";
var cropperDrawSettings_1 = require("./cropperDrawSettings");
var CropperSettings = (function () {
    function CropperSettings() {
        this.canvasWidth = 300;
        this.canvasHeight = 300;
        this.width = 200;
        this.height = 200;
        this.minWidth = 50;
        this.minHeight = 50;
        this.minWithRelativeToResolution = true;
        this.croppedWidth = 100;
        this.croppedHeight = 100;
        this.cropperDrawSettings = new cropperDrawSettings_1.CropperDrawSettings();
        this.touchRadius = 20;
        this.noFileInput = false;
        this._rounded = false;
        this._keepAspect = true;
    }
    Object.defineProperty(CropperSettings.prototype, "rounded", {
        get: function () {
            return this._rounded;
        },
        set: function (val) {
            this._rounded = val;
            if (val) {
                this._keepAspect = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CropperSettings.prototype, "keepAspect", {
        get: function () {
            return this._keepAspect;
        },
        set: function (val) {
            if (val === false && this._rounded) {
                throw new Error("Cannot set keep aspect to false on rounded cropper. Ellipsis not supported");
            }
            this._keepAspect = val;
        },
        enumerable: true,
        configurable: true
    });
    return CropperSettings;
}());
exports.CropperSettings = CropperSettings;
//# sourceMappingURL=cropperSettings.js.map