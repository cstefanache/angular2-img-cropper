import { Handle, IHandle } from "./handle";
import { CropperSettings } from "../cropperSettings";
export interface ICornerMarker extends IHandle {
    horizontalNeighbour: CornerMarker;
    verticalNeighbour: CornerMarker;
}
export declare class CornerMarker extends Handle implements ICornerMarker {
    horizontalNeighbour: CornerMarker;
    verticalNeighbour: CornerMarker;
    constructor(x: number, y: number, radius: number, cropperSettings: CropperSettings);
    drawCornerBorder(ctx: CanvasRenderingContext2D): void;
    drawCornerFill(ctx: CanvasRenderingContext2D): void;
    moveX(x: number): void;
    moveY(y: number): void;
    move(x: number, y: number): void;
    addHorizontalNeighbour(neighbour: CornerMarker): void;
    addVerticalNeighbour(neighbour: CornerMarker): void;
    getHorizontalNeighbour(): CornerMarker;
    getVerticalNeighbour(): CornerMarker;
    draw(ctx: CanvasRenderingContext2D): void;
}
