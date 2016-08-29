export class Point {

    public x: number;
    public y: number;

    private _next: Point;
    private _prev: Point;

    constructor(x?: number, y?: number) {
        this.x = x;
        this.y = y;
    }

    public getNext(): Point {
        return this._next;
    }

    public setNext(p: Point) {
        this._next = p;
    }

    public getPrev(): Point {
        return this._prev;
    }

    public setPrev(p: Point) {
        this._prev = p;
    }
}
