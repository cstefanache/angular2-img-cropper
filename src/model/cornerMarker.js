"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var handle_1 = require("./handle");
var CornerMarker = (function (_super) {
    __extends(CornerMarker, _super);
    function CornerMarker(x, y, radius, cropperSettings) {
        _super.call(this, x, y, radius, cropperSettings);
    }
    CornerMarker.prototype.drawCornerBorder = function (ctx) {
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
        if (this.cropperSettings.rounded) {
            var width = this.position.x - this.horizontalNeighbour.position.x;
            var height = this.position.y - this.verticalNeighbour.position.y;
            var offX = Math.round(Math.sin(Math.PI / 2) * Math.abs(width / 2)) / 4;
            var offY = Math.round(Math.sin(Math.PI / 2) * Math.abs(height / 2)) / 4;
            this.offset.x = hDirection > 0 ? offX : -offX;
            this.offset.y = vDirection > 0 ? offY : -offY;
        }
        else {
            this.offset.x = 0;
            this.offset.y = 0;
        }
        ctx.beginPath();
        ctx.lineJoin = "miter";
        ctx.moveTo(this.position.x + this.offset.x, this.position.y + this.offset.y);
        ctx.lineTo(this.position.x + this.offset.x + (sideLength * hDirection), this.position.y + this.offset.y);
        ctx.lineTo(this.position.x + this.offset.x + (sideLength * hDirection), this.position.y + this.offset.y +
            (sideLength * vDirection));
        ctx.lineTo(this.position.x + this.offset.x, this.position.y + this.offset.y + (sideLength * vDirection));
        ctx.lineTo(this.position.x + this.offset.x, this.position.y + this.offset.y);
        ctx.closePath();
        ctx.lineWidth = this.cropperSettings.cropperDrawSettings.strokeWidth;
        ctx.strokeStyle = this.cropperSettings.cropperDrawSettings.strokeColor;
        ctx.stroke();
    };
    CornerMarker.prototype.drawCornerFill = function (ctx) {
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
        ctx.moveTo(this.position.x + this.offset.x, this.position.y + this.offset.y);
        ctx.lineTo(this.position.x + this.offset.x + (sideLength * hDirection), this.position.y + this.offset.y);
        ctx.lineTo(this.position.x + this.offset.x + (sideLength * hDirection), this.position.y + this.offset.y +
            (sideLength * vDirection));
        ctx.lineTo(this.position.x + this.offset.x, this.position.y + this.offset.y + (sideLength * vDirection));
        ctx.lineTo(this.position.x + this.offset.x, this.position.y + this.offset.y);
        ctx.closePath();
        ctx.fillStyle = "rgba(255,255,255,.7)";
        ctx.fill();
    };
    CornerMarker.prototype.moveX = function (x) {
        this.setPosition(x, this.position.y);
    };
    CornerMarker.prototype.moveY = function (y) {
        this.setPosition(this.position.x, y);
    };
    CornerMarker.prototype.move = function (x, y) {
        this.setPosition(x, y);
        this.verticalNeighbour.moveX(x);
        this.horizontalNeighbour.moveY(y);
    };
    CornerMarker.prototype.addHorizontalNeighbour = function (neighbour) {
        this.horizontalNeighbour = neighbour;
    };
    CornerMarker.prototype.addVerticalNeighbour = function (neighbour) {
        this.verticalNeighbour = neighbour;
    };
    CornerMarker.prototype.getHorizontalNeighbour = function () {
        return this.horizontalNeighbour;
    };
    CornerMarker.prototype.getVerticalNeighbour = function () {
        return this.verticalNeighbour;
    };
    CornerMarker.prototype.draw = function (ctx) {
        this.drawCornerFill(ctx);
        this.drawCornerBorder(ctx);
    };
    return CornerMarker;
}(handle_1.Handle));
exports.CornerMarker = CornerMarker;
//# sourceMappingURL=cornerMarker.js.map