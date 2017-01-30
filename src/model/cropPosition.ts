import { Bounds } from './bounds';

export class CropPosition {

    public x: number;
    public y: number;
    public w: number;
    public h: number;

    constructor(x?: number, y?: number, w?: number, h?: number) {
        this.x = +x;
        this.y = +y;
        this.w = +w;
        this.h = +h;
    }

    public toBounds(): Bounds {
        return new Bounds(this.x, this.y, this.w, this.h);
    }

    public isInitialized(): boolean {
        return this.x && this.y && this.w && this.h && this.w !== 0 && this.h !== 0;
    }
}
