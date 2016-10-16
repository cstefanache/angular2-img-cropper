"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var common_1 = require('@angular/common');
var core_1 = require('@angular/core');
var imageCropperComponent_1 = require('./imageCropperComponent');
var ImageCropperModule = (function () {
    function ImageCropperModule() {
    }
    ImageCropperModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule],
            declarations: [imageCropperComponent_1.ImageCropperComponent],
            exports: [imageCropperComponent_1.ImageCropperComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], ImageCropperModule);
    return ImageCropperModule;
}());
exports.ImageCropperModule = ImageCropperModule;
//# sourceMappingURL=imageCropperModule.js.map