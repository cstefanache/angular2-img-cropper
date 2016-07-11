import {CropperDrawSettings} from "./cropperDrawSettings";
export class CropperSettings {
    canvasWidth:number = 300;
    canvasHeight:number = 300;

    width:number = 200;
    height:number = 200;

    minWidth:number = 50;
    minHeight:number = 50;
    minWithRelativeToResolution:boolean = true;

    croppedWidth:number = 100;
    croppedHeight:number = 100;


    cropperDrawSettings:CropperDrawSettings = new CropperDrawSettings();
    touchRadius:number = 20;
    noFileInput:boolean = false;

    private _rounded:boolean = false;
    private _keepAspect:boolean = true;

    set rounded(val:boolean) {
        this._rounded = val;
        if (val) {
            this._keepAspect = true;
        }
    }

    get rounded() {
        return this._rounded;
    }

    set keepAspect(val:boolean) {
        if (val === false && this._rounded) {
            throw new Error("Cannot set keep aspect to false on rounded cropper. Ellipsis not supported");
        }

        this._keepAspect = val;
    }

    get keepAspect() {
        return this._keepAspect;
    }

}