"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var imageCropper_1 = require("./imageCropper");
var cropperSettings_1 = require("./cropperSettings");
var ImageCropperComponent = (function (_super) {
    __extends(ImageCropperComponent, _super);
    function ImageCropperComponent(renderer) {
        _super.call(this);
        this.onCrop = new core_1.EventEmitter();
        this.renderer = renderer;
    }
    ImageCropperComponent.prototype.ngAfterViewInit = function () {
        var canvas = this.cropcanvas.nativeElement;
        if (!this.settings) {
            this.settings = new cropperSettings_1.CropperSettings();
        }
        this.renderer.setElementAttribute(canvas, 'width', this.settings.canvasWidth.toString());
        this.renderer.setElementAttribute(canvas, 'height', this.settings.canvasHeight.toString());
        if (!this.cropper) {
            this.cropper = new imageCropper_1.ImageCropper(this.settings);
        }
        this.cropper.prepare(canvas);
    };
    ImageCropperComponent.prototype.onTouchMove = function (event) {
        this.cropper.onTouchMove(event);
    };
    ImageCropperComponent.prototype.onTouchStart = function (event) {
        this.cropper.onTouchStart(event);
    };
    ImageCropperComponent.prototype.onTouchEnd = function (event) {
        this.cropper.onTouchEnd(event);
        if (this.cropper.isImageSet()) {
            this.image.image = this.cropper.getCroppedImage().src;
            this.onCrop.emit(this.cropper.getCropBounds());
        }
    };
    ImageCropperComponent.prototype.onMouseDown = function () {
        this.cropper.onMouseDown();
    };
    ImageCropperComponent.prototype.onMouseUp = function () {
        if (this.cropper.isImageSet()) {
            this.cropper.onMouseUp();
            this.image.image = this.cropper.getCroppedImage().src;
            this.onCrop.emit(this.cropper.getCropBounds());
        }
    };
    ImageCropperComponent.prototype.onMouseMove = function (event) {
        this.cropper.onMouseMove(event);
    };
    ImageCropperComponent.prototype.fileChangeListener = function ($event) {
        var image = new Image();
        var file = $event.target.files[0];
        var fileReader = new FileReader();
        var that = this;
        fileReader.onloadend = function (loadEvent) {
            image.src = loadEvent.target.result;
            that.cropper.setImage(image);
            that.image.original = image;
            that.image.image = that.cropper.getCroppedImage().src;
            that.onCrop.emit(that.cropper.getCropBounds());
        };
        fileReader.readAsDataURL(file);
    };
    ImageCropperComponent.prototype.setImage = function (image) {
        this.cropper.setImage(image);
    };
    __decorate([
        core_1.ViewChild('cropcanvas', undefined), 
        __metadata('design:type', core_1.ElementRef)
    ], ImageCropperComponent.prototype, "cropcanvas", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], ImageCropperComponent.prototype, "onCrop", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', cropperSettings_1.CropperSettings)
    ], ImageCropperComponent.prototype, "settings", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ImageCropperComponent.prototype, "image", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', imageCropper_1.ImageCropper)
    ], ImageCropperComponent.prototype, "cropper", void 0);
    ImageCropperComponent = __decorate([
        core_1.Component({
            selector: 'img-cropper',
            template: "\n    <span class=\"ng2-imgcrop\">\n      <input *ngIf=\"!settings.noFileInput\" type=\"file\" (change)=\"fileChangeListener($event)\">\n      <canvas #cropcanvas\n              (mousedown)=\"onMouseDown($event)\"\n              (mouseup)=\"onMouseUp($event)\"\n              (mousemove)=\"onMouseMove($event)\"\n              (touchmove)=\"onTouchMove($event)\"\n              (touchend)=\"onTouchEnd($event)\"\n              (touchstart)=\"onTouchStart($event)\">\n      </canvas>\n    </span>\n  "
        }), 
        __metadata('design:paramtypes', [core_1.Renderer])
    ], ImageCropperComponent);
    return ImageCropperComponent;
}(core_1.Type));
exports.ImageCropperComponent = ImageCropperComponent;
//# sourceMappingURL=imageCropperComponent.js.map