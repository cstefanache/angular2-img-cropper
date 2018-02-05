import { Point } from "./point";
import { CropperSettings } from "../cropperSettings";

export interface IHandle {
  over: boolean;
  drag: boolean;
  position: Point;
  setPosition(x: number, y: number): void;
  offset: Point;
  radius: number;
  cropperSettings: CropperSettings;
  setDrag(value: boolean): void;
  draw(ctx: CanvasRenderingContext2D): void;
  setOver(over: boolean): void;
  touchInBounds(x: number, y: number): boolean;
}

export class Handle implements IHandle {
  public over: boolean;
  public drag: boolean;
  private _position: Point;
  public offset: Point;
  public radius: number;

  public cropperSettings: CropperSettings = new CropperSettings();

  constructor(x: number, y: number, radius: number, settings: CropperSettings) {
    this.over = false;
    this.drag = false;
    this._position = new Point(x, y);
    this.offset = new Point(0, 0);
    this.radius = radius;
    this.cropperSettings = settings;
  }

  public setDrag(value: boolean): void {
    this.drag = value;
    this.setOver(value);
  }

  public draw(ctx: CanvasRenderingContext2D) {
    // this should't be empty
  }

  public setOver(over: boolean): void {
    this.over = over;
  }

  public touchInBounds(x: number, y: number): boolean {
    return (
      x > this.position.x - this.radius + this.offset.x &&
      x < this.position.x + this.radius + this.offset.x &&
      y > this.position.y - this.radius + this.offset.y &&
      y < this.position.y + this.radius + this.offset.y
    );
  }

  public get position(): Point {
    return this._position;
  }

  public setPosition(x: number, y: number) {
    this._position.x = x;
    this._position.y = y;
  }
}
