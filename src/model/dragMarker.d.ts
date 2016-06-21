import { Handle } from './handle';
import { Point } from './point';
import { CropperDrawSettings } from "../cropperDrawSettings";
export declare class DragMarker extends Handle {
    iconPoints: Array<Point>;
    scaledIconPoints: Array<Point>;
    constructor(x: number, y: number, radius: number, drawSettings: CropperDrawSettings);
    draw(ctx: any): void;
    getDragIconPoints(arr: Array<any>, scale: number): void;
    drawIcon(ctx: any, points: Array<Point>): void;
    recalculatePosition(bounds: any): void;
}
