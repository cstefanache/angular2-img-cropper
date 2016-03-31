
export class ImageCropperDataShare {
  public static share: any = {};
  public static pressed;
  public static over;

  public static setPressed(canvas): void {
    this.pressed = canvas;
  };

  public static setReleased(canvas): void {
    if (canvas === this.pressed) {
      this.pressed = undefined;
    }
  };

  public static setOver(canvas): void {
    this.over = canvas;
  };

  public static setStyle(canvas, style): void {
    if (this.pressed !== undefined) {
      if (this.pressed === canvas) {
        //TODO: check this
        //angular.element(document.documentElement).css('cursor', style);
      }
    }
    else {
      if (canvas === this.over) {
        //TODO: check this
        //angular.element(document.documentElement).css('cursor', style);
      }
    }
  };
}
