import { Point } from './point';
import { CropperSettings } from "../cropperSettings";
export declare class Handle {
    over: boolean;
    drag: boolean;
    position: Point;
    offset: Point;
    radius: number;
    protected cropperSettings: CropperSettings;
    constructor(x: any, y: any, radius: any, cropperSettings: any);
    setDrag(value: any): void;
    draw(ctx: any): void;
    setOver(over: any): void;
    touchInBounds(x: any, y: any): boolean;
    getPosition(): Point;
    setPosition(x: any, y: any): void;
}
