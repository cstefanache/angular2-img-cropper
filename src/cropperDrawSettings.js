"use strict";
var CropperDrawSettings = (function () {
    function CropperDrawSettings(strokeWidth, strokeColor) {
        if (strokeWidth === void 0) { strokeWidth = 1; }
        if (strokeColor === void 0) { strokeColor = 'rgba(125,125,255,0.8)'; }
        this.strokeWidth = strokeWidth;
        this.strokeColor = strokeColor;
    }
    return CropperDrawSettings;
}());
exports.CropperDrawSettings = CropperDrawSettings;
//# sourceMappingURL=cropperDrawSettings.js.map