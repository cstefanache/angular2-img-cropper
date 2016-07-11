import { Renderer, ElementRef, EventEmitter, Type } from '@angular/core';
import { ImageCropper } from "./imageCropper";
import { CropperSettings } from "./cropperSettings";
export declare class ImageCropperComponent extends Type {
    cropcanvas: ElementRef;
    onCrop: EventEmitter<any>;
    cropper: ImageCropper;
    image: any;
    croppedWidth: number;
    croppedHeight: number;
    settings: CropperSettings;
    private renderer;
    constructor(renderer: Renderer);
    ngAfterViewInit(): void;
    onTouchMove(event: any): void;
    onTouchStart(event: any): void;
    onTouchEnd(event: any): void;
    onMouseDown(): void;
    onMouseUp(): void;
    onMouseMove(event: any): void;
    fileChangeListener($event: any): void;
}
