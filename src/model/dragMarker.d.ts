import { Handle } from "./handle";
import { Point } from "./point";
import { CropperSettings } from "../cropperSettings";
import { Bounds } from "./bounds";
export declare class DragMarker extends Handle {
    private iconPoints;
    private scaledIconPoints;
    constructor(x: number, y: number, radius: number, cropperSettings: CropperSettings);
    draw(ctx: CanvasRenderingContext2D): void;
    getDragIconPoints(arr: Array<any>, scale: number): void;
    drawIcon(ctx: CanvasRenderingContext2D, points: Array<Point>): void;
    recalculatePosition(bounds: Bounds): void;
}
