import { Renderer, Type } from "@angular/core";
export declare class ImageCropperComponent extends Type {
    private cropcanvas;
    private settings;
    private image;
    private cropper;
    private onCrop;
    private croppedWidth;
    private croppedHeight;
    private intervalRef;
    private renderer;
    constructor(renderer: Renderer);
    ngAfterViewInit(): void;
    onTouchMove(event: any): void;
    onTouchStart(event: TouchEvent): void;
    onTouchEnd(event: any): void;
    onMouseDown(): void;
    onMouseUp(): void;
    onMouseMove(event: any): void;
    fileChangeListener($event: any): void;
    setImage(image: any): void;
    private getOrientedImage(image, callback);
}
