import {Point} from './point';
import {CropperSettings} from "../cropperSettings";

export class Handle {

    over:Boolean;
    drag:Boolean;
    position:Point;
    offset:Point;
    radius:number;

    constructor(x, y, radius, protected cropperSettings:CropperSettings) {
        this.over = false;
        this.drag = false;
        this.position = new Point(x, y);
        this.offset = new Point(0, 0);
        this.radius = radius;
    }

    setDrag(value) {
        this.drag = value;
        this.setOver(value);
    }

    draw(ctx) {
    }

    setOver(over) {
        this.over = over;
    }

    touchInBounds(x, y) {
        return (
            x > this.position.x - this.radius + this.offset.x &&
            x < this.position.x + this.radius + this.offset.x &&
            y > this.position.y - this.radius + this.offset.y &&
            y < this.position.y + this.radius + this.offset.y );
    }

    getPosition() {
        return this.position;
    }

    setPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
    }

}
