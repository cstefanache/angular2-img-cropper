import { Point } from './point';
import { CropperDrawSettings } from "../cropperDrawSettings";
export declare class Handle {
    protected drawSettings: CropperDrawSettings;
    over: Boolean;
    drag: Boolean;
    position: Point;
    offset: Point;
    radius: number;
    constructor(x: any, y: any, radius: any, drawSettings: CropperDrawSettings);
    setDrag(value: any): void;
    draw(ctx: any): void;
    setOver(over: any): void;
    touchInBounds(x: any, y: any): boolean;
    getPosition(): Point;
    setPosition(x: any, y: any): void;
}
