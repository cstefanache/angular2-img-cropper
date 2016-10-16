export interface IPoint {
    x: number;
    y: number;
    next: Point;
    prev: Point;
}
export declare class Point implements IPoint {
    x: number;
    y: number;
    private _next;
    private _prev;
    constructor(x?: number, y?: number);
    next: Point;
    prev: Point;
}
