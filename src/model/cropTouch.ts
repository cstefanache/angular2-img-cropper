export class CropTouch {

  x: number;
  y: number;
  id: number;

  constructor(x: number, y: number, id: number) {
    if (x === void 0) {
      x = 0;
    }
    if (y === void 0) {
      y = 0;
    }
    if (id === void 0) {
      id = 0;
    }
    this.id = 0;
    this.x = x;
    this.y = y;
    this.id = id;
  }

}
