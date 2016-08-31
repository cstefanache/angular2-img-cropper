import {Handle} from "./handle";

export class CornerMarker extends Handle {

    private horizontalNeighbour: CornerMarker;
    private verticalNeighbour: CornerMarker;

    constructor(x: number, y: number, radius: number, cropperSettings: any) {
        super(x, y, radius, cropperSettings);
    }

    public drawCornerBorder(ctx: CanvasRenderingContext2D): void {
        let sideLength = 10;
        if (this.over || this.drag) {
            sideLength = 12;
        }

        let hDirection = 1;
        let vDirection = 1;
        if (this.horizontalNeighbour.position.x < this.position.x) {
            hDirection = -1;
        }
        if (this.verticalNeighbour.position.y < this.position.y) {
            vDirection = -1;
        }
        if (this.cropperSettings.rounded) {
            let width = this.position.x - this.horizontalNeighbour.position.x;
            let height = this.position.y - this.verticalNeighbour.position.y;

            let offX = Math.round(Math.sin(Math.PI / 2) * Math.abs(width / 2)) / 4;
            let offY = Math.round(Math.sin(Math.PI / 2) * Math.abs(height / 2)) / 4;

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
        ctx.lineTo(this.position.x + this.offset.x + (sideLength * hDirection), this.position.y + this.offset.y +
            (sideLength * vDirection));
        ctx.lineTo(this.position.x + this.offset.x, this.position.y + this.offset.y + (sideLength * vDirection));
        ctx.lineTo(this.position.x + this.offset.x, this.position.y + this.offset.y);
        ctx.closePath();
        ctx.lineWidth = this.cropperSettings.cropperDrawSettings.strokeWidth;
        ctx.strokeStyle = this.cropperSettings.cropperDrawSettings.strokeColor;
        ctx.stroke();
    }

    public drawCornerFill(ctx: CanvasRenderingContext2D): void {
        let sideLength = 10;
        if (this.over || this.drag) {
            sideLength = 12;
        }
        let hDirection = 1;
        let vDirection = 1;
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
        ctx.fillStyle = "rgba(0,0,0,1)";
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
