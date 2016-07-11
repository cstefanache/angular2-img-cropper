"use strict";
var CropperDrawSettings = (function () {
    function CropperDrawSettings(strokeWidth, strokeColor) {
        if (strokeWidth === void 0) { strokeWidth = 1; }
        if (strokeColor === void 0) { strokeColor = 'rgba(255,255,255,0.9)'; }
        this.strokeWidth = strokeWidth;
        this.strokeColor = strokeColor;
    }
    return CropperDrawSettings;
}());
exports.CropperDrawSettings = CropperDrawSettings;
//# sourceMappingURL=cropperDrawSettings.js.map