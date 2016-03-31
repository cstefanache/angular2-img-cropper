import {Component} from 'angular2/core';
import {ImageCropperComponent, CropperSettings} from '../components';


@Component({
    selector: 'test-app',
    template: `<div>
        <img-cropper [image]="data" [settings]="cropperSettings"></img-cropper><br>
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
        this.cropperSettings.canvasWidth = 400;
        this.cropperSettings.canvasHeight = 300;

        this.data = {};

    }
}
