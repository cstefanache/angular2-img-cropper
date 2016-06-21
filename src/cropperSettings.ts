import {CropperDrawSettings} from "./cropperDrawSettings";
export class CropperSettings {
    canvasWidth:number;
    canvasHeight:number;

    width:number;
    height:number;

    croppedWidth:number;
    croppedHeight:number;

    keepAspect:boolean;
    cropperDrawSettings:CropperDrawSettings;


    constructor() {
        this.canvasWidth = 300;
        this.canvasHeight = 300;
        this.width = 200;
        this.height = 200;
        this.croppedWidth = 100;
        this.croppedHeight = 100;
        this.keepAspect = true;
        this.cropperDrawSettings = new CropperDrawSettings();

    }
}