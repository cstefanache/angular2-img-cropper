import { CropperDrawSettings } from "./cropperDrawSettings";
export declare class CropperSettings {
    canvasWidth: number;
    canvasHeight: number;
    width: number;
    height: number;
    minWidth: number;
    minHeight: number;
    minWithRelativeToResolution: boolean;
    croppedWidth: number;
    croppedHeight: number;
    cropperDrawSettings: CropperDrawSettings;
    touchRadius: number;
    noFileInput: boolean;
    private _rounded;
    private _keepAspect;
    rounded: boolean;
    keepAspect: boolean;
}
