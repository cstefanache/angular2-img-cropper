import {Component, ViewChild, Type} from "@angular/core";
import {ImageCropperComponent, CropperSettings, Bounds} from "../index";

@Component({
    selector: "test-app",
    template: `
        <h3>Sample</h3>
        <img-cropper 
            [image]="data" 
            [settings]="cropperSettings" 
            (onCrop)="cropped($event)"></img-cropper>
            <br>
        <span class="result" *ngIf="data.image" >
            <img 
                [src]="data.image" 
                [width]="cropperSettings.croppedWidth" 
                [height]="cropperSettings.croppedHeight">
        </span>`,
    styles: [
        ".result {margin-top: 30px;border: 1px solid gray;display: inline-block;padding: 1px;}" +
        ".result.rounded > img {border-radius: 100px;}" +
        ".file-upload {height: 25px; width: 100px; position: relative; border-radius: 3px; display: flex; justify-content: center; align-items: center; border: 1px solid white; overflow: hidden; background-image: linear-gradient(to bottom, #2590EB 50%, #FFFFFF 50%); background-size: 100% 200%; transition: all 1s; color: #FFFFFF; font-size: 100px;}" +
        ".file-upload:hover { background-position: 0 -100%; color: #2590EB; }" +
        ".file-upload .text {font-size: 14px;}" +
        ".file-upload input[type='file'] { height: 25px; width: 100px; position: absolute; top: 0; left: 0; opacity: 0; cursor: pointer; }"
    ],
    directives: [
        ImageCropperComponent
    ]
})
export class AppComponent extends Type {

    // Cropper 1 data
    private data: any;
    private cropperSettings: CropperSettings;

    @ViewChild("cropper", undefined) public cropper: ImageCropperComponent;

    constructor() {
        super();

        this.cropperSettings = new CropperSettings();
        this.cropperSettings.width = 200;
        this.cropperSettings.height = 200;

        this.cropperSettings.croppedWidth = 200;
        this.cropperSettings.croppedHeight = 200;

        this.cropperSettings.canvasWidth = 500;
        this.cropperSettings.canvasHeight = 300;

        this.cropperSettings.minWidth = 100;
        this.cropperSettings.minHeight = 100;

        this.cropperSettings.rounded = false;

        this.cropperSettings.cropperDrawSettings.strokeColor = "rgba(255,255,255,1)";
        this.cropperSettings.cropperDrawSettings.strokeWidth = 2;

        this.data = {};

    }

    public cropped(bounds: Bounds) {
        // console.log(bounds);
    }

    /**
     * Used to send image to second cropper
     * @param $event
     */
    public fileChangeListener($event) {
        let image: any = new Image();
        let file: File = $event.target.files[0];
        let myReader: FileReader = new FileReader();
        let that = this;
        myReader.addEventListener("loadend", function (loadEvent: any) {
            image.src = loadEvent.target.result;
            that.cropper.setImage(image);
        });

        myReader.readAsDataURL(file);
    }
}
