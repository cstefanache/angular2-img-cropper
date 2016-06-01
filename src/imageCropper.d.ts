/// <reference path="../typings/browser.d.ts" />
import { Renderer, ElementRef } from '@angular/core';
import { PointPool } from './model/pointPool';
import { Point } from './model/point';
import { Bounds } from './model/bounds';
import { CornerMarker } from './model/cornerMarker';
import { DragMarker } from './model/dragMarker';
export declare class ImageCropperComponent {
    cropcanvas:ElementRef;
    private cropper;
    private renderer;
    image:any;
    croppedWidth:number;
    croppedHeight:number;
    settings:CropperSettings;

    constructor(renderer:Renderer);

    ngAfterViewInit():void;

    onMouseDown($event:any):void;

    onMouseUp($event:any):void;

    onMouseMove($event:any):void;

    fileChangeListener($event:any):void;
}
export declare class CropperSettings {
    canvasWidth:number;
    canvasHeight:number;
    width:number;
    height:number;
    croppedWidth:number;
    croppedHeight:number;

    constructor();
}
export declare class ImageCropperModel {
    protected canvas:HTMLCanvasElement;
    protected x:number;
    protected y:number;
    protected width:number;
    protected height:number;
    protected canvasWidth:number;
    protected canvasHeight:number;
    protected keepAspect:boolean;
    protected touchRadius:number;
    protected currentDragTouches:Array<any>;
    protected isMouseDown:boolean;
    protected ratioW:number;
    protected ratioH:number;
    protected fileType:string;
    protected imageSet:boolean;
    protected pointPool:PointPool;
    protected buffer:HTMLCanvasElement;
    protected cropCanvas:HTMLCanvasElement;
    protected tl:CornerMarker;
    protected tr:CornerMarker;
    protected bl:CornerMarker;
    protected br:CornerMarker;
    protected markers:Array<CornerMarker>;
    protected center:DragMarker;
    protected ctx:any;
    protected aspectRatio:number;
    protected currentlyInteracting:boolean;
    protected srcImage:ImageData;
    protected vertSquashRatio:number;
    protected minXClamp:number;
    protected minYClamp:number;
    protected maxXClamp:number;
    protected maxYClamp:number;
    protected minHeight:number;
    protected minWidth:number;
    protected cropWidth:number;
    protected cropHeight:number;
    protected croppedImage:HTMLImageElement;
}
export declare class ImageCropper extends ImageCropperModel {
    private crop;

    constructor(canvas:HTMLCanvasElement, x:number, y:number, width:number, height:number, croppedWidth:number, croppedHeight:number, keepAspect?:boolean, touchRadius?:number, minWidth?:number, minHeight?:number);

    resizeCanvas(width:any, height:any):void;

    draw(ctx:any):void;

    dragCrop(x:any, y:any, marker:any):void;

    enforceMinSize(x:any, y:any, marker:any):Point;

    dragCorner(x:any, y:any, marker:any):void;

    getSide(a:any, b:any, c:any):any;

    sign(x:any):any;

    handleRelease(newCropTouch:any):void;

    handleMove(newCropTouch:any):void;

    updateClampBounds():void;

    getCropBounds():Bounds;

    clampPosition(x:any, y:any):Point;

    isImageSet():boolean;

    setImage(img:any):void;

    getCroppedImage(fillWidth?:number, fillHeight?:number):HTMLImageElement;

    getBounds():Bounds;

    setBounds(bounds:any):void;

    getMousePos(canvas:any, evt:any):Point;

    getTouchPos(canvas:any, touch:any):Point;

    onTouchMove(e:any):void;

    onMouseMove(e:any):void;

    move(cropTouch:any, e:any):void;

    getDragTouchForID(id:any):any;

    drawCursors(cropTouch:any, e:any):void;

    drawCornerCursor(marker:any, x:any, y:any, e:any):boolean;

    onTouchStart(e:any):void;

    onTouchEnd(e:any):void;

    drawImageIOSFix(ctx:any, img:any, sx:any, sy:any, sw:any, sh:any, dx:any, dy:any, dw:any, dh:any):void;

    detectVerticalSquash(img:any):number;

    onMouseDown(e:any):void;

    onMouseUp(e:any):void;
}
