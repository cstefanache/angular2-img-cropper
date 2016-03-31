import {Handle} from './handle';
import {PointPool} from './pointPool';
import {Point} from './point';

export class DragMarker extends Handle {

  iconPoints:Array<Point>;
  scaledIconPoints:Array<Point>;

  constructor(x:number, y:number, radius:number) {
    super(x,y,radius);
    this.iconPoints = [];
    this.scaledIconPoints = [];
    this.getDragIconPoints(this.iconPoints, 1);
    this.getDragIconPoints(this.scaledIconPoints, 1.2);
  }

  draw(ctx) {
      if (this.over || this.drag) {
          this.drawIcon(ctx, this.scaledIconPoints);
      }
      else {
          this.drawIcon(ctx, this.iconPoints);
      }
  };

  getDragIconPoints(arr:Array<any>, scale:number) {
      var maxLength = 17 * scale;
      var arrowWidth = 14 * scale;
      var arrowLength = 8 * scale;
      var connectorThroat = 4 * scale;

      arr.push(PointPool.instance.borrow(-connectorThroat / 2, maxLength - arrowLength));
      arr.push(PointPool.instance.borrow(-arrowWidth / 2, maxLength - arrowLength));
      arr.push(PointPool.instance.borrow(0, maxLength));
      arr.push(PointPool.instance.borrow(arrowWidth / 2, maxLength - arrowLength));
      arr.push(PointPool.instance.borrow(connectorThroat / 2, maxLength - arrowLength));
      arr.push(PointPool.instance.borrow(connectorThroat / 2, connectorThroat / 2));
      arr.push(PointPool.instance.borrow(maxLength - arrowLength, connectorThroat / 2));
      arr.push(PointPool.instance.borrow(maxLength - arrowLength, arrowWidth / 2));
      arr.push(PointPool.instance.borrow(maxLength, 0));
      arr.push(PointPool.instance.borrow(maxLength - arrowLength, -arrowWidth / 2));
      arr.push(PointPool.instance.borrow(maxLength - arrowLength, -connectorThroat / 2));
      arr.push(PointPool.instance.borrow(connectorThroat / 2, -connectorThroat / 2));
      arr.push(PointPool.instance.borrow(connectorThroat / 2, -maxLength + arrowLength));
      arr.push(PointPool.instance.borrow(arrowWidth / 2, -maxLength + arrowLength));
      arr.push(PointPool.instance.borrow(0, -maxLength));
      arr.push(PointPool.instance.borrow(-arrowWidth / 2, -maxLength + arrowLength));
      arr.push(PointPool.instance.borrow(-connectorThroat / 2, -maxLength + arrowLength));
      arr.push(PointPool.instance.borrow(-connectorThroat / 2, -connectorThroat / 2));
      arr.push(PointPool.instance.borrow(-maxLength + arrowLength, -connectorThroat / 2));
      arr.push(PointPool.instance.borrow(-maxLength + arrowLength, -arrowWidth / 2));
      arr.push(PointPool.instance.borrow(-maxLength, 0));
      arr.push(PointPool.instance.borrow(-maxLength + arrowLength, arrowWidth / 2));
      arr.push(PointPool.instance.borrow(-maxLength + arrowLength, connectorThroat / 2));
      arr.push(PointPool.instance.borrow(-connectorThroat / 2, connectorThroat / 2));
  };

  drawIcon(ctx:any, points:Array<Point>) {
      ctx.beginPath();
      ctx.moveTo(points[0].x + this.position.x, points[0].y + this.position.y);
      for (var k = 0; k < points.length; k++) {
          var p = points[k];
          ctx.lineTo(p.x + this.position.x, p.y + this.position.y);
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(255,228,0,1)';
      ctx.fill();
  };

  recalculatePosition(bounds) {

      var c = bounds.getCentre();
      this.setPosition(c.x, c.y);
      PointPool.instance.returnPoint(c);
  };

}
