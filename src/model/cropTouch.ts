import {DragMarker} from "./dragMarker";
import {CornerMarker} from "./cornerMarker";
import {IHandle} from "./handle";

export class CropTouch {

    public x: number;
    public y: number;
    public id: number;

    public dragHandle: IHandle;

    constructor(x: number, y: number, id: number) {
        this.id = id || 0;
        this.x = x || 0;
        this.y = y || 0;
        this.dragHandle = null;
    }
}
