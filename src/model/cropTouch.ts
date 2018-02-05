import { DragMarker } from "./dragMarker";
import { CornerMarker } from "./cornerMarker";
import { IHandle } from "./handle";

export class CropTouch {
  public x: number;
  public y: number;
  public id: number;

  public dragHandle: IHandle;

  constructor(x: number = 0, y: number = 0, id: number = 0) {
    this.id = id;
    this.x = x;
    this.y = y;
  }
}
