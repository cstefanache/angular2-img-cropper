import { Point } from './point';
import { CropperSettings } from "../cropperSettings";
export declare class Handle {
    protected cropperSettings: CropperSettings;
    over: Boolean;
    drag: Boolean;
    position: Point;
    offset: Point;
    radius: number;
    constructor(x: any, y: any, radius: any, cropperSettings: CropperSettings);
    setDrag(value: any): void;
    draw(ctx: any): void;
    setOver(over: any): void;
    touchInBounds(x: any, y: any): boolean;
    getPosition(): Point;
    setPosition(x: any, y: any): void;
}
