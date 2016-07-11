"use strict";
var CropService = (function () {
    function CropService() {
        this.DEG2RAD = 0.0174532925;
    }

    CropService.prototype.init = function (canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
    };
    ;
    return CropService;
}());
exports.CropService = CropService;
//# sourceMappingURL=cropService.js.map