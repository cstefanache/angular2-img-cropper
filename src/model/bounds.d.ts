import { Point } from "./point";
export declare class Bounds {
    left: number;
    right: number;
    top: number;
    bottom: number;
    constructor(x?: number, y?: number, width?: number, height?: number);
    readonly width: number;
    readonly height: number;
    getCentre(): Point;
}
