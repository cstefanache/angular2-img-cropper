import {Handle} from './handle';
import {PointPool} from './pointPool';
import {Point} from './point';
import {CropperDrawSettings} from "../cropperDrawSettings";

export class CornerMarker extends Handle {

    private horizontalNeighbour:CornerMarker;
    private verticalNeighbour:CornerMarker;

    drawCornerBorder(ctx:any):void {
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

            var offX = Math.round(Math.sin(Math.PI / 2) * Math.abs(width/2)) / 4;
            var offY = Math.round(Math.sin(Math.PI / 2) * Math.abs(height/2)) / 4;

            this.offset.x = hDirection > 0 ? offX : -offX;
            this.offset.y = vDirection > 0 ? offY : -offY;
        } else {
            this.offset.x = 0;
            this.offset.y = 0;
        }

        ctx.beginPath();
        ctx.lineJoin = "miter";
        ctx.moveTo(this.position.x + this.offset.x, this.position.y + this.offset.y);
        ctx.lineTo(this.position.x + this.offset.x + (sideLength * hDirection), this.position.y + this.offset.y);
        ctx.lineTo(this.position.x + this.offset.x + (sideLength * hDirection), this.position.y + this.offset.y + (sideLength * vDirection));
        ctx.lineTo(this.position.x + this.offset.x, this.position.y + this.offset.y + (sideLength * vDirection));
        ctx.lineTo(this.position.x + this.offset.x, this.position.y + this.offset.y);
        ctx.closePath();
        ctx.lineWidth = this.cropperSettings.cropperDrawSettings.strokeWidth;
        ctx.strokeStyle = this.cropperSettings.cropperDrawSettings.strokeColor;
        ctx.stroke();
    }

    drawCornerFill(ctx:any):void {
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
        ctx.lineTo(this.position.x + this.offset.x + (sideLength * hDirection), this.position.y + this.offset.y + (sideLength * vDirection));
        ctx.lineTo(this.position.x + this.offset.x, this.position.y + this.offset.y + (sideLength * vDirection));
        ctx.lineTo(this.position.x + this.offset.x, this.position.y + this.offset.y);
        ctx.closePath();
        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.fill();
    }

    moveX(x:number):void {
        this.setPosition(x, this.position.y);
    }

    moveY(y:number):void {
        this.setPosition(this.position.x, y);
    }

    move(x:number, y:number):void {
        this.setPosition(x, y);
        this.verticalNeighbour.moveX(x);
        this.horizontalNeighbour.moveY(y);
    }

    addHorizontalNeighbour(neighbour:CornerMarker):void {
        this.horizontalNeighbour = neighbour;
    }

    addVerticalNeighbour(neighbour:CornerMarker):void {
        this.verticalNeighbour = neighbour;
    }

    getHorizontalNeighbour():CornerMarker {
        return this.horizontalNeighbour;
    }

    getVerticalNeighbour():CornerMarker {
        return this.verticalNeighbour;
    }

    draw(ctx:any):void {
        this.drawCornerFill(ctx);
        this.drawCornerBorder(ctx);
    }

}
