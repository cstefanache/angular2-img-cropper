declare module "src/model/point" {
    export interface IPoint {
        x: number;
        y: number;
        next: Point;
        prev: Point;
    }
    export class Point implements IPoint {
        x: number;
        y: number;
        private _next;
        private _prev;
        constructor(x?: number, y?: number);
        next: Point;
        prev: Point;
    }
}
declare module "src/model/pointPool" {
    import { Point } from "src/model/point";
    export class PointPool {
        private static _instance;
        private borrowed;
        private firstAvailable;
        constructor(initialSize: number);
        static readonly instance: PointPool;
        borrow(x: number, y: number): Point;
        returnPoint(p: Point): void;
    }
}
declare module "src/model/bounds" {
    import { Point } from "src/model/point";
    export class Bounds {
        left: number;
        right: number;
        top: number;
        bottom: number;
        constructor(x?: number, y?: number, width?: number, height?: number);
        readonly width: number;
        readonly height: number;
        getCentre(): Point;
    }
}
declare module "src/cropperDrawSettings" {
    export class CropperDrawSettings {
        strokeWidth: number;
        strokeColor: string;
    }
}
declare module "src/cropperSettings" {
    import { CropperDrawSettings } from "src/cropperDrawSettings";
    export interface ICropperSettings {
        canvasWidth?: number;
        canvasHeight?: number;
        width?: number;
        height?: number;
        minWidth?: number;
        minHeight?: number;
        minWithRelativeToResolution?: boolean;
        croppedWidth?: number;
        croppedHeight?: number;
        touchRadius?: number;
        cropperDrawSettings?: any;
        noFileInput?: boolean;
        allowedFilesRegex?: RegExp;
        rounded: boolean;
        keepAspect: boolean;
    }
    export class CropperSettings implements ICropperSettings {
        canvasWidth: number;
        canvasHeight: number;
        width: number;
        height: number;
        minWidth: number;
        minHeight: number;
        minWithRelativeToResolution: boolean;
        responsive: boolean;
        croppedWidth: number;
        croppedHeight: number;
        cropperDrawSettings: CropperDrawSettings;
        touchRadius: number;
        noFileInput: boolean;
        allowedFilesRegex: RegExp;
        private _rounded;
        private _keepAspect;
        cropWidth: number;
        cropHeight: number;
        constructor();
        rounded: boolean;
        keepAspect: boolean;
    }
}
declare module "src/model/handle" {
    import { Point } from "src/model/point";
    import { CropperSettings } from "src/cropperSettings";
    export interface IHandle {
        over: boolean;
        drag: boolean;
        position: Point;
        setPosition(x: number, y: number): void;
        offset: Point;
        radius: number;
        cropperSettings: CropperSettings;
        setDrag(value: boolean): void;
        draw(ctx: CanvasRenderingContext2D): void;
        setOver(over: boolean): void;
        touchInBounds(x: number, y: number): boolean;
    }
    export class Handle implements IHandle {
        over: boolean;
        drag: boolean;
        private _position;
        offset: Point;
        radius: number;
        cropperSettings: CropperSettings;
        constructor(x: number, y: number, radius: number, settings: CropperSettings);
        setDrag(value: boolean): void;
        draw(ctx: CanvasRenderingContext2D): void;
        setOver(over: boolean): void;
        touchInBounds(x: number, y: number): boolean;
        readonly position: Point;
        setPosition(x: number, y: number): void;
    }
}
declare module "src/model/cornerMarker" {
    import { Handle, IHandle } from "src/model/handle";
    import { CropperSettings } from "src/cropperSettings";
    export interface ICornerMarker extends IHandle {
        horizontalNeighbour: CornerMarker;
        verticalNeighbour: CornerMarker;
    }
    export class CornerMarker extends Handle implements ICornerMarker {
        horizontalNeighbour: CornerMarker;
        verticalNeighbour: CornerMarker;
        constructor(x: number, y: number, radius: number, cropperSettings: CropperSettings);
        drawCornerBorder(ctx: CanvasRenderingContext2D): void;
        drawCornerFill(ctx: CanvasRenderingContext2D): void;
        moveX(x: number): void;
        moveY(y: number): void;
        move(x: number, y: number): void;
        addHorizontalNeighbour(neighbour: CornerMarker): void;
        addVerticalNeighbour(neighbour: CornerMarker): void;
        getHorizontalNeighbour(): CornerMarker;
        getVerticalNeighbour(): CornerMarker;
        draw(ctx: CanvasRenderingContext2D): void;
    }
}
declare module "src/model/dragMarker" {
    import { Handle } from "src/model/handle";
    import { Point } from "src/model/point";
    import { CropperSettings } from "src/cropperSettings";
    import { Bounds } from "src/model/bounds";
    export class DragMarker extends Handle {
        private iconPoints;
        private scaledIconPoints;
        constructor(x: number, y: number, radius: number, cropperSettings: CropperSettings);
        draw(ctx: CanvasRenderingContext2D): void;
        getDragIconPoints(arr: Array<any>, scale: number): void;
        drawIcon(ctx: CanvasRenderingContext2D, points: Array<Point>): void;
        recalculatePosition(bounds: Bounds): void;
    }
}
declare module "src/model/cropTouch" {
    import { DragMarker } from "src/model/dragMarker";
    import { CornerMarker } from "src/model/cornerMarker";
    export class CropTouch {
        x: number;
        y: number;
        id: number;
        dragHandle: CornerMarker | DragMarker;
        constructor(x: number, y: number, id: number);
    }
}
declare module "src/model/imageCropperModel" {
    import { PointPool } from "src/model/pointPool";
    import { CornerMarker } from "src/model/cornerMarker";
    import { DragMarker } from "src/model/dragMarker";
    import { CropTouch } from "src/model/cropTouch";
    export class ImageCropperModel {
        protected canvas: HTMLCanvasElement;
        protected x: number;
        protected y: number;
        protected width: number;
        protected height: number;
        protected canvasWidth: number;
        protected canvasHeight: number;
        protected keepAspect: boolean;
        protected touchRadius: number;
        protected currentDragTouches: Array<CropTouch>;
        protected isMouseDown: boolean;
        protected ratioW: number;
        protected ratioH: number;
        protected fileType: string;
        protected imageSet: boolean;
        protected pointPool: PointPool;
        protected buffer: HTMLCanvasElement;
        protected cropCanvas: HTMLCanvasElement;
        protected tl: CornerMarker;
        protected tr: CornerMarker;
        protected bl: CornerMarker;
        protected br: CornerMarker;
        protected markers: Array<CornerMarker>;
        protected center: DragMarker;
        protected ctx: CanvasRenderingContext2D;
        protected aspectRatio: number;
        protected currentlyInteracting: boolean;
        protected srcImage: HTMLImageElement;
        protected vertSquashRatio: number;
        protected minXClamp: number;
        protected minYClamp: number;
        protected maxXClamp: number;
        protected maxYClamp: number;
        protected minHeight: number;
        protected minWidth: number;
        protected cropWidth: number;
        protected cropHeight: number;
        protected croppedImage: HTMLImageElement;
    }
}
declare module "src/imageCropperDataShare" {
    export class ImageCropperDataShare {
        static share: any;
        static pressed: HTMLCanvasElement;
        static over: HTMLCanvasElement;
        static setPressed(canvas: HTMLCanvasElement): void;
        static setReleased(canvas: HTMLCanvasElement): void;
        static setOver(canvas: HTMLCanvasElement): void;
        static setStyle(canvas: HTMLCanvasElement, style: any): void;
    }
}
declare module "src/imageCropper" {
    import { Bounds } from "src/model/bounds";
    import { CornerMarker } from "src/model/cornerMarker";
    import { CropTouch } from "src/model/cropTouch";
    import { CropperSettings } from "src/cropperSettings";
    import { DragMarker } from "src/model/dragMarker";
    import { ImageCropperModel } from "src/model/imageCropperModel";
    import { Point } from "src/model/point";
    export class ImageCropper extends ImageCropperModel {
        private crop;
        private cropperSettings;
        private previousDistance;
        constructor(cropperSettings: CropperSettings);
        private static sign(x);
        private static getMousePos(canvas, evt);
        private static getTouchPos(canvas, touch);
        private static detectVerticalSquash(img);
        prepare(canvas: HTMLCanvasElement): void;
        resizeCanvas(width: number, height: number): void;
        draw(ctx: CanvasRenderingContext2D): void;
        dragCenter(x: number, y: number, marker: DragMarker): void;
        enforceMinSize(x: number, y: number, marker: CornerMarker): Point;
        dragCorner(x: number, y: number, marker: CornerMarker): void;
        getSide(a: Point, b: Point, c: Point): number;
        handleRelease(newCropTouch: CropTouch): void;
        handleMove(newCropTouch: CropTouch): void;
        updateClampBounds(): void;
        getCropBounds(): Bounds;
        clampPosition(x: number, y: number): Point;
        isImageSet(): boolean;
        setImage(img: any): void;
        getCroppedImage(fillWidth?: number, fillHeight?: number): HTMLImageElement;
        getBounds(): Bounds;
        setBounds(bounds: any): void;
        onTouchMove(event: TouchEvent): void;
        onMouseMove(e: MouseEvent): void;
        move(cropTouch: CropTouch): void;
        getDragTouchForID(id: any): CropTouch;
        drawCursors(cropTouch: CropTouch): void;
        drawCornerCursor(marker: any, x: number, y: number): boolean;
        onTouchStart(event: TouchEvent): void;
        onTouchEnd(event: TouchEvent): void;
        drawImageIOSFix(ctx: CanvasRenderingContext2D, img: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void;
        onMouseDown(): void;
        onMouseUp(): void;
    }
}
declare module "src/exif" {
    export class Fraction extends Number {
        numerator: number;
        denominator: number;
    }
    export interface IImageExtended extends HTMLImageElement {
        exifdata: any;
        iptcdata: any;
    }
    export class Debug {
        static log(...args: any[]): void;
    }
    export class Exif {
        static debug: boolean;
        static IptcFieldMap: any;
        static Tags: any;
        static TiffTags: any;
        static GPSTags: any;
        static StringValues: any;
        static addEvent(element: EventTarget | any, event: string, handler: EventListener): void;
        static imageHasData(img: IImageExtended): boolean;
        static base64ToArrayBuffer(base64: string, contentType?: string): ArrayBuffer;
        static objectURLToBlob(url: string, callback: Function): void;
        static getImageData(img: IImageExtended | Blob | File, callback: Function): void;
        static findEXIFinJPEG(file: ArrayBuffer): any;
        static findIPTCinJPEG(file: ArrayBuffer): any;
        static readIPTCData(file: ArrayBuffer, startOffset: number, sectionLength: number): any;
        static readTags(file: DataView, tiffStart: number, dirStart: number, strings: string[], bigEnd: boolean): Object;
        static readTagValue(file: any, entryOffset: number, tiffStart: number, dirStart: number, bigEnd: boolean): any;
        static getStringFromDB(buffer: DataView, start: number, length: number): string;
        static readEXIFData(file: DataView, start: number): any;
        static getData(img: IImageExtended | HTMLImageElement, callback: Function): boolean;
        static getTag(img: any, tag: string): any;
        static getAllTags(img: any): any;
        static pretty(img: IImageExtended): string;
        static readFromBinaryFile(file: ArrayBuffer): any;
    }
}
declare module "src/imageCropperComponent" {
    import { Renderer, Type } from "@angular/core";
    import { ImageCropper } from "src/imageCropper";
    export class ImageCropperComponent extends Type {
        private cropcanvas;
        private settings;
        private image;
        cropper: ImageCropper;
        private onCrop;
        croppedWidth: number;
        croppedHeight: number;
        intervalRef: number;
        renderer: Renderer;
        constructor(renderer: Renderer);
        ngAfterViewInit(): void;
        onTouchMove(event: TouchEvent): void;
        onTouchStart(event: TouchEvent): void;
        onTouchEnd(event: TouchEvent): void;
        onMouseDown(): void;
        onMouseUp(): void;
        onMouseMove(event: MouseEvent): void;
        fileChangeListener($event: any): void;
        setImage(image: HTMLImageElement): void;
        private getOrientedImage(image, callback);
    }
}
declare module "src/imageCropperModule" {
    export class ImageCropperModule {
    }
}
declare module "index" {
    export { ImageCropperModule } from "src/imageCropperModule";
    export { ImageCropperComponent } from "src/imageCropperComponent";
    export { ImageCropper } from "src/imageCropper";
    export { CropperSettings } from "src/cropperSettings";
    export { CropperDrawSettings } from "src/cropperDrawSettings";
    export { Bounds } from "src/model/bounds";
}
declare module "runtime/app" {
    import { Type } from '@angular/core';
    import { ImageCropperComponent, CropperSettings, Bounds } from "index";
    export class AppComponent extends Type {
        data1: any;
        cropperSettings1: CropperSettings;
        data2: any;
        cropperSettings2: CropperSettings;
        cropper: ImageCropperComponent;
        constructor();
        cropped(bounds: Bounds): void;
        /**
         * Used to send image to second cropper
         * @param $event
         */
        fileChangeListener($event: any): void;
    }
}
declare module "runtime/app.module" {
    import 'rxjs/Rx';
    export class AppModule {
    }
}
declare module "runtime/main" {
}
