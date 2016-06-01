export declare class Point {
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
