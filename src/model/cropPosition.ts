import { Bounds } from "./bounds";

export class CropPosition {
  public x: number;
  public y: number;
  public w: number;
  public h: number;

  constructor(x: number = 0, y: number = 0, w: number = 0, h: number = 0) {
    this.x = +x;
    this.y = +y;
    this.w = +w;
    this.h = +h;
  }

  public toBounds(): Bounds {
    return new Bounds(this.x, this.y, this.w, this.h);
  }

  public isInitialized(): boolean {
    return this.x !== 0 && this.y !== 0 && this.w !== 0 && this.h !== 0;
  }
}
