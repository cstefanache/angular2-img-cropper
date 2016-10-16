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
var core_1 = require("@angular/core");
var imageCropper_1 = require("./imageCropper");
var cropperSettings_1 = require("./cropperSettings");
var exif_1 = require("./exif");
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
        this.renderer.setElementAttribute(canvas, "width", this.settings.canvasWidth.toString());
        this.renderer.setElementAttribute(canvas, "height", this.settings.canvasHeight.toString());
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
            var bounds = this.cropper.getCropBounds();
            this.image.image = this.cropper.getCroppedImage().src;
            this.settings.cropWidth = bounds.right - bounds.left;
            this.settings.cropHeight = bounds.bottom - bounds.top;
            this.onCrop.emit(bounds);
        }
    };
    ImageCropperComponent.prototype.onMouseDown = function () {
        this.cropper.onMouseDown();
    };
    ImageCropperComponent.prototype.onMouseUp = function () {
        if (this.cropper.isImageSet()) {
            var bounds = this.cropper.getCropBounds();
            this.cropper.onMouseUp();
            this.image.image = this.cropper.getCroppedImage().src;
            this.settings.cropWidth = bounds.right - bounds.left;
            this.settings.cropHeight = bounds.bottom - bounds.top;
            this.onCrop.emit(bounds);
        }
    };
    ImageCropperComponent.prototype.onMouseMove = function (event) {
        this.cropper.onMouseMove(event);
    };
    ImageCropperComponent.prototype.fileChangeListener = function ($event) {
        var file = $event.target.files[0];
        if (this.settings.allowedFilesRegex.test(file.name)) {
            var image_1 = new Image();
            var fileReader = new FileReader();
            var that_1 = this;
            fileReader.addEventListener("loadend", function (loadEvent) {
                image_1.src = loadEvent.target.result;
                that_1.setImage(image_1);
            });
            fileReader.readAsDataURL(file);
        }
    };
    ImageCropperComponent.prototype.setImage = function (image) {
        var self = this;
        this.intervalRef = window.setInterval(function () {
            if (this.intervalRef) {
                clearInterval(this.intervalRef);
            }
            if (image.naturalHeight > 0) {
                image.height = image.naturalHeight;
                image.width = image.naturalWidth;
                clearInterval(self.intervalRef);
                self.getOrientedImage(image, function (img) {
                    self.cropper.setImage(img);
                    self.image.original = img;
                    var bounds = self.cropper.getCropBounds();
                    self.image.image = self.cropper.getCroppedImage().src;
                    self.settings.cropWidth = bounds.right - bounds.left;
                    self.settings.cropHeight = bounds.bottom - bounds.top;
                    self.onCrop.emit(bounds);
                });
            }
        }, 10);
    };
    ImageCropperComponent.prototype.getOrientedImage = function (image, callback) {
        var img;
        exif_1.Exif.getData(image, function () {
            var orientation = exif_1.Exif.getTag(image, "Orientation");
            if ([3, 6, 8].indexOf(orientation) > -1) {
                var canvas = document.createElement("canvas"), ctx = canvas.getContext("2d"), cw = image.width, ch = image.height, cx = 0, cy = 0, deg = 0;
                switch (orientation) {
                    case 3:
                        cx = -image.width;
                        cy = -image.height;
                        deg = 180;
                        break;
                    case 6:
                        cw = image.height;
                        ch = image.width;
                        cy = -image.height;
                        deg = 90;
                        break;
                    case 8:
                        cw = image.height;
                        ch = image.width;
                        cx = -image.width;
                        deg = 270;
                        break;
                    default:
                        break;
                }
                canvas.width = cw;
                canvas.height = ch;
                ctx.rotate(deg * Math.PI / 180);
                ctx.drawImage(image, cx, cy);
                img = document.createElement("img");
                img.width = cw;
                img.height = ch;
                img.src = canvas.toDataURL("image/png");
            }
            else {
                img = image;
            }
            callback(img);
        });
    };
    __decorate([
        core_1.ViewChild("cropcanvas", undefined), 
        __metadata('design:type', core_1.ElementRef)
    ], ImageCropperComponent.prototype, "cropcanvas", void 0);
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
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], ImageCropperComponent.prototype, "onCrop", void 0);
    ImageCropperComponent = __decorate([
        core_1.Component({
            selector: "img-cropper", template: "\n    <span class=\"ng2-imgcrop\">\n      <input *ngIf=\"!settings.noFileInput\" type=\"file\" (change)=\"fileChangeListener($event)\" >\n      <canvas #cropcanvas\n              (mousedown)=\"onMouseDown($event)\"\n              (mouseup)=\"onMouseUp($event)\"\n              (mousemove)=\"onMouseMove($event)\"\n              (mouseleave)=\"onMouseUp($event)\"\n              (touchmove)=\"onTouchMove($event)\"\n              (touchend)=\"onTouchEnd($event)\"\n              (touchstart)=\"onTouchStart($event)\">\n      </canvas>\n    </span>\n  "
        }), 
        __metadata('design:paramtypes', [core_1.Renderer])
    ], ImageCropperComponent);
    return ImageCropperComponent;
}(core_1.Type));
exports.ImageCropperComponent = ImageCropperComponent;
//# sourceMappingURL=imageCropperComponent.js.map