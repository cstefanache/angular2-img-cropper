import { Point } from './point';
export declare class PointPool {
    private static _instance;
    private borrowed;
    private firstAvailable;
    constructor(initialSize: any);
    static instance: PointPool;
    borrow(x: any, y: any): Point;
    returnPoint(p: Point): void;
}
