"use strict";
var CropTouch = (function () {
    function CropTouch(x, y, id) {
        this.id = id || 0;
        this.x = x || 0;
        this.y = y || 0;
        this.dragHandle = null;
    }
    return CropTouch;
}());
exports.CropTouch = CropTouch;
//# sourceMappingURL=cropTouch.js.map