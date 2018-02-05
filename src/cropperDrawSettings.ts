export class CropperDrawSettings {
  public lineDash: boolean = false;
  public strokeWidth: number = 1;
  public strokeColor: string = "rgba(255,255,255,1)";
  public dragIconStrokeWidth: number = 1;
  public dragIconStrokeColor: string = "rgba(0,0,0,1)";
  public dragIconFillColor: string = "rgba(255,255,255,1)";

  constructor(settings?: any) {
    if (typeof settings === "object") {
      this.lineDash = settings.lineDash || this.lineDash;
      this.strokeWidth = settings.strokeWidth || this.strokeWidth;
      this.strokeColor = settings.strokeColor || this.strokeColor;
      this.dragIconStrokeWidth =
        settings.dragIconStrokeWidth || this.dragIconStrokeWidth;
      this.dragIconStrokeColor =
        settings.dragIconStrokeColor || this.dragIconStrokeColor;
      this.dragIconFillColor =
        settings.dragIconFillColor || this.dragIconFillColor;
    }
  }
}
