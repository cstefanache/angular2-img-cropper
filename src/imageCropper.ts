import {Bounds} from "./model/bounds";
import {CornerMarker} from "./model/cornerMarker";
import {CropTouch} from "./model/cropTouch";
import {CropperSettings} from "./cropperSettings";
import {DragMarker} from "./model/dragMarker";
import {ImageCropperModel} from "./model/imageCropperModel";
import {ImageCropperDataShare} from "./imageCropperDataShare";
import {PointPool} from "./model/pointPool";
import {Point} from "./model/point";

export class ImageCropper extends ImageCropperModel {

    private crop: ImageCropper;
    private cropperSettings: CropperSettings;
    private previousDistance: number;

    constructor(cropperSettings: CropperSettings) {
        super();

        let x: number = 0;
        let y: number = 0;
        let width: number = cropperSettings.width;
        let height: number = cropperSettings.height;
        let keepAspect: boolean = cropperSettings.keepAspect;
        let touchRadius: number = cropperSettings.touchRadius;
        let minWidth: number = cropperSettings.minWidth;
        let minHeight: number = cropperSettings.minHeight;
        let croppedWidth: number = cropperSettings.croppedWidth;
        let croppedHeight: number = cropperSettings.croppedHeight;

        this.cropperSettings = cropperSettings;

        this.crop = this;
        this.x = x;
        this.y = y;

        if (width === void 0) {
            this.width = 100;
        }
        if (height === void 0) {
            this.height = 50;
        }
        if (keepAspect === void 0) {
            this.keepAspect = true;
        }
        if (touchRadius === void 0) {
            this.touchRadius = 20;
        }
        this.minWidth = minWidth;
        this.minHeight = minHeight;
        this.keepAspect = false;
        this.aspectRatio = 0;
        this.currentDragTouches = [];
        this.isMouseDown = false;
        this.ratioW = 1;
        this.ratioH = 1;
        this.fileType = "png";
        this.imageSet = false;
        this.pointPool = new PointPool(200);

        this.tl = new CornerMarker(x, y, touchRadius, this.cropperSettings);
        this.tr = new CornerMarker(x + width, y, touchRadius, this.cropperSettings);
        this.bl = new CornerMarker(x, y + height, touchRadius, this.cropperSettings);
        this.br = new CornerMarker(x + width, y + height, touchRadius, this.cropperSettings);

        this.tl.addHorizontalNeighbour(this.tr);
        this.tl.addVerticalNeighbour(this.bl);
        this.tr.addHorizontalNeighbour(this.tl);
        this.tr.addVerticalNeighbour(this.br);
        this.bl.addHorizontalNeighbour(this.br);
        this.bl.addVerticalNeighbour(this.tl);
        this.br.addHorizontalNeighbour(this.bl);
        this.br.addVerticalNeighbour(this.tr);
        this.markers = [this.tl, this.tr, this.bl, this.br];
        this.center = new DragMarker(x + (width / 2), y + (height / 2), touchRadius, this.cropperSettings);
        this.keepAspect = keepAspect;
        this.aspectRatio = height / width;
        this.croppedImage = new Image();
        this.currentlyInteracting = false;
        this.cropWidth = croppedWidth;
        this.cropHeight = croppedHeight;
    }

    private static sign(x): number {
        if (+x === x) {
            return (x === 0) ? x : (x > 0) ? 1 : -1;
        }
        return NaN;
    }

    private static getMousePos(canvas, evt): Point {
        let rect = canvas.getBoundingClientRect();
        return PointPool.instance.borrow(evt.clientX - rect.left, evt.clientY - rect.top);
    }

    private static getTouchPos(canvas, touch): Point {
        let rect = canvas.getBoundingClientRect();
        return PointPool.instance.borrow(touch.clientX - rect.left, touch.clientY - rect.top);
    }

    private static detectVerticalSquash(img) {
        var ih = img.height;
        var canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = ih;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        var data = ctx.getImageData(0, 0, 1, ih).data;
        // search image edge pixel position in case it is squashed vertically.
        var sy = 0;
        var ey = ih;
        var py = ih;
        while (py > sy) {
            var alpha = data[(py - 1) * 4 + 3];
            if (alpha === 0) {
                ey = py;
            }
            else {
                sy = py;
            }
            py = (ey + sy) >> 1;
        }
        var ratio = (py / ih);
        return (ratio === 0) ? 1 : ratio;
    }


    prepare(canvas: HTMLCanvasElement) {
        this.buffer = document.createElement('canvas');
        this.cropCanvas = document.createElement('canvas');
        this.cropCanvas.width = this.cropWidth;
        this.cropCanvas.height = this.cropHeight;
        this.buffer.width = canvas.width;
        this.buffer.height = canvas.height;
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.draw(this.ctx);
    }


    resizeCanvas(width, height): void {
        this.canvas.width = width;
        this.canvas.height = height;
        this.buffer.width = width;
        this.buffer.height = height;
        this.draw(this.ctx);
    }


    draw(ctx): void {
        var bounds = this.getBounds();
        if (this.srcImage) {
            ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            var sourceAspect = this.srcImage.height / this.srcImage.width;
            var canvasAspect = this.canvasHeight / this.canvasWidth;
            var w = this.canvasWidth;
            var h = this.canvasHeight;
            if (canvasAspect > sourceAspect) {
                w = this.canvasWidth;
                h = this.canvasWidth * sourceAspect;
            }
            else {
                h = this.canvasHeight;
                w = this.canvasHeight / sourceAspect;
            }
            this.ratioW = w / this.srcImage.width;
            this.ratioH = h / this.srcImage.height;
            if (canvasAspect < sourceAspect) {
                this.drawImageIOSFix(ctx, this.srcImage, 0, 0, this.srcImage.width, this.srcImage.height, this.buffer.width / 2 - w / 2, 0, w, h);
            }
            else {
                this.drawImageIOSFix(ctx, this.srcImage, 0, 0, this.srcImage.width, this.srcImage.height, 0, this.buffer.height / 2 - h / 2, w, h);
            }
            this.buffer.getContext('2d').drawImage(this.canvas, 0, 0, this.canvasWidth, this.canvasHeight);

            ctx.lineWidth = this.cropperSettings.cropperDrawSettings.strokeWidth;
            ctx.strokeStyle = this.cropperSettings.cropperDrawSettings.strokeColor; //'rgba(255,228,0,1)';

            if (!this.cropperSettings.rounded) {
                ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
                ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
                ctx.drawImage(this.buffer, bounds.left, bounds.top, Math.max(bounds.getWidth(), 1), Math.max(bounds.getHeight(), 1), bounds.left, bounds.top, bounds.getWidth(), bounds.getHeight());
                ctx.strokeRect(bounds.left, bounds.top, bounds.getWidth(), bounds.getHeight());
            } else {
                ctx.beginPath();
                ctx.arc(bounds.left + bounds.getWidth() / 2, bounds.top + bounds.getHeight() / 2, bounds.getWidth() / 2, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.stroke();
            }

            var marker;
            for (var i = 0; i < this.markers.length; i++) {
                marker = this.markers[i];
                marker.draw(ctx);
            }
            this.center.draw(ctx);
        }
        else {
            ctx.fillStyle = 'rgba(192,192,192,1)';
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }


    dragCrop(x, y, marker) {
        var bounds = this.getBounds();
        var left = x - (bounds.getWidth() / 2);
        var right = x + (bounds.getWidth() / 2);
        var top = y - (bounds.getHeight() / 2);
        var bottom = y + (bounds.getHeight() / 2);
        if (right >= this.maxXClamp) {
            x = this.maxXClamp - bounds.getWidth() / 2;
        }
        if (left <= this.minXClamp) {
            x = bounds.getWidth() / 2 + this.minXClamp;
        }
        if (top < this.minYClamp) {
            y = bounds.getHeight() / 2 + this.minYClamp;
        }
        if (bottom >= this.maxYClamp) {
            y = this.maxYClamp - bounds.getHeight() / 2;
        }
        this.tl.moveX(x - (bounds.getWidth() / 2));
        this.tl.moveY(y - (bounds.getHeight() / 2));
        this.tr.moveX(x + (bounds.getWidth() / 2));
        this.tr.moveY(y - (bounds.getHeight() / 2));
        this.bl.moveX(x - (bounds.getWidth() / 2));
        this.bl.moveY(y + (bounds.getHeight() / 2));
        this.br.moveX(x + (bounds.getWidth() / 2));
        this.br.moveY(y + (bounds.getHeight() / 2));
        marker.setPosition(x, y);


    }

    enforceMinSize(x, y, marker) {

        var xLength = x - marker.getHorizontalNeighbour().getPosition().x;
        var yLength = y - marker.getVerticalNeighbour().getPosition().y;
        var xOver = this.minWidth - Math.abs(xLength);
        var yOver = this.minHeight - Math.abs(yLength);

        if (xLength == 0 || yLength == 0) {
            x = marker.getPosition().x;
            y = marker.getPosition().y;

            return PointPool.instance.borrow(x, y);
        }

        if (this.keepAspect) {
            if (xOver > 0 && (yOver / this.aspectRatio) > 0) {
                if (xOver > (yOver / this.aspectRatio)) {
                    if (xLength < 0) {
                        x -= xOver;

                        if (yLength < 0) {
                            y -= xOver * this.aspectRatio;
                        }
                        else {
                            y += xOver * this.aspectRatio;
                        }
                    }
                    else {
                        x += xOver;
                        if (yLength < 0) {
                            y -= xOver * this.aspectRatio;
                        }
                        else {
                            y += xOver * this.aspectRatio;
                        }
                    }
                }
                else {
                    if (yLength < 0) {
                        y -= yOver;

                        if (xLength < 0) {
                            x -= yOver / this.aspectRatio;
                        }
                        else {
                            x += yOver / this.aspectRatio;
                        }

                    }
                    else {
                        y += yOver;
                        if (xLength < 0) {
                            x -= yOver / this.aspectRatio;
                        }
                        else {
                            x += yOver / this.aspectRatio;
                        }
                    }
                }
            }
            else {
                if (xOver > 0) {
                    if (xLength < 0) {
                        x -= xOver;

                        if (yLength < 0) {
                            y -= xOver * this.aspectRatio;
                        }
                        else {
                            y += xOver * this.aspectRatio;
                        }
                    }
                    else {
                        x += xOver;
                        if (yLength < 0) {
                            y -= xOver * this.aspectRatio;
                        }
                        else {
                            y += xOver * this.aspectRatio;
                        }
                    }
                }
                else if (yOver > 0) {
                    if (yLength < 0) {
                        y -= yOver;

                        if (xLength < 0) {
                            x -= yOver / this.aspectRatio;
                        }
                        else {
                            x += yOver / this.aspectRatio;
                        }
                    }
                    else {
                        y += yOver;
                        if (xLength < 0) {
                            x -= yOver / this.aspectRatio;
                        }
                        else {
                            x += yOver / this.aspectRatio;
                        }
                    }
                }
            }
        }
        else {
            if (xOver > 0) {
                if (xLength < 0) {
                    x -= xOver;
                }
                else {
                    x += xOver;
                }
            }
            if (yOver > 0) {
                if (yLength < 0) {
                    y -= yOver;
                }
                else {
                    y += yOver;
                }
            }
        }

        if (x < this.minXClamp || x > this.maxXClamp || y < this.minYClamp || y > this.maxYClamp) {
            x = marker.getPosition().x;
            y = marker.getPosition().y;
        }

        return PointPool.instance.borrow(x, y);
    }

    dragCorner(x, y, marker) {
        var iX = 0;
        var iY = 0;
        var ax = 0;
        var ay = 0;
        var newHeight = 0;
        var newWidth = 0;
        var newY = 0;
        var newX = 0;
        var anchorMarker;
        var fold = 0;


        if (this.keepAspect) {
            anchorMarker = marker.getHorizontalNeighbour().getVerticalNeighbour();
            ax = anchorMarker.getPosition().x;
            ay = anchorMarker.getPosition().y;
            if (x <= anchorMarker.getPosition().x) {
                if (y <= anchorMarker.getPosition().y) {
                    iX = ax - (100 / this.aspectRatio);
                    iY = ay - (100 / this.aspectRatio * this.aspectRatio);
                    fold = this.getSide(PointPool.instance.borrow(iX, iY), anchorMarker.getPosition(), PointPool.instance.borrow(x, y));
                    if (fold > 0) {
                        newHeight = Math.abs(anchorMarker.getPosition().y - y);
                        newWidth = newHeight / this.aspectRatio;
                        newY = anchorMarker.getPosition().y - newHeight;
                        newX = anchorMarker.getPosition().x - newWidth;
                        var min = this.enforceMinSize(newX, newY, marker);
                        marker.move(min.x, min.y);
                        PointPool.instance.returnPoint(min);
                    }
                    else if (fold < 0) {
                        newWidth = Math.abs(anchorMarker.getPosition().x - x);
                        newHeight = newWidth * this.aspectRatio;
                        newY = anchorMarker.getPosition().y - newHeight;
                        newX = anchorMarker.getPosition().x - newWidth;
                        var min = this.enforceMinSize(newX, newY, marker);
                        marker.move(min.x, min.y);
                        PointPool.instance.returnPoint(min);
                    }
                }
                else {
                    iX = ax - (100 / this.aspectRatio);
                    iY = ay + (100 / this.aspectRatio * this.aspectRatio);
                    fold = this.getSide(PointPool.instance.borrow(iX, iY), anchorMarker.getPosition(), PointPool.instance.borrow(x, y));
                    if (fold > 0) {
                        newWidth = Math.abs(anchorMarker.getPosition().x - x);
                        newHeight = newWidth * this.aspectRatio;
                        newY = anchorMarker.getPosition().y + newHeight;
                        newX = anchorMarker.getPosition().x - newWidth;
                        var min = this.enforceMinSize(newX, newY, marker);
                        marker.move(min.x, min.y);
                        PointPool.instance.returnPoint(min);
                    }
                    else if (fold < 0) {
                        newHeight = Math.abs(anchorMarker.getPosition().y - y);
                        newWidth = newHeight / this.aspectRatio;
                        newY = anchorMarker.getPosition().y + newHeight;
                        newX = anchorMarker.getPosition().x - newWidth;
                        var min = this.enforceMinSize(newX, newY, marker);
                        marker.move(min.x, min.y);
                        PointPool.instance.returnPoint(min);
                    }
                }
            }
            else {
                if (y <= anchorMarker.getPosition().y) {
                    iX = ax + (100 / this.aspectRatio);
                    iY = ay - (100 / this.aspectRatio * this.aspectRatio);
                    fold = this.getSide(PointPool.instance.borrow(iX, iY), anchorMarker.getPosition(), PointPool.instance.borrow(x, y));
                    if (fold < 0) {
                        newHeight = Math.abs(anchorMarker.getPosition().y - y);
                        newWidth = newHeight / this.aspectRatio;
                        newY = anchorMarker.getPosition().y - newHeight;
                        newX = anchorMarker.getPosition().x + newWidth;
                        var min = this.enforceMinSize(newX, newY, marker);
                        marker.move(min.x, min.y);
                        PointPool.instance.returnPoint(min);
                    }
                    else if (fold > 0) {
                        newWidth = Math.abs(anchorMarker.getPosition().x - x);
                        newHeight = newWidth * this.aspectRatio;
                        newY = anchorMarker.getPosition().y - newHeight;
                        newX = anchorMarker.getPosition().x + newWidth;
                        var min = this.enforceMinSize(newX, newY, marker);
                        marker.move(min.x, min.y);
                        PointPool.instance.returnPoint(min);
                    }
                }
                else {
                    iX = ax + (100 / this.aspectRatio);
                    iY = ay + (100 / this.aspectRatio * this.aspectRatio);
                    fold = this.getSide(PointPool.instance.borrow(iX, iY), anchorMarker.getPosition(), PointPool.instance.borrow(x, y));
                    if (fold < 0) {
                        newWidth = Math.abs(anchorMarker.getPosition().x - x);
                        newHeight = newWidth * this.aspectRatio;
                        newY = anchorMarker.getPosition().y + newHeight;
                        newX = anchorMarker.getPosition().x + newWidth;
                        var min = this.enforceMinSize(newX, newY, marker);
                        marker.move(min.x, min.y);
                        PointPool.instance.returnPoint(min);
                    }
                    else if (fold > 0) {
                        newHeight = Math.abs(anchorMarker.getPosition().y - y);
                        newWidth = newHeight / this.aspectRatio;
                        newY = anchorMarker.getPosition().y + newHeight;
                        newX = anchorMarker.getPosition().x + newWidth;
                        var min = this.enforceMinSize(newX, newY, marker);
                        marker.move(min.x, min.y);
                        PointPool.instance.returnPoint(min);
                    }
                }
            }
        }
        else {
            var min = this.enforceMinSize(x, y, marker);
            marker.move(min.x, min.y);
            PointPool.instance.returnPoint(min);
        }
        this.center.recalculatePosition(this.getBounds());
    }

    getSide(a, b, c) {
        var n = ImageCropper.sign((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x));
        //TODO move the return of the pools to outside of this function
        PointPool.instance.returnPoint(a);
        PointPool.instance.returnPoint(c);
        return n;
    }

    handleRelease(newCropTouch) {

        if (newCropTouch == null) {
            return;
        }
        var index = 0;
        for (var k = 0; k < this.currentDragTouches.length; k++) {
            if (newCropTouch.id == this.currentDragTouches[k].id) {
                this.currentDragTouches[k].dragHandle.setDrag(false);
                newCropTouch.dragHandle = null;
                index = k;
            }
        }
        this.currentDragTouches.splice(index, 1);
        this.draw(this.ctx);
    }

    handleMove(newCropTouch) {
        var matched = false;
        for (var k = 0; k < this.currentDragTouches.length; k++) {
            if (newCropTouch.id == this.currentDragTouches[k].id && this.currentDragTouches[k].dragHandle != null) {
                var dragTouch = this.currentDragTouches[k];
                var clampedPositions = this.clampPosition(newCropTouch.x - dragTouch.dragHandle.offset.x, newCropTouch.y - dragTouch.dragHandle.offset.y);
                newCropTouch.x = clampedPositions.x;
                newCropTouch.y = clampedPositions.y;
                PointPool.instance.returnPoint(clampedPositions);
                if (dragTouch.dragHandle instanceof CornerMarker) {
                    this.dragCorner(newCropTouch.x, newCropTouch.y, dragTouch.dragHandle);
                }
                else {
                    this.dragCrop(newCropTouch.x, newCropTouch.y, dragTouch.dragHandle);
                }
                this.currentlyInteracting = true;
                matched = true;
                ImageCropperDataShare.setPressed(this.canvas);
                break;
            }
        }
        if (!matched) {
            for (var i = 0; i < this.markers.length; i++) {
                var marker = this.markers[i];
                if (marker.touchInBounds(newCropTouch.x, newCropTouch.y)) {
                    newCropTouch.dragHandle = marker;
                    this.currentDragTouches.push(newCropTouch);
                    marker.setDrag(true);
                    newCropTouch.dragHandle.offset.x = newCropTouch.x - newCropTouch.dragHandle.getPosition().x;
                    newCropTouch.dragHandle.offset.y = newCropTouch.y - newCropTouch.dragHandle.getPosition().y;
                    this.dragCorner(newCropTouch.x - newCropTouch.dragHandle.offset.x, newCropTouch.y - newCropTouch.dragHandle.offset.y, newCropTouch.dragHandle);
                    break;
                }
            }
            if (newCropTouch.dragHandle == null) {
                if (this.center.touchInBounds(newCropTouch.x, newCropTouch.y)) {
                    newCropTouch.dragHandle = this.center;
                    this.currentDragTouches.push(newCropTouch);
                    newCropTouch.dragHandle.setDrag(true);
                    newCropTouch.dragHandle.offset.x = newCropTouch.x - newCropTouch.dragHandle.getPosition().x;
                    newCropTouch.dragHandle.offset.y = newCropTouch.y - newCropTouch.dragHandle.getPosition().y;
                    this.dragCrop(newCropTouch.x - newCropTouch.dragHandle.offset.x, newCropTouch.y - newCropTouch.dragHandle.offset.y, newCropTouch.dragHandle);
                }
            }
        }
    }

    updateClampBounds() {
        var sourceAspect = this.srcImage.height / this.srcImage.width;
        var canvasAspect = this.canvas.height / this.canvas.width;
        var w = this.canvas.width;
        var h = this.canvas.height;
        if (canvasAspect > sourceAspect) {
            w = this.canvas.width;
            h = this.canvas.width * sourceAspect;
        }
        else {
            h = this.canvas.height;
            w = this.canvas.height / sourceAspect;
        }
        this.minXClamp = this.canvas.width / 2 - w / 2;
        this.minYClamp = this.canvas.height / 2 - h / 2;
        this.maxXClamp = this.canvas.width / 2 + w / 2;
        this.maxYClamp = this.canvas.height / 2 + h / 2;
    }

    getCropBounds() {
        var bounds = this.getBounds();
        bounds.top = Math.round(( bounds.top + this.minYClamp) / this.ratioH);
        bounds.bottom = Math.round(( bounds.bottom + this.minYClamp) / this.ratioH);
        bounds.left = Math.round((bounds.left - this.minXClamp) / this.ratioW);
        bounds.right = Math.round((bounds.right - this.minXClamp) / this.ratioW);
        return bounds;
    }

    clampPosition(x, y) {
        if (x < this.minXClamp) {
            x = this.minXClamp;
        }
        if (x > this.maxXClamp) {
            x = this.maxXClamp;
        }
        if (y < this.minYClamp) {
            y = this.minYClamp;
        }
        if (y > this.maxYClamp) {
            y = this.maxYClamp;
        }
        return PointPool.instance.borrow(x, y);
    }

    isImageSet() {
        return this.imageSet;
    }

    setImage(img: any) {
        if (!img) {
            throw "Image is null";
        }

        this.srcImage = img;
        this.imageSet = true;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        var bufferContext = this.buffer.getContext('2d');
        bufferContext.clearRect(0, 0, this.buffer.width, this.buffer.height);

        var splitName = img.src.split('.');
        var fileType = splitName[1];
        if (fileType == 'png' || fileType == 'jpg') {
            this.fileType = fileType;
        }

        //TODO: investigate better solution
        //this.fileType = img.src.match(/^data:.+\/(.+);base64,(.*)$/)[1];


        if (this.cropperSettings.minWithRelativeToResolution) {
            this.minWidth = (this.canvas.width * this.minWidth / this.srcImage.width);
            this.minHeight = (this.canvas.height * this.minHeight / this.srcImage.height);
        }

        this.updateClampBounds();
        var sourceAspect = this.srcImage.height / this.srcImage.width;
        var cropBounds = this.getBounds();
        var cropAspect = cropBounds.getHeight() / cropBounds.getWidth();
        var w = this.canvas.width;
        var h = this.canvas.height;
        this.canvasWidth = w;
        this.canvasHeight = h;
        var cX = this.canvas.width / 2;
        var cY = this.canvas.height / 2;
        var tlPos = PointPool.instance.borrow(cX - cropBounds.getWidth() / 2, cY + cropBounds.getHeight() / 2);
        var trPos = PointPool.instance.borrow(cX + cropBounds.getWidth() / 2, cY + cropBounds.getHeight() / 2);
        var blPos = PointPool.instance.borrow(cX - cropBounds.getWidth() / 2, cY - cropBounds.getHeight() / 2);
        var brPos = PointPool.instance.borrow(cX + cropBounds.getWidth() / 2, cY - cropBounds.getHeight() / 2);
        this.tl.setPosition(tlPos.x, tlPos.y);
        this.tr.setPosition(trPos.x, trPos.y);
        this.bl.setPosition(blPos.x, blPos.y);
        this.br.setPosition(brPos.x, brPos.y);
        PointPool.instance.returnPoint(tlPos);
        PointPool.instance.returnPoint(trPos);
        PointPool.instance.returnPoint(blPos);
        PointPool.instance.returnPoint(brPos);
        this.center.setPosition(cX, cY);
        if (cropAspect > sourceAspect) {
            var imageH = Math.min(w * sourceAspect, h);
            var cropW = imageH / cropAspect;
            tlPos = PointPool.instance.borrow(cX - cropW / 2, cY + imageH / 2);
            trPos = PointPool.instance.borrow(cX + cropW / 2, cY + imageH / 2);
            blPos = PointPool.instance.borrow(cX - cropW / 2, cY - imageH / 2);
            brPos = PointPool.instance.borrow(cX + cropW / 2, cY - imageH / 2);
        } else {
            var imageW = Math.min(h / sourceAspect, w);
            var cropH = imageW * cropAspect;
            tlPos = PointPool.instance.borrow(cX - imageW / 2, cY + cropH / 2);
            trPos = PointPool.instance.borrow(cX + imageW / 2, cY + cropH / 2);
            blPos = PointPool.instance.borrow(cX - imageW / 2, cY - cropH / 2);
            brPos = PointPool.instance.borrow(cX + imageW / 2, cY - cropH / 2);
        }

        this.tl.setPosition(tlPos.x, tlPos.y);
        this.tr.setPosition(trPos.x, trPos.y);
        this.bl.setPosition(blPos.x, blPos.y);
        this.br.setPosition(brPos.x, brPos.y);
        PointPool.instance.returnPoint(tlPos);
        PointPool.instance.returnPoint(trPos);
        PointPool.instance.returnPoint(blPos);
        PointPool.instance.returnPoint(brPos);


        this.vertSquashRatio = ImageCropper.detectVerticalSquash(this.srcImage);
        this.draw(this.ctx);
        this.croppedImage = this.getCroppedImage(this.cropWidth, this.cropHeight);
    }

    getCroppedImage(fillWidth?: number, fillHeight?: number) {
        var bounds = this.getBounds();
        if (!this.srcImage) {
            throw "Source image not set.";
        }
        var sourceAspect = this.srcImage.height / this.srcImage.width;
        var canvasAspect = this.canvas.height / this.canvas.width;
        var w = this.canvas.width;
        var h = this.canvas.height;
        if (canvasAspect > sourceAspect) {
            w = this.canvas.width;
            h = this.canvas.width * sourceAspect;
        }
        else if (canvasAspect < sourceAspect) {
            h = this.canvas.height;
            w = this.canvas.height / sourceAspect;
        }
        else {
            h = this.canvas.height;
            w = this.canvas.width;
        }
        this.ratioW = w / this.srcImage.width;
        this.ratioH = h / this.srcImage.height;
        var offsetH = (this.buffer.height - h) / 2 / this.ratioH;
        var offsetW = (this.buffer.width - w) / 2 / this.ratioW;

        this.drawImageIOSFix(
            this.cropCanvas.getContext('2d'),
            this.srcImage,
            Math.max(Math.round((bounds.left) / this.ratioW - offsetW), 0),
            Math.max(Math.round(bounds.top / this.ratioH - offsetH), 0),
            Math.max(Math.round(bounds.getWidth() / this.ratioW), 1),
            Math.max(Math.round(bounds.getHeight() / this.ratioH), 1),
            0, 0, this.cropCanvas.width, this.cropCanvas.height);

        this.croppedImage.width = this.cropCanvas.width;
        this.croppedImage.height = this.cropCanvas.height;
        this.croppedImage.src = this.cropCanvas.toDataURL("image/" + this.fileType);
        return this.croppedImage;
    }

    getBounds() {
        var minX = Number.MAX_VALUE;
        var minY = Number.MAX_VALUE;
        var maxX = -Number.MAX_VALUE;
        var maxY = -Number.MAX_VALUE;
        for (var i = 0; i < this.markers.length; i++) {
            var marker = this.markers[i];
            if (marker.getPosition().x < minX) {
                minX = marker.getPosition().x;
            }
            if (marker.getPosition().x > maxX) {
                maxX = marker.getPosition().x;
            }
            if (marker.getPosition().y < minY) {
                minY = marker.getPosition().y;
            }
            if (marker.getPosition().y > maxY) {
                maxY = marker.getPosition().y;
            }
        }
        var bounds = new Bounds();
        bounds.left = minX;
        bounds.right = maxX;
        bounds.top = minY;
        bounds.bottom = maxY;
        return bounds;
    }

    setBounds(bounds) {

        var topLeft;
        var topRight;
        var bottomLeft;
        var bottomRight;

        var currentBounds = this.getBounds();
        for (var i = 0; i < this.markers.length; i++) {
            var marker = this.markers[i];

            if (marker.getPosition().x == currentBounds.left) {
                if (marker.getPosition().y == currentBounds.top) {
                    topLeft = marker;
                }
                else {
                    bottomLeft = marker;
                }
            }
            else {
                if (marker.getPosition().y == currentBounds.top) {
                    topRight = marker;
                }
                else {
                    bottomRight = marker;
                }
            }
        }

        topLeft.setPosition(bounds.left, bounds.top);
        topRight.setPosition(bounds.right, bounds.top);
        bottomLeft.setPosition(bounds.left, bounds.bottom);
        bottomRight.setPosition(bounds.right, bounds.bottom);

        this.center.recalculatePosition(bounds);
        this.center.draw(this.ctx);

    }

    onTouchMove(event: TouchEvent) {
        if (this.crop.isImageSet()) {
            event.preventDefault();
            if (event.touches.length === 1) {
                for (var i = 0; i < event.touches.length; i++) {
                    var touch = event.touches[i];
                    var touchPosition = ImageCropper.getTouchPos(this.canvas, touch);
                    var cropTouch = new CropTouch(touchPosition.x, touchPosition.y, touch.identifier);
                    PointPool.instance.returnPoint(touchPosition);
                    this.move(cropTouch);
                }
            } else if (event.touches.length === 2) {
                var distance =
                    ((event.touches[0].clientX - event.touches[1].clientX) * (event.touches[0].clientX - event.touches[1].clientX)) +
                    ((event.touches[0].clientY - event.touches[1].clientY) * (event.touches[0].clientY - event.touches[1].clientY));
                if (this.previousDistance && this.previousDistance !== distance) {
                    var increment: number = distance < this.previousDistance ? 1 : -1;
                    var bounds: Bounds = this.getBounds();

                    bounds.top += increment;
                    bounds.left += increment;
                    bounds.right -= increment;
                    bounds.bottom -= increment;

                    this.setBounds(bounds);
                }
                this.previousDistance = distance;
            }
            this.draw(this.ctx);
        }
    }

    onMouseMove(e) {

        if (this.crop.isImageSet()) {
            let mousePosition = ImageCropper.getMousePos(this.canvas, e);
            this.move(new CropTouch(mousePosition.x, mousePosition.y, 0));
            let dragTouch = this.getDragTouchForID(0);
            if (dragTouch) {
                dragTouch.x = mousePosition.x;
                dragTouch.y = mousePosition.y;
            } else {
                dragTouch = new CropTouch(mousePosition.x, mousePosition.y, 0);
            }
            PointPool.instance.returnPoint(mousePosition);
            this.drawCursors(dragTouch);
            this.draw(this.ctx);
        }
    }

    move(cropTouch) {
        if (this.isMouseDown) {
            this.handleMove(cropTouch);
        }
    }

    getDragTouchForID(id) {
        for (var i = 0; i < this.currentDragTouches.length; i++) {
            if (id == this.currentDragTouches[i].id) {
                return this.currentDragTouches[i];
            }
        }
    }

    drawCursors(cropTouch) {
        var cursorDrawn = false;
        if (cropTouch != null) {
            if (cropTouch.dragHandle == this.center) {
                ImageCropperDataShare.setStyle(this.canvas, 'move');
                cursorDrawn = true;
            }
            if (cropTouch.dragHandle != null && cropTouch.dragHandle instanceof CornerMarker) {

                this.drawCornerCursor(cropTouch.dragHandle, cropTouch.dragHandle.getPosition().x, cropTouch.dragHandle.getPosition().y);
                cursorDrawn = true;
            }
        }
        var didDraw = false;
        if (!cursorDrawn) {
            for (var i = 0; i < this.markers.length; i++) {
                didDraw = didDraw || this.drawCornerCursor(this.markers[i], cropTouch.x, cropTouch.y);
            }
            if (!didDraw) {
                ImageCropperDataShare.setStyle(this.canvas, 'initial');
            }
        }
        if (!didDraw && !cursorDrawn && this.center.touchInBounds(cropTouch.x, cropTouch.y)) {
            this.center.setOver(true);
            ImageCropperDataShare.setOver(this.canvas);
            ImageCropperDataShare.setStyle(this.canvas, 'move');
        }
        else {
            this.center.setOver(false);
        }
    }

    drawCornerCursor(marker, x, y) {
        if (marker.touchInBounds(x, y)) {
            marker.setOver(true);
            if (marker.getHorizontalNeighbour().getPosition().x > marker.getPosition().x) {
                if (marker.getVerticalNeighbour().getPosition().y > marker.getPosition().y) {
                    ImageCropperDataShare.setOver(this.canvas);
                    ImageCropperDataShare.setStyle(this.canvas, 'nwse-resize');
                }
                else {
                    ImageCropperDataShare.setOver(this.canvas);
                    ImageCropperDataShare.setStyle(this.canvas, 'nesw-resize');
                }
            }
            else {
                if (marker.getVerticalNeighbour().getPosition().y > marker.getPosition().y) {
                    ImageCropperDataShare.setOver(this.canvas);
                    ImageCropperDataShare.setStyle(this.canvas, 'nesw-resize');
                }
                else {
                    ImageCropperDataShare.setOver(this.canvas);
                    ImageCropperDataShare.setStyle(this.canvas, 'nwse-resize');
                }
            }
            return true;
        }
        marker.setOver(false);
        return false;
    }

    onTouchStart(event: TouchEvent) {
        if (this.crop.isImageSet()) {
            this.isMouseDown = true;
        }
    }

    onTouchEnd(event: TouchEvent) {
        if (this.crop.isImageSet()) {
            for (var i = 0; i < event.changedTouches.length; i++) {
                var touch = event.changedTouches[i];
                var dragTouch = this.getDragTouchForID(touch.identifier);
                if (dragTouch != null) {
                    if (dragTouch.dragHandle instanceof CornerMarker || dragTouch.dragHandle instanceof DragMarker) {
                        dragTouch.dragHandle.setOver(false);
                    }
                    this.handleRelease(dragTouch);
                }
            }

            if (this.currentDragTouches.length == 0) {
                this.isMouseDown = false;
                this.currentlyInteracting = false;
            }
        }
    }

    //http://stackoverflow.com/questions/11929099/html5-canvas-drawimage-ratio-bug-ios
    drawImageIOSFix(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
        // Works only if whole image is displayed:
        // ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
        // The following works correct also when only a part of the image is displayed:
        //ctx.drawImage(img, sx * this.vertSquashRatio, sy * this.vertSquashRatio, sw * this.vertSquashRatio, sh * this.vertSquashRatio, dx, dy, dw, dh);
        ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
    }


    onMouseDown() {
        if (this.crop.isImageSet()) {
            this.isMouseDown = true;
        }
    }


    onMouseUp() {
        if (this.crop.isImageSet()) {
            ImageCropperDataShare.setReleased(this.canvas);
            this.isMouseDown = false;
            this.handleRelease(new CropTouch(0, 0, 0));
        }
    }


}
