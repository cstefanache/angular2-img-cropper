import {Component, Renderer, ViewChild, ElementRef, Output, EventEmitter, Type} from '@angular/core';
import {ImageCropper} from "./imageCropper";
import {CropperSettings} from "./cropperSettings";

@Component({
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
})
export class ImageCropperComponent extends Type {

    @ViewChild('cropcanvas', undefined) cropcanvas:ElementRef;
    @Output() onCrop:EventEmitter<any> = new EventEmitter();

    cropper:ImageCropper;
    image:any;
    croppedWidth:number;
    croppedHeight:number;
    settings:CropperSettings;

    private renderer:Renderer;

    constructor(renderer:Renderer) {
        super();
        this.renderer = renderer;
    }

    ngAfterViewInit() {
        var canvas:any = this.cropcanvas.nativeElement;

        if (!this.settings) {
            this.settings = new CropperSettings();
        }

        this.renderer.setElementAttribute(canvas, 'width', this.settings.canvasWidth.toString());
        this.renderer.setElementAttribute(canvas, 'height', this.settings.canvasHeight.toString());

        if (!this.cropper) {
            this.cropper = new ImageCropper(this.settings);
        }

        this.cropper.prepare(canvas);
    }

    onTouchMove(event):void {
        this.cropper.onTouchMove(event);
    }

    onTouchStart(event):void {
        this.cropper.onTouchStart();
    }

    onTouchEnd(event):void {
        this.cropper.onTouchEnd(event);
        if (this.cropper.isImageSet()) {
            this.image.image = this.cropper.getCroppedImage().src;
            this.onCrop.emit(this.cropper.getCropBounds());
        }
    }

    onMouseDown():void {
        this.cropper.onMouseDown();
    }

    onMouseUp():void {
        if (this.cropper.isImageSet()) {
            this.cropper.onMouseUp();
            this.image.image = this.cropper.getCroppedImage().src;
            this.onCrop.emit(this.cropper.getCropBounds());
        }
    }

    onMouseMove(event):void {
        this.cropper.onMouseMove(event);
    }

    fileChangeListener($event) {
        var image:any = new Image();
        var file:File = $event.target.files[0];
        var myReader:FileReader = new FileReader();
        var that = this;

        myReader.onloadend = function (loadEvent:any) {
            image.src = loadEvent.target.result;
            that.cropper.setImage(image);
            that.image.image = that.cropper.getCroppedImage().src;
            that.onCrop.emit(that.cropper.getCropBounds());
        };

        myReader.readAsDataURL(file);
    }

}

