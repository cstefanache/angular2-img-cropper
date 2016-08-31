import {Point} from "./point";

export class PointPool {

    private static _instance: PointPool;

    private borrowed: number;
    private firstAvailable: Point;

    constructor(initialSize: number) {
        PointPool._instance = this;
        let prev: Point = null;
        for (let i = 0; i < initialSize; i++) {
            if (i === 0) {
                this.firstAvailable = new Point();
                prev = this.firstAvailable;
            } else {
                let p = new Point();
                prev.next = p;
                prev = p;
            }
        }
    }

    static get instance(): PointPool {
        return PointPool._instance;
    }

    public borrow(x: number, y: number): Point {
        if (this.firstAvailable == null) {
            throw "Pool exhausted";
        }
        this.borrowed++;
        let p: Point = this.firstAvailable;
        this.firstAvailable = p.next;
        p.x = x;
        p.y = y;
        return p;
    };

    public returnPoint(p: Point) {
        this.borrowed--;
        p.x = 0;
        p.y = 0;
        p.next = this.firstAvailable;
        this.firstAvailable = p;
    };
}
