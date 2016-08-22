import {Component, Input, Renderer, ViewChild, ElementRef, Output, EventEmitter, Type} from '@angular/core';
import {ImageCropper} from "./imageCropper";
import {CropperSettings} from "./cropperSettings";
import {Exif} from "./exif";

@Component({
    selector: 'img-cropper',
    template: `
    <span class="ng2-imgcrop">
      <input *ngIf="!settings.noFileInput" type="file" (change)="fileChangeListener($event)" >
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

    intervalRef:number;

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
        var file:File = $event.target.files[0];
        if (this.settings.allowedFilesRegex.test(file.name)) {
            var image:any = new Image();
            var fileReader:FileReader = new FileReader();
            var that = this;

            fileReader.addEventListener('loadend', function (loadEvent:any) {
                image.src = loadEvent.target.result;
                that.setImage(image);
            });

            fileReader.readAsDataURL(file);
        }
    }


    setImage(image) {
        var self = this;

        this.intervalRef = setInterval(function () {
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
                    self.image.image = self.cropper.getCroppedImage().src;
                    self.onCrop.emit(self.cropper.getCropBounds());
                });
            }
        }, 10);

    }

    private getOrientedImage(image, callback) {
        var img:any;

        Exif.getData(image, function () {
            var orientation = Exif.getTag(image, 'Orientation');

            if ([3, 6, 8].indexOf(orientation) > -1) {
                var canvas:HTMLCanvasElement = document.createElement("canvas"),
                    ctx:CanvasRenderingContext2D = canvas.getContext("2d"),
                    cw:number = image.width, ch:number = image.height, cx:number = 0, cy:number = 0, deg:number = 0;
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
                }

                canvas.width = cw;
                canvas.height = ch;
                ctx.rotate(deg * Math.PI / 180);
                ctx.drawImage(image, cx, cy);
                img = document.createElement("img");
                img.width = cw;
                img.height = ch;
                img.src = canvas.toDataURL("image/png");

            } else {
                img = image;
            }

            callback(img);
        });
    }

}

