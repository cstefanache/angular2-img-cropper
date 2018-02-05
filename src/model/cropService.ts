export class CropService {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;

  // todo: Unused?
  // public static DEG2RAD = 0.0174532925;

  public init(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = <CanvasRenderingContext2D>this.canvas.getContext("2d");
  }
}
