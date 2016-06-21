"use strict";
var cropperDrawSettings_1 = require("./cropperDrawSettings");
var CropperSettings = (function () {
    function CropperSettings() {
        this.canvasWidth = 300;
        this.canvasHeight = 300;
        this.width = 200;
        this.height = 200;
        this.croppedWidth = 100;
        this.croppedHeight = 100;
        this.keepAspect = true;
        this.cropperDrawSettings = new cropperDrawSettings_1.CropperDrawSettings();
    }
    return CropperSettings;
}());
exports.CropperSettings = CropperSettings;
//# sourceMappingURL=cropperSettings.js.map