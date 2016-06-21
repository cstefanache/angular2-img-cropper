import {Component, ViewChild, Type} from '@angular/core';
import {ImageCropperComponent, CropperSettings, Bounds} from '../index';



@Component({
    selector: 'test-app',
    template: `<div>

        <img-cropper [image]="data" [settings]="cropperSettings" (onCrop)="cropped($event)"></img-cropper>
        <br>
        <span class="result" *ngIf="data.image" >
            <img [src]="data.image" [width]="cropperSettings.croppedWidth" [height]="cropperSettings.croppedHeight">
        </span>
    </div>`,
    styles: [`
        .result {
            margin-top: 30px;
            border: 1px solid rgba(125,125,125,0.6);
            display: inline-block;
            padding: 1px;
        }
    `],
    directives: [ImageCropperComponent]
})
export class AppComponent extends Type {
    data:any;
    cropperSettings:CropperSettings;

    constructor() {
        super();

        this.cropperSettings = new CropperSettings();
        this.cropperSettings.width = 200;
        this.cropperSettings.height = 200;

        this.cropperSettings.croppedWidth = 200;
        this.cropperSettings.croppedHeight = 200;

        this.cropperSettings.canvasWidth = 500;
        this.cropperSettings.canvasHeight = 300;

        this.cropperSettings.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
        this.cropperSettings.cropperDrawSettings.strokeWidth = 1;

        this.data = {};

    }

    cropped(bounds:Bounds) {
        //console.log(bounds);
    }
}
