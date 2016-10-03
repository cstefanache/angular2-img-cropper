import { Component, ViewChild, Type, OnInit, Inject, ElementRef } from '@angular/core';
import { ImageCropperComponent, CropperSettings, Bounds } from '../index';

@Component({
    selector: 'test-app',
    template: `
    <md-toolbar color="primary">
      Angular Material 2 App
    </md-toolbar>
    <div style="padding: 7px">
      <md-tab-group [class.fix]="fix">
        <md-tab>
          <template md-tab-label>a very very loooong label</template>
          <template md-tab-content>
            <h1>some contentasd</h1>
            <button md-raised-button color="primary" (click)="fix = !fix">Fix problem</button>
          </template>
        </md-tab>
        <md-tab>
          <template md-tab-label>a very very loooong label long long long</template>
          <template md-tab-content>
            <h1>some content</h1>
          </template>
        </md-tab>
      </md-tab-group>
    </div>

    <div class="mui-appbar">
      <table width="100%">
        <tr style="vertical-align:middle;">
          <td class="mui--appbar-height" style="color: white;">angular2-img-cropper - demo</td>
        </tr>
      </table>
    </div>

    <ul class="mui-tabs__bar mui-tabs__bar--justified">
      <li class="mui--is-active"><a data-mui-toggle="tab" data-mui-controls="pane-justified-1">Settings demo 1</a></li>
      <li><a data-mui-toggle="tab" data-mui-controls="pane-justified-2">Settings demo 2</a></li>
    </ul>
    <div class="mui-tabs__pane mui--is-active" id="pane-justified-1">
    <div class="mui-container-fluid">
      <div class="mui-row">
        <div class="mui-col-md-6">
          <div class="mui--text-dark mui--text-headline">source:</div>
          <img-cropper [image]="data1" [settings]="cropperSettings1" (onCrop)="cropped($event)"></img-cropper>
        </div>
        <div class="mui-col-md-6">
            <div class="mui--text-title">result:</div>
            <br/>
            <span *ngIf="data1.image" >
            <img [src]="data1.image" [width]="cropperSettings1.croppedWidth" [height]="cropperSettings1.croppedHeight">
            </span>
        </div>
        </div>
        <br/>
          <div class="mui--text-title">settings:</div>
<pre>
<code>
this.cropperSettings1 = new CropperSettings();
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
</code>
</pre>
      </div>
    </div>


    <div class="mui-tabs__pane" id="pane-justified-2">
    <div class="mui-container-fluid">
      <div class="mui-row">
        <div class="mui-col-md-6">
          <div class="mui--text-dark mui--text-headline">source:</div>
            <img-cropper #cropper [image]="data2" [settings]="cropperSettings2"></img-cropper>
            <div class="file-upload">
                  <label class="mui-btn mui-btn--raised mui-btn--primary">
                    upload
                    <input id="file_input_file" class="none" type="file" style="display: none;" (change)="fileChangeListener($event)"/>
                  </label>
              </div>
        </div>
        <div class="mui-col-md-6">
            <div class="mui--text-title">result:</div>
            <br/>
            <span *ngIf="data2.image" >
              <img [src]="data2.image" [width]="cropperSettings2.croppedWidth" [height]="cropperSettings2.croppedHeight" style="border-radius: 100px">
            </span>
        </div>
        </div>
        <br/>
          <div class="mui--text-title">settings:</div>
<pre>
<code>
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
</code>
</pre>
      </div>
    </div>
    `
})
export class AppComponent extends Type {

    //Cropper 1 data
    data1: any;
    cropperSettings1: CropperSettings;

    //Cropper 2 data
    data2: any;
    cropperSettings2: CropperSettings;
    @ViewChild('cropper', undefined) cropper: ImageCropperComponent;


    constructor( @Inject(ElementRef) elementRef: ElementRef) {
        super();
        this.elementRef = elementRef;

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

        this.cropperSettings1.keepAspect = false;

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

    cropped(bounds: Bounds) {
        //console.log(bounds);
    }

    /**
     * Used to send image to second cropper
     * @param $event
     */
    fileChangeListener($event) {
        var image: any = new Image();
        var file: File = $event.target.files[0];
        var myReader: FileReader = new FileReader();
        var that = this;
        myReader.addEventListener('loadend', function(loadEvent: any) {
            image.src = loadEvent.target.result;
            that.cropper.setImage(image);
        });

        myReader.readAsDataURL(file);
    }
}
