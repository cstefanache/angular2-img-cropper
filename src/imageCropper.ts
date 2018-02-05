import {Bounds} from './model/bounds';
import {CornerMarker} from './model/cornerMarker';
import {CropTouch} from './model/cropTouch';
import {CropperSettings} from './cropperSettings';
import {DragMarker} from './model/dragMarker';
import {ImageCropperModel} from './model/imageCropperModel';
import {ImageCropperDataShare} from './imageCropperDataShare';
import {PointPool} from './model/pointPool';
import {Point} from './model/point';
import {ICornerMarker} from './model/cornerMarker';

export class ImageCropper extends ImageCropperModel {

    private crop:ImageCropper;
    private cropperSettings:CropperSettings;
    private previousDistance:number;

    constructor(cropperSettings:CropperSettings) {
        super();

        let x:number = 0;
        let y:number = 0;
        let width:number = cropperSettings.width;
        let height:number = cropperSettings.height;
        let keepAspect:boolean = cropperSettings.keepAspect;
        let touchRadius:number = cropperSettings.touchRadius;
        let centerTouchRadius:number = cropperSettings.centerTouchRadius;
        let minWidth:number = cropperSettings.minWidth;
        let minHeight:number = cropperSettings.minHeight;
        let croppedWidth:number = cropperSettings.croppedWidth;
        let croppedHeight:number = cropperSettings.croppedHeight;

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
        this.fileType = cropperSettings.fileType;
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


        this.center = new DragMarker(x + (width / 2), y + (height / 2), centerTouchRadius, this.cropperSettings);
        this.keepAspect = keepAspect;
        this.aspectRatio = height / width;
        this.croppedImage = new Image();
        this.currentlyInteracting = false;
        this.cropWidth = croppedWidth;
        this.cropHeight = croppedHeight;
    }

    private static sign(x:number):number {
        if (+x === x) {
            return (x === 0) ? x : (x > 0) ? 1 : -1;
        }
        return NaN;
    }

    private static getMousePos(canvas:HTMLCanvasElement, evt:MouseEvent):Point {
        let rect = canvas.getBoundingClientRect();
        return PointPool.instance.borrow(evt.clientX - rect.left, evt.clientY - rect.top);
    }

    private static getTouchPos(canvas:HTMLCanvasElement, touch:Touch):Point {
        let rect = canvas.getBoundingClientRect();
        return PointPool.instance.borrow(touch.clientX - rect.left, touch.clientY - rect.top);
    }

    private static detectVerticalSquash(img:HTMLImageElement | HTMLCanvasElement | HTMLVideoElement) {
        let ih = img.height;
        let canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = ih;
        let ctx = <CanvasRenderingContext2D> canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        let imageData:any = ctx.getImageData(0, 0, 1, ih)
        if (imageData) {
            let data = imageData.data;
            // search image edge pixel position in case it is squashed vertically.
            let sy = 0;
            let ey = ih;
            let py = ih;
            while (py > sy) {
                let alpha = data[(py - 1) * 4 + 3];
                if (alpha === 0) {
                    ey = py;
                } else {
                    sy = py;
                }
                py = (ey + sy) >> 1;
            }
            let ratio = (py / ih);
            return (ratio === 0) ? 1 : ratio;
        } else {
            return 1;
        }
    }

    private getDataUriMimeType(dataUri:string) {
        // Get a substring because the regex does not perform well on very large strings. Cater for optional charset. Length 50 shoould be enough.
        let dataUriSubstring = dataUri.substring(0, 50);
        let mimeType = 'image/png';
        // data-uri scheme
        // data:[<media type>][;charset=<character set>][;base64],<data>
        let regEx = RegExp(/^(data:)([\w\/\+]+);(charset=[\w-]+|base64).*,(.*)/gi);
        let matches = regEx.exec(dataUriSubstring);
        if (matches && matches[2]) {
            mimeType = matches[2];
            if (mimeType == 'image/jpg') {
                mimeType = 'image/jpeg';
            }
        }
        return mimeType;
    }

    public prepare(canvas:HTMLCanvasElement) {
        this.buffer = document.createElement('canvas');
        this.cropCanvas = document.createElement('canvas');

        // todo get more reliable parent width value.
        let responsiveWidth:number = canvas.parentElement ? canvas.parentElement.clientWidth : 0;
        if (responsiveWidth > 0 && this.cropperSettings.dynamicSizing) {
            this.cropCanvas.width = responsiveWidth;
            this.buffer.width = responsiveWidth;
            canvas.width = responsiveWidth;
        } else {
            this.cropCanvas.width = this.cropWidth;
            this.buffer.width = canvas.width;
        }

        this.cropCanvas.height = this.cropHeight;
        this.buffer.height = canvas.height;
        this.canvas = canvas;
        this.ctx = <CanvasRenderingContext2D> this.canvas.getContext('2d');

        this.draw(this.ctx);
    }

    public resizeCanvas(width:number, height:number, setImage:boolean = false):void {
        this.canvas.width = this.cropCanvas.width = this.width = this.canvasWidth = this.buffer.width = width;
        this.canvas.height = this.cropCanvas.height = this.height = this.canvasHeight = this.buffer.height = height;
        if (setImage) {
            this.setImage(this.srcImage);
        }
    }

    public reset():void {
        this.setImage(undefined);
    }

    public draw(ctx:CanvasRenderingContext2D):void {
        let bounds:Bounds = this.getBounds();
        if (this.srcImage) {
            ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            let sourceAspect:number = this.srcImage.height / this.srcImage.width;
            let canvasAspect:number = this.canvasHeight / this.canvasWidth;
            let w:number = this.canvasWidth;
            let h:number = this.canvasHeight;
            if (canvasAspect > sourceAspect) {
                w = this.canvasWidth;
                h = this.canvasWidth * sourceAspect;
            } else {
                h = this.canvasHeight;
                w = this.canvasHeight / sourceAspect;
            }
            this.ratioW = w / this.srcImage.width;
            this.ratioH = h / this.srcImage.height;
            if (canvasAspect < sourceAspect) {
                this.drawImageIOSFix(ctx, this.srcImage, 0, 0, this.srcImage.width, this.srcImage.height,
                    this.buffer.width / 2 - w / 2, 0, w, h);
            } else {
                this.drawImageIOSFix(ctx, this.srcImage, 0, 0, this.srcImage.width, this.srcImage.height, 0,
                    this.buffer.height / 2 - h / 2, w, h);
            }
            (<CanvasRenderingContext2D> this.buffer.getContext('2d'))
                .drawImage(this.canvas, 0, 0, this.canvasWidth, this.canvasHeight);

            ctx.lineWidth = this.cropperSettings.cropperDrawSettings.strokeWidth;
            ctx.strokeStyle = this.cropperSettings.cropperDrawSettings.strokeColor; // 'rgba(255,228,0,1)';

            ctx.fillStyle =  'rgba(0, 0, 0, 0.6)';
            if (!this.cropperSettings.rounded) {
                ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
                ctx.drawImage(this.buffer, bounds.left, bounds.top, Math.max(bounds.width, 1), Math.max(bounds.height, 1), bounds.left, bounds.top, bounds.width, bounds.height);
                ctx.strokeRect(bounds.left, bounds.top, bounds.width, bounds.height);
            }
            else {
                ctx.beginPath();
                ctx.arc(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2,  bounds.width / 2, 0, 2 * Math.PI);
                ctx.rect(this.canvasWidth, 0, -this.canvasWidth, this.canvasHeight);
                ctx.fill();
            }

            let marker:CornerMarker;

            for (let i = 0; i < this.markers.length; i++) {
                marker = this.markers[i];
                marker.draw(ctx);
            }
            this.center.draw(ctx);
        } else {
            ctx.fillStyle = 'rgba(192,192,192,1)';
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    public dragCenter(x:number, y:number, marker:DragMarker) {
        let bounds = this.getBounds();
        let left = x - (bounds.width / 2);
        let right = x + (bounds.width / 2);
        let top = y - (bounds.height / 2);
        let bottom = y + (bounds.height / 2);
        if (right >= this.maxXClamp) {
            x = this.maxXClamp - bounds.width / 2;
        }
        if (left <= this.minXClamp) {
            x = bounds.width / 2 + this.minXClamp;
        }
        if (top < this.minYClamp) {
            y = bounds.height / 2 + this.minYClamp;
        }
        if (bottom >= this.maxYClamp) {
            y = this.maxYClamp - bounds.height / 2;
        }
        this.tl.moveX(x - (bounds.width / 2));
        this.tl.moveY(y - (bounds.height / 2));
        this.tr.moveX(x + (bounds.width / 2));
        this.tr.moveY(y - (bounds.height / 2));
        this.bl.moveX(x - (bounds.width / 2));
        this.bl.moveY(y + (bounds.height / 2));
        this.br.moveX(x + (bounds.width / 2));
        this.br.moveY(y + (bounds.height / 2));
        marker.setPosition(x, y);
    }

    public enforceMinSize(x:number, y:number, marker:CornerMarker) {

        let xLength = x - marker.getHorizontalNeighbour().position.x;
        let yLength = y - marker.getVerticalNeighbour().position.y;
        let xOver = this.minWidth - Math.abs(xLength);
        let yOver = this.minHeight - Math.abs(yLength);

        if (xLength === 0 || yLength === 0) {
            x = marker.position.x;
            y = marker.position.y;

            return PointPool.instance.borrow(x, y);
        }

        if (this.keepAspect) {
            if (xOver > 0 && (yOver / this.aspectRatio) > 0) {
                if (xOver > (yOver / this.aspectRatio)) {
                    if (xLength < 0) {
                        x -= xOver;

                        if (yLength < 0) {
                            y -= xOver * this.aspectRatio;
                        } else {
                            y += xOver * this.aspectRatio;
                        }
                    } else {
                        x += xOver;
                        if (yLength < 0) {
                            y -= xOver * this.aspectRatio;
                        } else {
                            y += xOver * this.aspectRatio;
                        }
                    }
                } else {
                    if (yLength < 0) {
                        y -= yOver;

                        if (xLength < 0) {
                            x -= yOver / this.aspectRatio;
                        } else {
                            x += yOver / this.aspectRatio;
                        }

                    } else {
                        y += yOver;
                        if (xLength < 0) {
                            x -= yOver / this.aspectRatio;
                        } else {
                            x += yOver / this.aspectRatio;
                        }
                    }
                }
            } else {
                if (xOver > 0) {
                    if (xLength < 0) {
                        x -= xOver;
                        if (yLength < 0) {
                            y -= xOver * this.aspectRatio;
                        } else {
                            y += xOver * this.aspectRatio;
                        }
                    } else {
                        x += xOver;
                        if (yLength < 0) {
                            y -= xOver * this.aspectRatio;
                        } else {
                            y += xOver * this.aspectRatio;
                        }
                    }
                } else {
                    if (yOver > 0) {
                        if (yLength < 0) {
                            y -= yOver;

                            if (xLength < 0) {
                                x -= yOver / this.aspectRatio;
                            } else {
                                x += yOver / this.aspectRatio;
                            }
                        } else {
                            y += yOver;
                            if (xLength < 0) {
                                x -= yOver / this.aspectRatio;
                            } else {
                                x += yOver / this.aspectRatio;
                            }
                        }
                    }
                }
            }
        } else {
            if (xOver > 0) {
                if (xLength < 0) {
                    x -= xOver;
                } else {
                    x += xOver;
                }
            }
            if (yOver > 0) {
                if (yLength < 0) {
                    y -= yOver;
                } else {
                    y += yOver;
                }
            }
        }

        if (x < this.minXClamp || x > this.maxXClamp || y < this.minYClamp || y > this.maxYClamp) {
            x = marker.position.x;
            y = marker.position.y;
        }

        return PointPool.instance.borrow(x, y);
    }

    public dragCorner(x:number, y:number, marker:CornerMarker) {
        let iX:number = 0;
        let iY:number = 0;
        let ax:number = 0;
        let ay:number = 0;
        let newHeight:number = 0;
        let newWidth:number = 0;
        let newY:number = 0;
        let newX:number = 0;
        let anchorMarker:CornerMarker;
        let fold:number = 0;

        if (this.keepAspect) {
            anchorMarker = marker.getHorizontalNeighbour().getVerticalNeighbour();
            ax = anchorMarker.position.x;
            ay = anchorMarker.position.y;
            if (x <= anchorMarker.position.x) {
                if (y <= anchorMarker.position.y) {
                    iX = ax - (100 / this.aspectRatio);
                    iY = ay - (100 / this.aspectRatio * this.aspectRatio);
                    fold = this.getSide(PointPool.instance.borrow(iX, iY), anchorMarker.position,
                        PointPool.instance.borrow(x, y));
                    if (fold > 0) {
                        newHeight = Math.abs(anchorMarker.position.y - y);
                        newWidth = newHeight / this.aspectRatio;
                        newY = anchorMarker.position.y - newHeight;
                        newX = anchorMarker.position.x - newWidth;
                        let min = this.enforceMinSize(newX, newY, marker);
                        marker.move(min.x, min.y);
                        PointPool.instance.returnPoint(min);
                    } else {
                        if (fold < 0) {
                            newWidth = Math.abs(anchorMarker.position.x - x);
                            newHeight = newWidth * this.aspectRatio;
                            newY = anchorMarker.position.y - newHeight;
                            newX = anchorMarker.position.x - newWidth;
                            let min = this.enforceMinSize(newX, newY, marker);
                            marker.move(min.x, min.y);
                            PointPool.instance.returnPoint(min);
                        }
                    }
                } else {
                    iX = ax - (100 / this.aspectRatio);
                    iY = ay + (100 / this.aspectRatio * this.aspectRatio);
                    fold = this.getSide(PointPool.instance.borrow(iX, iY), anchorMarker.position,
                        PointPool.instance.borrow(x, y));
                    if (fold > 0) {
                        newWidth = Math.abs(anchorMarker.position.x - x);
                        newHeight = newWidth * this.aspectRatio;
                        newY = anchorMarker.position.y + newHeight;
                        newX = anchorMarker.position.x - newWidth;
                        let min = this.enforceMinSize(newX, newY, marker);
                        marker.move(min.x, min.y);
                        PointPool.instance.returnPoint(min);
                    } else {
                        if (fold < 0) {
                            newHeight = Math.abs(anchorMarker.position.y - y);
                            newWidth = newHeight / this.aspectRatio;
                            newY = anchorMarker.position.y + newHeight;
                            newX = anchorMarker.position.x - newWidth;
                            let min = this.enforceMinSize(newX, newY, marker);
                            marker.move(min.x, min.y);
                            PointPool.instance.returnPoint(min);
                        }
                    }
                }
            } else {
                if (y <= anchorMarker.position.y) {
                    iX = ax + (100 / this.aspectRatio);
                    iY = ay - (100 / this.aspectRatio * this.aspectRatio);
                    fold = this.getSide(PointPool.instance.borrow(iX, iY), anchorMarker.position,
                        PointPool.instance.borrow(x, y));
                    if (fold < 0) {
                        newHeight = Math.abs(anchorMarker.position.y - y);
                        newWidth = newHeight / this.aspectRatio;
                        newY = anchorMarker.position.y - newHeight;
                        newX = anchorMarker.position.x + newWidth;
                        let min = this.enforceMinSize(newX, newY, marker);
                        marker.move(min.x, min.y);
                        PointPool.instance.returnPoint(min);
                    } else {
                        if (fold > 0) {
                            newWidth = Math.abs(anchorMarker.position.x - x);
                            newHeight = newWidth * this.aspectRatio;
                            newY = anchorMarker.position.y - newHeight;
                            newX = anchorMarker.position.x + newWidth;
                            let min = this.enforceMinSize(newX, newY, marker);
                            marker.move(min.x, min.y);
                            PointPool.instance.returnPoint(min);
                        }
                    }
                } else {
                    iX = ax + (100 / this.aspectRatio);
                    iY = ay + (100 / this.aspectRatio * this.aspectRatio);
                    fold = this.getSide(PointPool.instance.borrow(iX, iY), anchorMarker.position,
                        PointPool.instance.borrow(x, y));
                    if (fold < 0) {
                        newWidth = Math.abs(anchorMarker.position.x - x);
                        newHeight = newWidth * this.aspectRatio;
                        newY = anchorMarker.position.y + newHeight;
                        newX = anchorMarker.position.x + newWidth;
                        let min = this.enforceMinSize(newX, newY, marker);
                        marker.move(min.x, min.y);
                        PointPool.instance.returnPoint(min);
                    } else {
                        if (fold > 0) {
                            newHeight = Math.abs(anchorMarker.position.y - y);
                            newWidth = newHeight / this.aspectRatio;
                            newY = anchorMarker.position.y + newHeight;
                            newX = anchorMarker.position.x + newWidth;
                            let min = this.enforceMinSize(newX, newY, marker);
                            marker.move(min.x, min.y);
                            PointPool.instance.returnPoint(min);
                        }
                    }
                }
            }
        } else {
            let min = this.enforceMinSize(x, y, marker);
            marker.move(min.x, min.y);
            PointPool.instance.returnPoint(min);
        }
        this.center.recalculatePosition(this.getBounds());
    }

    public getSide(a:Point, b:Point, c:Point):number {
        let n:number = ImageCropper.sign((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x));

        // TODO move the return of the pools to outside of this function
        PointPool.instance.returnPoint(a);
        PointPool.instance.returnPoint(c);
        return n;
    }

    public handleRelease(newCropTouch:CropTouch) {

        if (newCropTouch == null) {
            return;
        }
        let index = 0;
        for (let k = 0; k < this.currentDragTouches.length; k++) {
            if (newCropTouch.id === this.currentDragTouches[k].id) {
                this.currentDragTouches[k].dragHandle.setDrag(false);
                index = k;
            }
        }
        this.currentDragTouches.splice(index, 1);
        this.draw(this.ctx);
    }

    public handleMove(newCropTouch:CropTouch) {
        let matched = false;
        for (let k = 0; k < this.currentDragTouches.length; k++) {
            if (newCropTouch.id === this.currentDragTouches[k].id && this.currentDragTouches[k].dragHandle != null) {
                let dragTouch:CropTouch = this.currentDragTouches[k];
                let clampedPositions = this.clampPosition(newCropTouch.x - dragTouch.dragHandle.offset.x,
                    newCropTouch.y - dragTouch.dragHandle.offset.y);
                newCropTouch.x = clampedPositions.x;
                newCropTouch.y = clampedPositions.y;
                PointPool.instance.returnPoint(clampedPositions);
                if (dragTouch.dragHandle instanceof CornerMarker) {
                    this.dragCorner(newCropTouch.x, newCropTouch.y, (dragTouch.dragHandle as CornerMarker));
                } else {
                    this.dragCenter(newCropTouch.x, newCropTouch.y, (dragTouch.dragHandle as DragMarker));
                }
                this.currentlyInteracting = true;
                matched = true;
                ImageCropperDataShare.setPressed(this.canvas);
                break;
            }
        }
        if (!matched) {
            for (let i = 0; i < this.markers.length; i++) {
                let marker:ICornerMarker = this.markers[i];
                if (marker.touchInBounds(newCropTouch.x, newCropTouch.y)) {
                    newCropTouch.dragHandle = marker;
                    this.currentDragTouches.push(newCropTouch);
                    marker.setDrag(true);
                    newCropTouch.dragHandle.offset.x = newCropTouch.x - newCropTouch.dragHandle.position.x;
                    newCropTouch.dragHandle.offset.y = newCropTouch.y - newCropTouch.dragHandle.position.y;
                    this.dragCorner(newCropTouch.x - newCropTouch.dragHandle.offset.x,
                        newCropTouch.y - newCropTouch.dragHandle.offset.y, (newCropTouch.dragHandle as CornerMarker));
                    break;
                }
            }
            if (newCropTouch.dragHandle === null || typeof newCropTouch.dragHandle === 'undefined') {
                if (this.center.touchInBounds(newCropTouch.x, newCropTouch.y)) {
                    newCropTouch.dragHandle = this.center;
                    this.currentDragTouches.push(newCropTouch);
                    newCropTouch.dragHandle.setDrag(true);
                    newCropTouch.dragHandle.offset.x = newCropTouch.x - newCropTouch.dragHandle.position.x;
                    newCropTouch.dragHandle.offset.y = newCropTouch.y - newCropTouch.dragHandle.position.y;
                    this.dragCenter(newCropTouch.x - newCropTouch.dragHandle.offset.x,
                        newCropTouch.y - newCropTouch.dragHandle.offset.y, (newCropTouch.dragHandle as DragMarker));
                }
            }
        }
    }

    public updateClampBounds() {
        let sourceAspect = this.srcImage.height / this.srcImage.width;
        let canvasAspect = this.canvas.height / this.canvas.width;
        let w = this.canvas.width;
        let h = this.canvas.height;
        if (canvasAspect > sourceAspect) {
            w = this.canvas.width;
            h = this.canvas.width * sourceAspect;
        } else {
            h = this.canvas.height;
            w = this.canvas.height / sourceAspect;
        }
        this.minXClamp = this.canvas.width / 2 - w / 2;
        this.minYClamp = this.canvas.height / 2 - h / 2;
        this.maxXClamp = this.canvas.width / 2 + w / 2;
        this.maxYClamp = this.canvas.height / 2 + h / 2;
    }

    public getCropBounds() {
        let bounds = this.getBounds();
        bounds.top = Math.round(( bounds.top - this.minYClamp) / this.ratioH);
        bounds.bottom = Math.round(( bounds.bottom - this.minYClamp) / this.ratioH);
        bounds.left = Math.round((bounds.left - this.minXClamp) / this.ratioW);
        bounds.right = Math.round((bounds.right - this.minXClamp) / this.ratioW);
        return bounds;
    }

    public clampPosition(x:number, y:number) {
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

    public isImageSet() {
        return this.imageSet;
    }

    public setImage(img:any) {
        this.srcImage = img;
        if (!img) {
            this.imageSet = false;
            this.draw(this.ctx);
        } else {
            this.imageSet = true;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            let bufferContext = <CanvasRenderingContext2D> this.buffer.getContext('2d');
            bufferContext.clearRect(0, 0, this.buffer.width, this.buffer.height);

            if (!this.cropperSettings.fileType)
                this.fileType = this.getDataUriMimeType(img.src);

            if (this.cropperSettings.minWithRelativeToResolution) {
                this.minWidth = (this.canvas.width * this.cropperSettings.minWidth / this.srcImage.width);
                this.minHeight = (this.canvas.height * this.cropperSettings.minHeight / this.srcImage.height);
            }

            this.updateClampBounds();
            this.canvasWidth = this.canvas.width;
            this.canvasHeight = this.canvas.height;

            let cropPosition:Point[] = this.getCropPositionFromMarkers();
            this.setCropPosition(cropPosition);
        }
    }

    public updateCropPosition(cropBounds:Bounds):void {
        let cropPosition:Point[] = this.getCropPositionFromBounds(cropBounds);
        this.setCropPosition(cropPosition);
    }

    private setCropPosition(cropPosition:Point[]):void {
        this.tl.setPosition(cropPosition[0].x, cropPosition[0].y);
        this.tr.setPosition(cropPosition[1].x, cropPosition[1].y);
        this.bl.setPosition(cropPosition[2].x, cropPosition[2].y);
        this.br.setPosition(cropPosition[3].x, cropPosition[3].y);
        this.center.setPosition(cropPosition[4].x, cropPosition[4].y);

        for (let position of cropPosition) {
            PointPool.instance.returnPoint(position);
        }

        this.vertSquashRatio = ImageCropper.detectVerticalSquash(this.srcImage);
        this.draw(this.ctx);
        this.croppedImage = this.getCroppedImageHelper(false, this.cropWidth, this.cropHeight);
    }

    private getCropPositionFromMarkers():Point[] {
        let w:number = this.canvas.width;
        let h:number = this.canvas.height;
        let tlPos:Point, trPos:Point, blPos:Point, brPos:Point, center:Point;
        let sourceAspect:number = this.srcImage.height / this.srcImage.width;
        let cropBounds:Bounds = this.getBounds();
        let cropAspect:number = cropBounds.height / cropBounds.width;
        let cX:number = this.canvas.width / 2;
        let cY:number = this.canvas.height / 2;

        if (cropAspect > sourceAspect) {
            let imageH = Math.min(w * sourceAspect, h);
            let cropW = imageH / cropAspect;
            tlPos = PointPool.instance.borrow(cX - cropW / 2, cY + imageH / 2);
            trPos = PointPool.instance.borrow(cX + cropW / 2, cY + imageH / 2);
            blPos = PointPool.instance.borrow(cX - cropW / 2, cY - imageH / 2);
            brPos = PointPool.instance.borrow(cX + cropW / 2, cY - imageH / 2);
        } else {
            let imageW = Math.min(h / sourceAspect, w);
            let cropH = imageW * cropAspect;
            tlPos = PointPool.instance.borrow(cX - imageW / 2, cY + cropH / 2);
            trPos = PointPool.instance.borrow(cX + imageW / 2, cY + cropH / 2);
            blPos = PointPool.instance.borrow(cX - imageW / 2, cY - cropH / 2);
            brPos = PointPool.instance.borrow(cX + imageW / 2, cY - cropH / 2);
        }

        center = PointPool.instance.borrow(cX, cY);
        let positions:Point[] = [tlPos, trPos, blPos, brPos, center];
        return positions;
    }

    private getCropPositionFromBounds(cropPosition:Bounds):Point[] {
        let marginTop = 0;
        let marginLeft = 0;
        let canvasAspect:number = this.canvasHeight / this.canvasWidth;
        let sourceAspect:number = this.srcImage.height / this.srcImage.width;

        if (canvasAspect > sourceAspect) {
            marginTop = this.buffer.height / 2 - (this.canvasWidth * sourceAspect) / 2;
        } else {
            marginLeft = this.buffer.width / 2 - (this.canvasHeight / sourceAspect) / 2;
        }

        let ratioW:number = (this.canvasWidth - marginLeft * 2) / this.srcImage.width;
        let ratioH:number = (this.canvasHeight - marginTop * 2) / this.srcImage.height;

        let actualH:number = cropPosition.height * ratioH;
        let actualW:number = cropPosition.width * ratioW;
        let actualX:number = cropPosition.left * ratioW + marginLeft;
        let actualY:number = cropPosition.top * ratioH + marginTop;

        if (this.keepAspect) {
            let scaledW:number = actualH / this.aspectRatio;
            let scaledH:number = actualW * this.aspectRatio;

            if (this.getCropBounds().height === cropPosition.height) { // only width changed
                actualH = scaledH;
            } else if (this.getCropBounds().width === cropPosition.width) { // only height changed
                actualW = scaledW;
            } else { // height and width changed
                if (Math.abs(scaledH - actualH) < Math.abs(scaledW - actualW)) {
                    actualW = scaledW;
                } else {
                    actualH = scaledH;
                }
            }
        }

        let tlPos:Point = PointPool.instance.borrow(actualX, actualY + actualH);
        let trPos:Point = PointPool.instance.borrow(actualX + actualW, actualY + actualH);
        let blPos:Point = PointPool.instance.borrow(actualX, actualY);
        let brPos:Point = PointPool.instance.borrow(actualX + actualW, actualY);
        let center:Point = PointPool.instance.borrow(actualX + actualW / 2, actualY + actualH / 2);

        let positions:Point[] = [tlPos, trPos, blPos, brPos, center];
        return positions;
    }

    public getCroppedImageHelper(preserveSize?:boolean, fillWidth?:number, fillHeight?:number):HTMLImageElement {
        if (this.cropperSettings.cropOnResize) {
            return this.getCroppedImage(preserveSize, fillWidth, fillHeight);
        }
        return this.croppedImage? this.croppedImage : document.createElement('img');
    }

    // todo: Unused parameters?
    public getCroppedImage(preserveSize?:boolean, fillWidth?:number, fillHeight?:number):HTMLImageElement {
        let bounds:Bounds = this.getBounds();
        if (!this.srcImage) {
            return document.createElement('img');
        } else {
            let sourceAspect:number = this.srcImage.height / this.srcImage.width;
            let canvasAspect:number = this.canvas.height / this.canvas.width;
            let w:number = this.canvas.width;
            let h:number = this.canvas.height;
            if (canvasAspect > sourceAspect) {
                w = this.canvas.width;
                h = this.canvas.width * sourceAspect;
            } else {
                if (canvasAspect < sourceAspect) {
                    h = this.canvas.height;
                    w = this.canvas.height / sourceAspect;
                } else {
                    h = this.canvas.height;
                    w = this.canvas.width;
                }
            }
            this.ratioW = w / this.srcImage.width;
            this.ratioH = h / this.srcImage.height;
            let offsetH:number = (this.buffer.height - h) / 2 / this.ratioH;
            let offsetW:number = (this.buffer.width - w) / 2 / this.ratioW;

            let ctx = <CanvasRenderingContext2D> this.cropCanvas.getContext('2d');


            if (this.cropperSettings.preserveSize || preserveSize) {
                var width = Math.round(bounds.right/this.ratioW - bounds.left/this.ratioW);
                var height = Math.round(bounds.bottom/this.ratioH - bounds.top/this.ratioH);

                this.cropCanvas.width = width;
                this.cropCanvas.height = height;

                this.cropperSettings.croppedWidth = this.cropCanvas.width;
                this.cropperSettings.croppedHeight = this.cropCanvas.height;
            } else {
                this.cropCanvas.width = this.cropWidth;
                this.cropCanvas.height = this.cropHeight;
            }

            ctx.clearRect(0, 0, this.cropCanvas.width, this.cropCanvas.height);
            this.drawImageIOSFix(ctx, this.srcImage,
                Math.max(Math.round((bounds.left) / this.ratioW - offsetW), 0),
                Math.max(Math.round(bounds.top / this.ratioH - offsetH), 0),
                Math.max(Math.round(bounds.width / this.ratioW), 1), Math.max(Math.round(bounds.height / this.ratioH), 1),
                0, 0, this.cropCanvas.width, this.cropCanvas.height
            );

            if (this.cropperSettings.resampleFn) {
                this.cropperSettings.resampleFn(this.cropCanvas);
            }

            this.croppedImage.width = this.cropCanvas.width;
            this.croppedImage.height = this.cropCanvas.height;
            this.croppedImage.src = this.cropCanvas.toDataURL(this.fileType, this.cropperSettings.compressRatio);
            return this.croppedImage;
        }
    }

    public getBounds():Bounds {
        let minX = Number.MAX_VALUE;
        let minY = Number.MAX_VALUE;
        let maxX = -Number.MAX_VALUE;
        let maxY = -Number.MAX_VALUE;
        for (let i = 0; i < this.markers.length; i++) {
            let marker = this.markers[i];
            if (marker.position.x < minX) {
                minX = marker.position.x;
            }
            if (marker.position.x > maxX) {
                maxX = marker.position.x;
            }
            if (marker.position.y < minY) {
                minY = marker.position.y;
            }
            if (marker.position.y > maxY) {
                maxY = marker.position.y;
            }
        }
        let bounds:Bounds = new Bounds();
        bounds.left = minX;
        bounds.right = maxX;
        bounds.top = minY;
        bounds.bottom = maxY;
        return bounds;
    }

    public setBounds(bounds:any) {

        let topLeft:CornerMarker;
        let topRight:CornerMarker;
        let bottomLeft:CornerMarker;
        let bottomRight:CornerMarker;

        let currentBounds = this.getBounds();
        for (let i = 0; i < this.markers.length; i++) {
            let marker = this.markers[i];

            if (marker.position.x === currentBounds.left) {
                if (marker.position.y === currentBounds.top) {
                    marker.setPosition(bounds.left, bounds.top);
                } else {
                    marker.setPosition(bounds.left, bounds.bottom);
                }
            } else {
                if (marker.position.y === currentBounds.top) {
                    marker.setPosition(bounds.right, bounds.top);
                } else {
                    marker.setPosition(bounds.right, bounds.bottom);
                }
            }
        }

        this.center.recalculatePosition(bounds);
        this.center.draw(this.ctx);
        this.draw(this.ctx); // we need to redraw all canvas if we have changed bounds
    }

    public onTouchMove(event:TouchEvent) {
        if (this.crop.isImageSet()) {
            event.preventDefault();
            if (event.touches.length === 1) {
                for (let i = 0; i < event.touches.length; i++) {
                    let touch = event.touches[i];
                    let touchPosition = ImageCropper.getTouchPos(this.canvas, touch);
                    let cropTouch = new CropTouch(touchPosition.x, touchPosition.y, touch.identifier);
                    PointPool.instance.returnPoint(touchPosition);
                    this.move(cropTouch);
                }
            } else {
                if (event.touches.length === 2) {

                    const distance = ((event.touches[0].clientX - event.touches[1].clientX) * (event.touches[0].clientX - event.touches[1].clientX)) + ((event.touches[0].clientY - event.touches[1].clientY) * (event.touches[0].clientY - event.touches[1].clientY));
                    if (this.previousDistance && this.previousDistance !== distance) {
                        let bounds = this.getBounds();

                        if (distance < this.previousDistance) {
                            bounds.top += 1;
                            bounds.left += 1;
                            bounds.right -= 1;
                            bounds.bottom -= 1;
                        }

                        if (distance > this.previousDistance) {
                            if (bounds.top !== this.minYClamp && bounds.bottom !== this.maxYClamp && bounds.left !== this.minXClamp && bounds.right !== this.maxXClamp) { // none
                                bounds.top -= 1;
                                bounds.left -= 1;
                                bounds.right += 1;
                                bounds.bottom += 1;
                            } else if (bounds.top !== this.minYClamp && bounds.bottom !== this.maxYClamp && bounds.left === this.minXClamp && bounds.right !== this.maxXClamp) { // left
                                bounds.top -= 1;
                                bounds.right += 2;
                                bounds.bottom += 1;
                            } else if (bounds.top !== this.minYClamp && bounds.bottom !== this.maxYClamp && bounds.left !== this.minXClamp && bounds.right === this.maxXClamp) { // right
                                bounds.top -= 1;
                                bounds.left -= 2;
                                bounds.bottom += 1;
                            } else if (bounds.top === this.minYClamp && bounds.bottom !== this.maxYClamp && bounds.left !== this.minXClamp && bounds.right !== this.maxXClamp) { // top
                                bounds.left -= 1;
                                bounds.right += 1;
                                bounds.bottom += 2;
                            } else if (bounds.top !== this.minYClamp && bounds.bottom === this.maxYClamp && bounds.left !== this.minXClamp && bounds.right !== this.maxXClamp) { // bottom
                                bounds.top -= 2;
                                bounds.left -= 1;
                                bounds.right += 1;
                            } else if (bounds.top === this.minYClamp && bounds.bottom !== this.maxYClamp && bounds.left === this.minXClamp && bounds.right !== this.maxXClamp) { // top left
                                bounds.right += 2;
                                bounds.bottom += 2;
                            } else if (bounds.top === this.minYClamp && bounds.bottom !== this.maxYClamp && bounds.left !== this.minXClamp && bounds.right === this.maxXClamp) { // top right
                                bounds.left -= 2;
                                bounds.bottom += 2;
                            } else if (bounds.top !== this.minYClamp && bounds.bottom === this.maxYClamp && bounds.left === this.minXClamp && bounds.right !== this.maxXClamp) { // bottom left
                                bounds.top -= 2;
                                bounds.right += 2;
                            } else if (bounds.top !== this.minYClamp && bounds.bottom === this.maxYClamp && bounds.left !== this.minXClamp && bounds.right === this.maxXClamp) { // bottom right
                                bounds.top -= 2;
                                bounds.left -= 2;
                            }
                        }

                        if (bounds.top < this.minYClamp) bounds.top = this.minYClamp;
                        if (bounds.bottom > this.maxYClamp) bounds.bottom = this.maxYClamp;
                        if (bounds.left < this.minXClamp) bounds.left = this.minXClamp;
                        if (bounds.right > this.maxXClamp) bounds.right = this.maxXClamp;

                        this.setBounds(bounds);
                    }
                    this.previousDistance = distance;
                }
            }
            this.draw(this.ctx);
        }
    }

    public onMouseMove(e:MouseEvent) {

        if (this.crop.isImageSet() && this.isMouseDown) {
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

    public move(cropTouch:CropTouch) {
        if (this.isMouseDown) {
            this.handleMove(cropTouch);
        }
    }

    public getDragTouchForID(id:any):CropTouch | undefined {
        for (let i = 0; i < this.currentDragTouches.length; i++) {
            if (id === this.currentDragTouches[i].id) {
                return this.currentDragTouches[i];
            }
        }
        return undefined;
    }

    public drawCursors(cropTouch:CropTouch) {
        let cursorDrawn = false;
        if (cropTouch != null) {
            if (cropTouch.dragHandle === this.center) {
                ImageCropperDataShare.setStyle(this.canvas, 'move');
                cursorDrawn = true;
            }
            if (cropTouch.dragHandle !== null && cropTouch.dragHandle instanceof CornerMarker) {

                this.drawCornerCursor(cropTouch.dragHandle, cropTouch.dragHandle.position.x,
                    cropTouch.dragHandle.position.y);
                cursorDrawn = true;
            }
        }
        let didDraw = false;
        if (!cursorDrawn) {
            for (let i = 0; i < this.markers.length; i++) {
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
        } else {
            this.center.setOver(false);
        }
    }

    public drawCornerCursor(marker:any, x:number, y:number) {
        if (marker.touchInBounds(x, y)) {
            marker.setOver(true);
            if (marker.getHorizontalNeighbour().position.x > marker.position.x) {
                if (marker.getVerticalNeighbour().position.y > marker.position.y) {
                    ImageCropperDataShare.setOver(this.canvas);
                    ImageCropperDataShare.setStyle(this.canvas, 'nwse-resize');
                } else {
                    ImageCropperDataShare.setOver(this.canvas);
                    ImageCropperDataShare.setStyle(this.canvas, 'nesw-resize');
                }
            } else {
                if (marker.getVerticalNeighbour().position.y > marker.position.y) {
                    ImageCropperDataShare.setOver(this.canvas);
                    ImageCropperDataShare.setStyle(this.canvas, 'nesw-resize');
                } else {
                    ImageCropperDataShare.setOver(this.canvas);
                    ImageCropperDataShare.setStyle(this.canvas, 'nwse-resize');
                }
            }
            return true;
        }
        marker.setOver(false);
        return false;
    }

    // todo: Unused param
    public onTouchStart(event:TouchEvent) {
        if (this.crop.isImageSet()) {
            this.isMouseDown = true;
        }
    }

    public onTouchEnd(event:TouchEvent) {
        if (this.crop.isImageSet()) {
            for (let i = 0; i < event.changedTouches.length; i++) {
                let touch = event.changedTouches[i];
                let dragTouch = this.getDragTouchForID(touch.identifier);
                if (dragTouch && dragTouch !== undefined) {
                    if (dragTouch.dragHandle instanceof CornerMarker || dragTouch.dragHandle instanceof DragMarker) {
                        dragTouch.dragHandle.setOver(false);
                    }
                    this.handleRelease(dragTouch);
                }
            }

            if (this.currentDragTouches.length === 0) {
                this.isMouseDown = false;
                this.currentlyInteracting = false;
            }
        }
    }

    // http://stackoverflow.com/questions/11929099/html5-canvas-drawimage-ratio-bug-ios
    public drawImageIOSFix(ctx:CanvasRenderingContext2D, img:HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
                           sx:number, sy:number, sw:number, sh:number, dx:number, dy:number, dw:number,
                           dh:number) {

        // Works only if whole image is displayed:
        // ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
        // The following works correct also when only a part of the image is displayed:
        // ctx.drawImage(img, sx * this.vertSquashRatio, sy * this.vertSquashRatio, sw * this.vertSquashRatio, sh *
        // this.vertSquashRatio, dx, dy, dw, dh);
        ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
    }

    public onMouseDown(event:MouseEvent) {
        if (this.crop.isImageSet()) {
            this.isMouseDown = true;
        }
    }

    public onMouseUp(event:MouseEvent) {
        if (this.crop.isImageSet()) {
            ImageCropperDataShare.setReleased(this.canvas);
            this.isMouseDown = false;
            this.handleRelease(new CropTouch(0, 0, 0));
        }
    }
}
