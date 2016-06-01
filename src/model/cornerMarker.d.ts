import { Handle } from './handle';
export declare class CornerMarker extends Handle {
    private horizontalNeighbour;
    private verticalNeighbour;
    drawCornerBorder(ctx: any): void;
    drawCornerFill(ctx: any): void;
    moveX(x: number): void;
    moveY(y: number): void;
    move(x: number, y: number): void;
    addHorizontalNeighbour(neighbour: CornerMarker): void;
    addVerticalNeighbour(neighbour: CornerMarker): void;
    getHorizontalNeighbour(): CornerMarker;
    getVerticalNeighbour(): CornerMarker;
    draw(ctx: any): void;
}
