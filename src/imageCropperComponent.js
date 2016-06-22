System.register(['@angular/core', "./imageCropper", "./cropperSettings"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, imageCropper_1, cropperSettings_1;
    var ImageCropperComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (imageCropper_1_1) {
                imageCropper_1 = imageCropper_1_1;
            },
            function (cropperSettings_1_1) {
                cropperSettings_1 = cropperSettings_1_1;
            }],
        execute: function() {
            let ImageCropperComponent = class ImageCropperComponent extends core_1.Type {
                constructor(renderer) {
                    super();
                    this.onCrop = new core_1.EventEmitter();
                    this.renderer = renderer;
                }
                ngAfterViewInit() {
                    var canvas = this.cropcanvas.nativeElement;
                    if (!this.settings) {
                        this.settings = new cropperSettings_1.CropperSettings();
                    }
                    this.renderer.setElementAttribute(canvas, 'width', this.settings.canvasWidth.toString());
                    this.renderer.setElementAttribute(canvas, 'height', this.settings.canvasHeight.toString());
                    if (!this.cropper) {
                        this.cropper = new imageCropper_1.ImageCropper(0, 0, this.settings.width, this.settings.height, this.settings.croppedWidth, this.settings.croppedHeight, this.settings.cropperDrawSettings, this.settings.keepAspect);
                    }
                    this.cropper.prepare(canvas);
                    if (this.image != {}) {
                        var imgObj = new Image();
                        imgObj.src = this.image.image;
                        this.cropper.setImage(imgObj);
                        this.image.image = this.cropper.getCroppedImage().src;
                        this.onCrop.emit(this.cropper.getCropBounds());
                    }
                }
                onTouchMove(event) {
                    this.cropper.onTouchMove(event);
                }
                onTouchStart(event) {
                    this.cropper.onTouchStart();
                }
                onTouchEnd(event) {
                    this.cropper.onTouchEnd(event);
                    if (this.cropper.isImageSet()) {
                        this.image.image = this.cropper.getCroppedImage().src;
                        this.onCrop.emit(this.cropper.getCropBounds());
                    }
                }
                onMouseDown() {
                    this.cropper.onMouseDown();
                }
                onMouseUp() {
                    if (this.cropper.isImageSet()) {
                        this.cropper.onMouseUp();
                        this.image.image = this.cropper.getCroppedImage().src;
                        this.onCrop.emit(this.cropper.getCropBounds());
                    }
                }
                onMouseMove(event) {
                    this.cropper.onMouseMove(event);
                }
                fileChangeListener($event) {
                    var image = new Image();
                    var file = $event.target.files[0];
                    var myReader = new FileReader();
                    var that = this;
                    myReader.onloadend = function (loadEvent) {
                        image.src = loadEvent.target.result;
                        that.cropper.setImage(image);
                        that.image.image = that.cropper.getCroppedImage().src;
                        that.onCrop.emit(that.cropper.getCropBounds());
                    };
                    myReader.readAsDataURL(file);
                }
            };
            __decorate([
                core_1.ViewChild('cropcanvas', undefined), 
                __metadata('design:type', core_1.ElementRef)
            ], ImageCropperComponent.prototype, "cropcanvas", void 0);
            __decorate([
                core_1.Output(), 
                __metadata('design:type', core_1.EventEmitter)
            ], ImageCropperComponent.prototype, "onCrop", void 0);
            ImageCropperComponent = __decorate([
                core_1.Component({
                    selector: 'img-cropper',
                    template: `
    <span class="ng2-imgcrop">
      <input type="file" (change)="fileChangeListener($event)">
      <canvas #cropcanvas
              (mousedown)="onMouseDown($event)"
              (mouseup)="onMouseUp($event)"
              (mousemove)="onMouseMove($event)"
              (touchmove)="onTouchMove($event)"
              (touchend)="onTouchEnd($event)"
              (touchstart)="onTouchStart($event)">
      </canvas>
    </span>
  `,
                    inputs: ['image', 'settings', 'cropper']
                }), 
                __metadata('design:paramtypes', [core_1.Renderer])
            ], ImageCropperComponent);
            exports_1("ImageCropperComponent", ImageCropperComponent);
        }
    }
});
//# sourceMappingURL=imageCropperComponent.js.map