import { Point } from "./point";
import { PointPool } from "./pointPool";

export class Bounds {
  public left: number;
  public right: number;
  public top: number;
  public bottom: number;

  constructor(x?: number, y?: number, width?: number, height?: number) {
    if (x === void 0) {
      x = 0;
    }
    if (y === void 0) {
      y = 0;
    }
    if (width === void 0) {
      width = 0;
    }
    if (height === void 0) {
      height = 0;
    }
    this.left = x;
    this.right = x + width;
    this.top = y;
    this.bottom = y + height;
  }

  public get width(): number {
    return this.right - this.left;
  }

  public get height(): number {
    return this.bottom - this.top;
  }

  public getCentre(): Point {
    let w = this.width;
    let h = this.height;
    return PointPool.instance.borrow(this.left + w / 2, this.top + h / 2);
  }
}
