export class CropService {

    public canvas: any;
    public ctx: any;

    // todo: Unused
    public static DEG2RAD = 0.0174532925;

    public init(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
    };
}
