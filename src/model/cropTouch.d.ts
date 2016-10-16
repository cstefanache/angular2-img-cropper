import { DragMarker } from "./dragMarker";
import { CornerMarker } from "./cornerMarker";
export declare class CropTouch {
    x: number;
    y: number;
    id: number;
    dragHandle: CornerMarker | DragMarker;
    constructor(x: number, y: number, id: number);
}
