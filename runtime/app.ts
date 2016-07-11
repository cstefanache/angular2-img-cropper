import {Component, ViewChild, Type} from '@angular/core';
import {ImageCropperComponent, CropperSettings, Bounds} from '../index';



@Component({
    selector: 'test-app',
    template: `
    <div>
        <div class="pull-left">
            <img-cropper [image]="data1" [settings]="cropperSettings1" (onCrop)="cropped($event)"></img-cropper>
            <br>
            <span class="result" *ngIf="data1.image" >
                <img [src]="data1.image" [width]="cropperSettings1.croppedWidth" [height]="cropperSettings1.croppedHeight">
            </span>
        </div>


        <div class="pull-left">
            <img-cropper [image]="data2" [settings]="cropperSettings2" ></img-cropper>
            <br>
            <span class="result rounded" *ngIf="data2.image" >
                <img [src]="data2.image" [width]="cropperSettings2.croppedWidth" [height]="cropperSettings2.croppedHeight">
            </span>
        </div>
    </div>`,
    styles: [`
        .result {
            margin-top: 30px;
            border: 1px solid rgba(125,125,125,0.6);
            display: inline-block;
            padding: 1px;
        }

        .result.rounded > img {
            border-radius: 100px;
        }

        .pull-left {
            min-width: 400px;
            float: left;
            margin-right: 10px;
            padding: 10px;
            background-color: rgba(0,0,0,0.05);
        }
    `],
    directives: [ImageCropperComponent]
})
export class AppComponent extends Type {
    data1:any;
    data2:any;
    cropperSettings1:CropperSettings;
    cropperSettings2:CropperSettings;

    constructor() {
        super();

        this.cropperSettings1 = new CropperSettings();
        this.cropperSettings1.width = 200;
        this.cropperSettings1.height = 200;

        this.cropperSettings1.croppedWidth = 200;
        this.cropperSettings1.croppedHeight = 200;

        this.cropperSettings1.canvasWidth = 500;
        this.cropperSettings1.canvasHeight = 300;

        this.cropperSettings1.minWidth = 200;
        this.cropperSettings1.minHeight = 200;

        this.cropperSettings1.rounded = false;

        this.cropperSettings1.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
        this.cropperSettings1.cropperDrawSettings.strokeWidth = 2;

        this.data1 = {};


        //Cropper settings 2
        this.cropperSettings2 = new CropperSettings();
        this.cropperSettings2.width = 200;
        this.cropperSettings2.height = 200;
        this.cropperSettings2.keepAspect = false;

        this.cropperSettings2.croppedWidth = 200;
        this.cropperSettings2.croppedHeight = 200;

        this.cropperSettings2.canvasWidth = 500;
        this.cropperSettings2.canvasHeight = 300;

        this.cropperSettings2.minWidth = 200;
        this.cropperSettings2.minHeight = 200;

        this.cropperSettings2.rounded = true;
        this.cropperSettings2.minWithRelativeToResolution = false;

        this.cropperSettings2.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
        this.cropperSettings2.cropperDrawSettings.strokeWidth = 2;

        this.data2 = {};

    }

    cropped(bounds:Bounds) {
        //console.log(bounds);
    }
}
