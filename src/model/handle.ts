import {Point} from './point';

export class Handle {

    over:Boolean;
    drag:Boolean;
    position:Point;
    offset:Point;
    radius:number;

    constructor(x, y, radius) {
        this.over = false;
        this.drag = false;
        this.position = new Point(x, y);
        this.offset = new Point(0, 0);
        this.radius = radius;
    }

    setDrag(value) {
        this.drag = value;
        this.setOver(value);
    };

    draw(ctx) {
    };

    setOver(over) {
        this.over = over;
    };

    touchInBounds(x, y) {
        return (x > this.position.x - this.radius && x < this.position.x + this.radius && y > this.position.y - this.radius && y < this.position.y + this.radius);
    };

    getPosition() {
        return this.position;
    };

    setPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
    };

}
