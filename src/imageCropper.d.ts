/// <reference path="../typings/browser.d.ts" />
import { Renderer, ElementRef, EventEmitter } from '@angular/core';
import { Point } from './model/point';
import { Bounds } from './model/bounds';
import { ImageCropperModel } from "./model/imageCropperModel";
import { CropperSettings } from "./cropperSettings";
export declare class ImageCropperComponent {
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
    onMouseDown(): void;
    onMouseUp(): void;
    onMouseMove(event: any): void;
    fileChangeListener($event: any): void;
}
export declare class ImageCropper extends ImageCropperModel {
    private crop;
    constructor(x: number, y: number, width: number, height: number, croppedWidth: number, croppedHeight: number, keepAspect?: boolean, touchRadius?: number, minWidth?: number, minHeight?: number);
    prepare(canvas: HTMLCanvasElement): void;
    resizeCanvas(width: any, height: any): void;
    draw(ctx: any): void;
    dragCrop(x: any, y: any, marker: any): void;
    enforceMinSize(x: any, y: any, marker: any): Point;
    dragCorner(x: any, y: any, marker: any): void;
    getSide(a: any, b: any, c: any): any;
    sign(x: any): any;
    handleRelease(newCropTouch: any): void;
    handleMove(newCropTouch: any): void;
    updateClampBounds(): void;
    getCropBounds(): Bounds;
    clampPosition(x: any, y: any): Point;
    isImageSet(): boolean;
    setImage(img: any): void;
    getCroppedImage(fillWidth?: number, fillHeight?: number): HTMLImageElement;
    getBounds(): Bounds;
    setBounds(bounds: any): void;
    getMousePos(canvas: any, evt: any): Point;
    getTouchPos(canvas: any, touch: any): Point;
    onTouchMove(e: any): void;
    onMouseMove(e: any): void;
    move(cropTouch: any, e: any): void;
    getDragTouchForID(id: any): any;
    drawCursors(cropTouch: any, e: any): void;
    drawCornerCursor(marker: any, x: any, y: any, e: any): boolean;
    onTouchStart(e: any): void;
    onTouchEnd(e: any): void;
    drawImageIOSFix(ctx: any, img: any, sx: any, sy: any, sw: any, sh: any, dx: any, dy: any, dw: any, dh: any): void;
    detectVerticalSquash(img: any): number;
    onMouseDown(): void;
    onMouseUp(): void;
}
