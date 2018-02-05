import { Handle, IHandle } from "./handle";
import { CropperSettings } from "../cropperSettings";

export interface ICornerMarker extends IHandle {
  horizontalNeighbour: CornerMarker;
  verticalNeighbour: CornerMarker;
}

export class CornerMarker extends Handle implements ICornerMarker {
  public horizontalNeighbour: CornerMarker;
  public verticalNeighbour: CornerMarker;

  constructor(
    x: number,
    y: number,
    radius: number,
    cropperSettings: CropperSettings
  ) {
    super(x, y, radius, cropperSettings);
  }

  public drawCornerBorder(ctx: CanvasRenderingContext2D): void {
    let sideLength: number = 10;
    if (this.over || this.drag) {
      sideLength = 12;
    }

    let hDirection: number = this.cropperSettings.markerSizeMultiplier;
    let vDirection: number = this.cropperSettings.markerSizeMultiplier;
    if (this.horizontalNeighbour.position.x < this.position.x) {
      hDirection = -this.cropperSettings.markerSizeMultiplier;
    }
    if (this.verticalNeighbour.position.y < this.position.y) {
      vDirection = -this.cropperSettings.markerSizeMultiplier;
    }

    if (this.cropperSettings.rounded) {
      let width: number = this.position.x - this.horizontalNeighbour.position.x;
      let height: number = this.position.y - this.verticalNeighbour.position.y;

      let offX: number =
        Math.round(Math.sin(Math.PI / 2) * Math.abs(width / 2)) / 4;
      let offY: number =
        Math.round(Math.sin(Math.PI / 2) * Math.abs(height / 2)) / 4;

      this.offset.x = hDirection > 0 ? offX : -offX;
      this.offset.y = vDirection > 0 ? offY : -offY;
    } else {
      this.offset.x = 0;
      this.offset.y = 0;
    }

    ctx.beginPath();
    if (this.cropperSettings.cropperDrawSettings.lineDash) {
      ctx.setLineDash([1, 3]);
    }
    ctx.lineJoin = "miter";
    ctx.moveTo(
      this.position.x + this.offset.x,
      this.position.y + this.offset.y
    );
    ctx.lineTo(
      this.position.x + this.offset.x + sideLength * hDirection,
      this.position.y + this.offset.y
    );
    ctx.lineTo(
      this.position.x + this.offset.x + sideLength * hDirection,
      this.position.y + this.offset.y + sideLength * vDirection
    );
    ctx.lineTo(
      this.position.x + this.offset.x,
      this.position.y + this.offset.y + sideLength * vDirection
    );
    ctx.lineTo(
      this.position.x + this.offset.x,
      this.position.y + this.offset.y
    );
    ctx.closePath();
    ctx.lineWidth = this.cropperSettings.cropperDrawSettings.strokeWidth;
    ctx.strokeStyle =
      this.cropperSettings.cropperDrawSettings.strokeColor ||
      "rgba(255,255,255,.7)";
    ctx.stroke();
  }

  public drawCornerFill(ctx: CanvasRenderingContext2D): void {
    let sideLength: number = 10;
    if (this.over || this.drag) {
      sideLength = 12;
    }
    let hDirection: number = this.cropperSettings.markerSizeMultiplier;
    let vDirection: number = this.cropperSettings.markerSizeMultiplier;
    if (this.horizontalNeighbour.position.x < this.position.x) {
      hDirection = -this.cropperSettings.markerSizeMultiplier;
    }
    if (this.verticalNeighbour.position.y < this.position.y) {
      vDirection = -this.cropperSettings.markerSizeMultiplier;
    }

    ctx.beginPath();
    if (this.cropperSettings.cropperDrawSettings.lineDash) {
      ctx.setLineDash([1, 3]);
    }
    ctx.moveTo(
      this.position.x + this.offset.x,
      this.position.y + this.offset.y
    );
    ctx.lineTo(
      this.position.x + this.offset.x + sideLength * hDirection,
      this.position.y + this.offset.y
    );
    ctx.lineTo(
      this.position.x + this.offset.x + sideLength * hDirection,
      this.position.y + this.offset.y + sideLength * vDirection
    );
    ctx.lineTo(
      this.position.x + this.offset.x,
      this.position.y + this.offset.y + sideLength * vDirection
    );
    ctx.lineTo(
      this.position.x + this.offset.x,
      this.position.y + this.offset.y
    );
    ctx.closePath();
    ctx.fillStyle =
      this.cropperSettings.cropperDrawSettings.strokeColor ||
      "rgba(255,255,255,.7)";
    ctx.fill();
  }

  public moveX(x: number): void {
    this.setPosition(x, this.position.y);
  }

  public moveY(y: number): void {
    this.setPosition(this.position.x, y);
  }

  public move(x: number, y: number): void {
    this.setPosition(x, y);
    this.verticalNeighbour.moveX(x);
    this.horizontalNeighbour.moveY(y);
  }

  public addHorizontalNeighbour(neighbour: CornerMarker): void {
    this.horizontalNeighbour = neighbour;
  }

  public addVerticalNeighbour(neighbour: CornerMarker): void {
    this.verticalNeighbour = neighbour;
  }

  public getHorizontalNeighbour(): CornerMarker {
    return this.horizontalNeighbour;
  }

  public getVerticalNeighbour(): CornerMarker {
    return this.verticalNeighbour;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    this.drawCornerFill(ctx);
    this.drawCornerBorder(ctx);
  }
}
