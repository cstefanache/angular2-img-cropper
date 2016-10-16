import { Point } from "./point";
export declare class PointPool {
    private static _instance;
    private borrowed;
    private firstAvailable;
    constructor(initialSize: number);
    static readonly instance: PointPool;
    borrow(x: number, y: number): Point;
    returnPoint(p: Point): void;
}
