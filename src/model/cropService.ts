export class CropService {

  canvas:any;
  ctx:any;
  DEG2RAD = 0.0174532925;

  init(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
  };
                  
}
