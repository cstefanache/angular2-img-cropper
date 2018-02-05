export class ImageCropperDataShare {
  public static share: any = {};
  public static pressed: HTMLCanvasElement;
  public static over: HTMLCanvasElement;

  public static setPressed(canvas: HTMLCanvasElement): void {
    this.pressed = canvas;
  }

  public static setReleased(canvas: HTMLCanvasElement): void {
    if (canvas === this.pressed) {
      //  this.pressed = undefined;
    }
  }

  public static setOver(canvas: HTMLCanvasElement): void {
    this.over = canvas;
  }

  public static setStyle(canvas: HTMLCanvasElement, style: any): void {
    if (this.pressed !== undefined) {
      if (this.pressed === canvas) {
        // TODO: check this
        // angular.element(document.documentElement).css('cursor', style);
      }
    } else {
      if (canvas === this.over) {
        // TODO: check this
        // angular.element(document.documentElement).css('cursor', style);
      }
    }
  }
}
