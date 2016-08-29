import {Point} from './point';
import {CropperSettings} from "../cropperSettings";

export class Handle {

    public over: boolean;
    public drag: boolean;
    public position: Point;
    public offset: Point;
    public radius: number;

    protected cropperSettings: CropperSettings;


    constructor(x, y, radius, cropperSettings) {
        this.over = false;
        this.drag = false;
        this.position = new Point(x, y);
        this.offset = new Point(0, 0);
        this.radius = radius;
    }

    public setDrag(value) {
        this.drag = value;
        this.setOver(value);
    }

    public draw(ctx) {
    }

    public setOver(over) {
        this.over = over;
    }

    public touchInBounds(x, y) {
        return (
        x > this.position.x - this.radius + this.offset.x &&
        x < this.position.x + this.radius + this.offset.x &&
        y > this.position.y - this.radius + this.offset.y &&
        y < this.position.y + this.radius + this.offset.y );
    }

    public getPosition() {
        return this.position;
    }

    public setPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
    }

}
