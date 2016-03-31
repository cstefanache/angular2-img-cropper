import {Point} from './point';
import {PointPool} from './pointPool';

export class Bounds {

  left: number;
  right: number;
  top: number;
  bottom: number;

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

  getWidth(): number {
    return this.right - this.left;
  };

  getHeight(): number {
    return this.bottom - this.top;
  };

  getCentre(): Point {
    var w = this.getWidth();
    var h = this.getHeight();
    return PointPool.instance.borrow(this.left + (w / 2), this.top + (h / 2));
  };
}
