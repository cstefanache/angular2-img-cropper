import {Component, ViewChild} from '@angular/core';
import {ImageCropperComponent, CropperSettings, Bounds} from '../index';


@Component({
    selector: 'test-app',
    template: `<div>
        <img-cropper [image]="data" [settings]="cropperSettings" (onCrop)="cropped($event)"></img-cropper><br>

        <img [src]="data.image" [width]="cropperSettings.croppedWidth" [height]="cropperSettings.croppedHeight">

    </div>`,
    directives: [ImageCropperComponent]
})
export class AppComponent {
    data: any;
    cropperSettings: CropperSettings;

    constructor() {

        this.cropperSettings = new CropperSettings();
        this.cropperSettings.width = 100;
        this.cropperSettings.height = 100;
        this.cropperSettings.croppedWidth =100;
        this.cropperSettings.croppedHeight = 100;
        this.cropperSettings.canvasWidth = 500;
        this.cropperSettings.canvasHeight = 400;

        this.data = {};

    }

    cropped(bounds:Bounds) {
        console.log(bounds);
    }
}
