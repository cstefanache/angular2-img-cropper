import {CropperDrawSettings} from "./cropperDrawSettings";
export class CropperSettings {
    public canvasWidth: number = 300;
    public canvasHeight: number = 300;

    public width: number = 200;
    public height: number = 200;

    public minWidth: number = 50;
    public minHeight: number = 50;
    public minWithRelativeToResolution: boolean = true;

    public croppedWidth: number = 100;
    public croppedHeight: number = 100;


    public cropperDrawSettings: CropperDrawSettings = new CropperDrawSettings();
    public touchRadius: number = 20;
    public noFileInput: boolean = false;

    public allowedFilesRegex: RegExp = /\.(jpe?g|png|gif)$/i;

    private _rounded: boolean = false;
    private _keepAspect: boolean = true;

    set rounded(val: boolean) {
        this._rounded = val;
        if (val) {
            this._keepAspect = true;
        }
    }

    get rounded() {
        return this._rounded;
    }

    set keepAspect(val: boolean) {
        if (val === false && this._rounded) {
            throw new Error("Cannot set keep aspect to false on rounded cropper. Ellipsis not supported");
        }

        this._keepAspect = val;
    }

    get keepAspect(): boolean {
        return this._keepAspect;
    }

}