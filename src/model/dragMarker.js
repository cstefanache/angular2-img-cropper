"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var handle_1 = require("./handle");
var pointPool_1 = require("./pointPool");
var DragMarker = (function (_super) {
    __extends(DragMarker, _super);
    function DragMarker(x, y, radius, cropperSettings) {
        _super.call(this, x, y, radius, cropperSettings);
        this.iconPoints = [];
        this.scaledIconPoints = [];
        this.getDragIconPoints(this.iconPoints, 1);
        this.getDragIconPoints(this.scaledIconPoints, 1.2);
    }
    DragMarker.prototype.draw = function (ctx) {
        if (this.over || this.drag) {
            this.drawIcon(ctx, this.scaledIconPoints);
        }
        else {
            this.drawIcon(ctx, this.iconPoints);
        }
    };
    DragMarker.prototype.getDragIconPoints = function (arr, scale) {
        var maxLength = 17 * scale;
        var arrowWidth = 14 * scale;
        var arrowLength = 8 * scale;
        var connectorThroat = 4 * scale;
        arr.push(pointPool_1.PointPool.instance.borrow(-connectorThroat / 2, maxLength - arrowLength));
        arr.push(pointPool_1.PointPool.instance.borrow(-arrowWidth / 2, maxLength - arrowLength));
        arr.push(pointPool_1.PointPool.instance.borrow(0, maxLength));
        arr.push(pointPool_1.PointPool.instance.borrow(arrowWidth / 2, maxLength - arrowLength));
        arr.push(pointPool_1.PointPool.instance.borrow(connectorThroat / 2, maxLength - arrowLength));
        arr.push(pointPool_1.PointPool.instance.borrow(connectorThroat / 2, connectorThroat / 2));
        arr.push(pointPool_1.PointPool.instance.borrow(maxLength - arrowLength, connectorThroat / 2));
        arr.push(pointPool_1.PointPool.instance.borrow(maxLength - arrowLength, arrowWidth / 2));
        arr.push(pointPool_1.PointPool.instance.borrow(maxLength, 0));
        arr.push(pointPool_1.PointPool.instance.borrow(maxLength - arrowLength, -arrowWidth / 2));
        arr.push(pointPool_1.PointPool.instance.borrow(maxLength - arrowLength, -connectorThroat / 2));
        arr.push(pointPool_1.PointPool.instance.borrow(connectorThroat / 2, -connectorThroat / 2));
        arr.push(pointPool_1.PointPool.instance.borrow(connectorThroat / 2, -maxLength + arrowLength));
        arr.push(pointPool_1.PointPool.instance.borrow(arrowWidth / 2, -maxLength + arrowLength));
        arr.push(pointPool_1.PointPool.instance.borrow(0, -maxLength));
        arr.push(pointPool_1.PointPool.instance.borrow(-arrowWidth / 2, -maxLength + arrowLength));
        arr.push(pointPool_1.PointPool.instance.borrow(-connectorThroat / 2, -maxLength + arrowLength));
        arr.push(pointPool_1.PointPool.instance.borrow(-connectorThroat / 2, -connectorThroat / 2));
        arr.push(pointPool_1.PointPool.instance.borrow(-maxLength + arrowLength, -connectorThroat / 2));
        arr.push(pointPool_1.PointPool.instance.borrow(-maxLength + arrowLength, -arrowWidth / 2));
        arr.push(pointPool_1.PointPool.instance.borrow(-maxLength, 0));
        arr.push(pointPool_1.PointPool.instance.borrow(-maxLength + arrowLength, arrowWidth / 2));
        arr.push(pointPool_1.PointPool.instance.borrow(-maxLength + arrowLength, connectorThroat / 2));
        arr.push(pointPool_1.PointPool.instance.borrow(-connectorThroat / 2, connectorThroat / 2));
    };
    DragMarker.prototype.drawIcon = function (ctx, points) {
        ctx.beginPath();
        ctx.moveTo(points[0].x + this.position.x, points[0].y + this.position.y);
        for (var k = 0; k < points.length; k++) {
            var p = points[k];
            ctx.lineTo(p.x + this.position.x, p.y + this.position.y);
        }
        ctx.closePath();
        ctx.fillStyle = this.cropperSettings.cropperDrawSettings.strokeColor;
        ctx.fill();
    };
    DragMarker.prototype.recalculatePosition = function (bounds) {
        var c = bounds.getCentre();
        this.setPosition(c.x, c.y);
        pointPool_1.PointPool.instance.returnPoint(c);
    };
    return DragMarker;
}(handle_1.Handle));
exports.DragMarker = DragMarker;
//# sourceMappingURL=dragMarker.js.map