import {Component, ViewChild, Type} from "@angular/core";
import {ImageCropperComponent, CropperSettings, Bounds} from "../index";

@Component({
    selector: "test-app",
    templateUrl: "./app.html",
    styleUrls: [ "./app.css" ],
    directives: [
        ImageCropperComponent
    ]
})
export class AppComponent extends Type {

    // Cropper 1 data
    private data1: any;
    private cropperSettings1: CropperSettings;

    // Cropper 2 data
    private data2: any;
    private cropperSettings2: CropperSettings;

    @ViewChild("cropper", undefined) cropper: ImageCropperComponent;

    constructor() {
        super();

        this.cropperSettings1 = new CropperSettings();
        this.cropperSettings1.width = 200;
        this.cropperSettings1.height = 200;

        this.cropperSettings1.croppedWidth = 200;
        this.cropperSettings1.croppedHeight = 200;

        this.cropperSettings1.canvasWidth = 500;
        this.cropperSettings1.canvasHeight = 300;

        this.cropperSettings1.minWidth = 100;
        this.cropperSettings1.minHeight = 100;

        this.cropperSettings1.rounded = false;

        this.cropperSettings1.cropperDrawSettings.strokeColor = "rgba(255,255,255,1)";
        this.cropperSettings1.cropperDrawSettings.strokeWidth = 2;

        this.data1 = {};

        // Cropper settings 2
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
