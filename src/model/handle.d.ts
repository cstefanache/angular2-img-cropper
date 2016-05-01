import { Point } from './point';
export declare class Handle {
    over: Boolean;
    drag: Boolean;
    position: Point;
    offset: Point;
    radius: number;
    constructor(x: any, y: any, radius: any);
    setDrag(value: any): void;
    draw(ctx: any): void;
    setOver(over: any): void;
    touchInBounds(x: any, y: any): boolean;
    getPosition(): Point;
    setPosition(x: any, y: any): void;
}
