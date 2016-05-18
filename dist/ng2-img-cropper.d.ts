/// <reference path="../node_modules/angular2-in-memory-web-api/typings/browser.d.ts" />
/// <reference path="../typings/main.d.ts" />
declare module "src/model/point" {
    export class Point {
        x: number;
        y: number;
        private _next;
        private _prev;
        constructor(x?: number, y?: number);
        getNext(): Point;
        setNext(p: Point): void;
        getPrev(): Point;
        setPrev(p: Point): void;
    }
}
declare module "src/model/pointPool" {
    import { Point } from "src/model/point";
    export class PointPool {
        private static _instance;
        private borrowed;
        private firstAvailable;
        constructor(initialSize: any);
        static instance: PointPool;
        borrow(x: any, y: any): Point;
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
        getWidth(): number;
        getHeight(): number;
        getCentre(): Point;
    }
}
declare module "src/model/handle" {
    import { Point } from "src/model/point";
    export class Handle {
        over: Boolean;
        drag: Boolean;
        position: Point;
        offset: Point;
        radius: number;
        constructor(x: any, y: any, radius: any);
        setDrag(value: any): void;
        draw(ctx: any): void;
        setOver(over: any): void;
        touchInBounds(x: any, y: any): boolean;
        getPosition(): Point;
        setPosition(x: any, y: any): void;
    }
}
declare module "src/model/cornerMarker" {
    import { Handle } from "src/model/handle";
    export class CornerMarker extends Handle {
        private horizontalNeighbour;
        private verticalNeighbour;
        drawCornerBorder(ctx: any): void;
        drawCornerFill(ctx: any): void;
        moveX(x: number): void;
        moveY(y: number): void;
        move(x: number, y: number): void;
        addHorizontalNeighbour(neighbour: CornerMarker): void;
        addVerticalNeighbour(neighbour: CornerMarker): void;
        getHorizontalNeighbour(): CornerMarker;
        getVerticalNeighbour(): CornerMarker;
        draw(ctx: any): void;
    }
}
declare module "src/model/dragMarker" {
    import { Handle } from "src/model/handle";
    import { Point } from "src/model/point";
    export class DragMarker extends Handle {
        iconPoints: Array<Point>;
        scaledIconPoints: Array<Point>;
        constructor(x: number, y: number, radius: number);
        draw(ctx: any): void;
        getDragIconPoints(arr: Array<any>, scale: number): void;
        drawIcon(ctx: any, points: Array<Point>): void;
        recalculatePosition(bounds: any): void;
    }
}
declare module "src/model/cropTouch" {
    export class CropTouch {
        x: number;
        y: number;
        id: number;
        constructor(x: number, y: number, id: number);
    }
}
declare module "src/imageCropperDataShare" {
    export class ImageCropperDataShare {
        static share: any;
        static pressed: any;
        static over: any;
        static setPressed(canvas: any): void;
        static setReleased(canvas: any): void;
        static setOver(canvas: any): void;
        static setStyle(canvas: any, style: any): void;
    }
}
declare module "src/imageCropper" {
    import { Renderer, ElementRef } from '@angular/core';
    import { PointPool } from "src/model/pointPool";
    import { Point } from "src/model/point";
    import { Bounds } from "src/model/bounds";
    import { CornerMarker } from "src/model/cornerMarker";
    import { DragMarker } from "src/model/dragMarker";
    export class ImageCropperComponent {
        cropcanvas: ElementRef;
        private cropper;
        private renderer;
        image: any;
        croppedWidth: number;
        croppedHeight: number;
        settings: CropperSettings;
        constructor(renderer: Renderer);
        ngAfterViewInit(): void;
        onMouseDown($event: any): void;
        onMouseUp($event: any): void;
        onMouseMove($event: any): void;
        fileChangeListener($event: any): void;
    }
    export class CropperSettings {
        canvasWidth: number;
        canvasHeight: number;
        width: number;
        height: number;
        croppedWidth: number;
        croppedHeight: number;
        constructor();
    }
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
        protected currentDragTouches: Array<any>;
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
        protected ctx: any;
        protected aspectRatio: number;
        protected currentlyInteracting: boolean;
        protected srcImage: ImageData;
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
    export class ImageCropper extends ImageCropperModel {
        private crop;
        constructor(canvas: HTMLCanvasElement, x: number, y: number, width: number, height: number, croppedWidth: number, croppedHeight: number, keepAspect?: boolean, touchRadius?: number, minWidth?: number, minHeight?: number);
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
        onMouseDown(e: any): void;
        onMouseUp(e: any): void;
    }
}
declare module "components" {
    import { ImageCropperComponent, CropperSettings } from "src/imageCropper";
    export * from "src/imageCropper";
    declare var _default: {
        directives: (typeof ImageCropperComponent | typeof CropperSettings)[];
    };
    export default _default;
}
declare module "src/model/cropService" {
    export class CropService {
        canvas: any;
        ctx: any;
        DEG2RAD: number;
        init(canvas: any): void;
    }
}
