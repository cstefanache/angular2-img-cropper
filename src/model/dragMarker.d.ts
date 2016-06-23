import { Handle } from './handle';
import { Point } from './point';
import { CropperSettings } from "../cropperSettings";
export declare class DragMarker extends Handle {
    iconPoints: Array<Point>;
    scaledIconPoints: Array<Point>;
    constructor(x: number, y: number, radius: number, cropperSettings: CropperSettings);
    draw(ctx: any): void;
    getDragIconPoints(arr: Array<any>, scale: number): void;
    drawIcon(ctx: any, points: Array<Point>): void;
    recalculatePosition(bounds: any): void;
}
