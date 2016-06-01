import { Handle } from './handle';
import { Point } from './point';
export declare class DragMarker extends Handle {
    iconPoints: Array<Point>;
    scaledIconPoints: Array<Point>;
    constructor(x: number, y: number, radius: number);
    draw(ctx: any): void;
    getDragIconPoints(arr: Array<any>, scale: number): void;
    drawIcon(ctx: any, points: Array<Point>): void;
    recalculatePosition(bounds: any): void;
}
