import {Component, ViewChild, Type} from '@angular/core';
import {ImageCropperComponent, CropperSettings, Bounds} from '../index';

@Component({
    selector: 'test-app',
    template: `
    <div class="row">
      <h2>Sample cropper 1</h2>
      <div class="col s6">
        <div class="card">
          <div class="card-image">
            <img-cropper [image]="data1" [settings]="cropperSettings1" (onCrop)="cropped($event)"></img-cropper>
            <span class="card-title">source image</span>
          </div>
          <div class="card-content">
          </div>
        </div>
      </div>


    <div class="col s6">
      <div class="card horizontal">
        <div class="card-image">
        <span class="result" *ngIf="data1.image" >
            <img [src]="data1.image" [width]="cropperSettings1.croppedWidth" [height]="cropperSettings1.croppedHeight">
        </span>
        </div>
        <div class="card-stacked">
          <div class="card-content">
          <span class="card-title">settings</span>
<div>
<pre><code>this.cropperSettings1 = new CropperSettings();
this.cropperSettings1.width = 200;
this.cropperSettings1.height = 200;

this.cropperSettings1.croppedWidth = 200;
this.cropperSettings1.croppedHeight = 200;

this.cropperSettings1.canvasWidth = 691;
this.cropperSettings1.canvasHeight = 377;

this.cropperSettings1.minWidth = 100;
this.cropperSettings1.minHeight = 100;

this.cropperSettings1.rounded = false;

this.cropperSettings1.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
this.cropperSettings1.cropperDrawSettings.strokeWidth = 2;
</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>


        <div class="pull-left">
            <h3>
                Sample cropper 2
            </h3>
           <div class="file-upload">
                <span class="text">upload</span>
                <input id="custom-input" type="file" (change)="fileChangeListener($event)">
            </div>

            <img-cropper #cropper [image]="data2" [settings]="cropperSettings2"></img-cropper>
            <br>
            <span class="result rounded" *ngIf="data2.image" >
                <img [src]="data2.image" [width]="cropperSettings2.croppedWidth" [height]="cropperSettings2.croppedHeight">
            </span>
            <h4>Settings:</h4>
            <pre>
this.cropperSettings2 = new CropperSettings();
this.cropperSettings2.width = 200;
this.cropperSettings2.height = 200;
this.cropperSettings2.keepAspect = false;

this.cropperSettings2.croppedWidth = 200;
this.cropperSettings2.croppedHeight = 200;

this.cropperSettings2.canvasWidth = 500;
this.cropperSettings2.canvasHeight = 300;

this.cropperSettings2.minWidth = 100;
this.cropperSettings2.minHeight = 100;

this.cropperSettings2.rounded = true;
this.cropperSettings2.minWithRelativeToResolution = false;

this.cropperSettings2.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
this.cropperSettings2.cropperDrawSettings.strokeWidth = 2;
this.cropperSettings2.noFileInput = true;
            </pre>
        </div>
    `
})
export class AppComponent extends Type {

    //Cropper 1 data
    data1:any;
    cropperSettings1:CropperSettings;

    //Cropper 2 data
    data2:any;
    cropperSettings2:CropperSettings;
    @ViewChild('cropper', undefined) cropper:ImageCropperComponent;


    constructor() {
        super();

        this.cropperSettings1 = new CropperSettings();
        this.cropperSettings1.width = 200;
        this.cropperSettings1.height = 300;

        this.cropperSettings1.croppedWidth = 200;
        this.cropperSettings1.croppedHeight = 300;

        this.cropperSettings1.canvasWidth = 691;
        this.cropperSettings1.canvasHeight = 377;

        this.cropperSettings1.minWidth = 100;
        this.cropperSettings1.minHeight = 100;

        this.cropperSettings1.rounded = false;

        this.cropperSettings1.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
        this.cropperSettings1.cropperDrawSettings.strokeWidth = 2;

        this.cropperSettings1.keepAspect = true;

        this.cropperSettings1.initialX = 305;
        this.cropperSettings1.initialY = 60;
        this.cropperSettings1.initialW = 119;
        this.cropperSettings1.initialH = 119;

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

        this.cropperSettings2.minWidth = 100;
        this.cropperSettings2.minHeight = 100;

        this.cropperSettings2.rounded = true;
        this.cropperSettings2.minWithRelativeToResolution = false;

        this.cropperSettings2.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
        this.cropperSettings2.cropperDrawSettings.strokeWidth = 2;
        this.cropperSettings2.noFileInput = true;

        this.data2 = {};

    }

    cropped(bounds:Bounds) {
        //console.log(bounds);
    }

    /**
     * Used to send image to second cropper
     * @param $event
     */
    fileChangeListener($event) {
        var image:any = new Image();
        var file:File = $event.target.files[0];
        var myReader:FileReader = new FileReader();
        var that = this;
        myReader.addEventListener('loadend', function (loadEvent:any) {
            image.src = loadEvent.target.result;
            that.cropper.setImage(image);
        });

        myReader.readAsDataURL(file);
    }
}
