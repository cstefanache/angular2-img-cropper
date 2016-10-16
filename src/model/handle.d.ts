import { Point } from "./point";
import { CropperSettings } from "../cropperSettings";
export interface IHandle {
    over: boolean;
    drag: boolean;
    position: Point;
    setPosition(x: number, y: number): void;
    offset: Point;
    radius: number;
    cropperSettings: CropperSettings;
    setDrag(value: boolean): void;
    draw(ctx: CanvasRenderingContext2D): void;
    setOver(over: boolean): void;
    touchInBounds(x: number, y: number): boolean;
}
export declare class Handle implements IHandle {
    over: boolean;
    drag: boolean;
    private _position;
    offset: Point;
    radius: number;
    cropperSettings: CropperSettings;
    constructor(x: number, y: number, radius: number, settings: CropperSettings);
    setDrag(value: boolean): void;
    draw(ctx: CanvasRenderingContext2D): void;
    setOver(over: boolean): void;
    touchInBounds(x: number, y: number): boolean;
    readonly position: Point;
    setPosition(x: number, y: number): void;
}
