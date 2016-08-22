import {Component, Input, Renderer, ViewChild, ElementRef, Output, EventEmitter, Type} from '@angular/core';
import {ImageCropper} from "./imageCropper";
import {CropperSettings} from "./cropperSettings";

@Component({
    selector: 'img-cropper',
    template: `
    <span class="ng2-imgcrop">
      <input *ngIf="!settings.noFileInput" type="file" (change)="fileChangeListener($event)">
      <canvas #cropcanvas
              (mousedown)="onMouseDown($event)"
              (mouseup)="onMouseUp($event)"
              (mousemove)="onMouseMove($event)"
              (touchmove)="onTouchMove($event)"
              (touchend)="onTouchEnd($event)"
              (touchstart)="onTouchStart($event)">
      </canvas>
    </span>
  `
})
export class ImageCropperComponent extends Type {

    @ViewChild('cropcanvas', undefined)
    cropcanvas:ElementRef;


    @Output() onCrop:EventEmitter<any> = new EventEmitter();

    @Input()
    settings:CropperSettings;

    @Input()
    image:any;

    @Input()
    cropper:ImageCropper;

    croppedWidth:number;
    croppedHeight:number;

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

    onTouchStart(event:TouchEvent):void {
        this.cropper.onTouchStart(event);
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
        var fileReader:FileReader = new FileReader();
        var that = this;

        fileReader.addEventListener('loadend', function(loadEvent:any){
            image.src = loadEvent.target.result;
            that.setImage(image);
        });

        fileReader.readAsDataURL(file);
    }

    setImage(image) {
        this.cropper.setImage(image);
        this.image.original = image;
        this.image.image = this.cropper.getCroppedImage().src;
        this.onCrop.emit(this.cropper.getCropBounds());
    }

}

