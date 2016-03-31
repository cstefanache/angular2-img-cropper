import {Handle} from './handle';
import {PointPool} from './pointPool';
import {Point} from './point';

export class CornerMarker extends Handle {

  private horizontalNeighbour: CornerMarker;
  private verticalNeighbour: CornerMarker;

  drawCornerBorder(ctx: any): void {
    var sideLength = 10;
    if (this.over || this.drag) {
      sideLength = 12;
    }

    var hDirection = 1;
    var vDirection = 1;
    if (this.horizontalNeighbour.position.x < this.position.x) {
      hDirection = -1;
    }
    if (this.verticalNeighbour.position.y < this.position.y) {
      vDirection = -1;
    }
    ctx.beginPath();
    ctx.lineJoin = "miter";
    ctx.moveTo(this.position.x, this.position.y);
    ctx.lineTo(this.position.x + (sideLength * hDirection), this.position.y);
    ctx.lineTo(this.position.x + (sideLength * hDirection), this.position.y + (sideLength * vDirection));
    ctx.lineTo(this.position.x, this.position.y + (sideLength * vDirection));
    ctx.lineTo(this.position.x, this.position.y);
    ctx.closePath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255,228,0,1)';
    ctx.stroke();
  };

  drawCornerFill(ctx: any): void {
    var sideLength = 10;
    if (this.over || this.drag) {
      sideLength = 12;
    }
    var hDirection = 1;
    var vDirection = 1;
    if (this.horizontalNeighbour.position.x < this.position.x) {
      hDirection = -1;
    }
    if (this.verticalNeighbour.position.y < this.position.y) {
      vDirection = -1;
    }
    ctx.beginPath();
    ctx.moveTo(this.position.x, this.position.y);
    ctx.lineTo(this.position.x + (sideLength * hDirection), this.position.y);
    ctx.lineTo(this.position.x + (sideLength * hDirection), this.position.y + (sideLength * vDirection));
    ctx.lineTo(this.position.x, this.position.y + (sideLength * vDirection));
    ctx.lineTo(this.position.x, this.position.y);
    ctx.closePath();
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fill();
  }

  moveX(x: number): void {
    this.setPosition(x, this.position.y);
  };

  moveY(y: number): void {
    this.setPosition(this.position.x, y);
  };

  move(x: number, y: number): void {
    this.setPosition(x, y);
    this.verticalNeighbour.moveX(x);
    this.horizontalNeighbour.moveY(y);
  };

  addHorizontalNeighbour(neighbour: CornerMarker): void {
    this.horizontalNeighbour = neighbour;
  };

  addVerticalNeighbour(neighbour: CornerMarker): void {
    this.verticalNeighbour = neighbour;
  };

  getHorizontalNeighbour(): CornerMarker {
    return this.horizontalNeighbour;
  };

  getVerticalNeighbour(): CornerMarker {
    return this.verticalNeighbour;
  };

  draw(ctx: any): void {
    this.drawCornerFill(ctx);
    this.drawCornerBorder(ctx);
  };

}
