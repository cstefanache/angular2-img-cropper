var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
System.register("src/model/point", [], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Point;
    return {
        setters:[],
        execute: function() {
            Point = (function () {
                function Point(x, y) {
                    this.x = x;
                    this.y = y;
                }
                Point.prototype.getNext = function () { return this._next; };
                Point.prototype.setNext = function (p) { this._next = p; };
                Point.prototype.getPrev = function () { return this._prev; };
                Point.prototype.setPrev = function (p) { this._prev = p; };
                return Point;
            }());
            exports_1("Point", Point);
        }
    }
});
System.register("src/model/pointPool", ["src/model/point"], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var point_1;
    var PointPool;
    return {
        setters:[
            function (point_1_1) {
                point_1 = point_1_1;
            }],
        execute: function() {
            PointPool = (function () {
                function PointPool(initialSize) {
                    PointPool._instance = this;
                    var prev = null;
                    for (var i = 0; i < initialSize; i++) {
                        if (i === 0) {
                            this.firstAvailable = new point_1.Point();
                            prev = this.firstAvailable;
                        }
                        else {
                            var p = new point_1.Point();
                            prev.setNext(p);
                            prev = p;
                        }
                    }
                }
                Object.defineProperty(PointPool, "instance", {
                    get: function () {
                        return PointPool._instance;
                    },
                    enumerable: true,
                    configurable: true
                });
                PointPool.prototype.borrow = function (x, y) {
                    if (this.firstAvailable == null) {
                        throw "Pool exhausted";
                    }
                    this.borrowed++;
                    var p = this.firstAvailable;
                    this.firstAvailable = p.getNext();
                    p.x = x;
                    p.y = y;
                    return p;
                };
                ;
                PointPool.prototype.returnPoint = function (p) {
                    this.borrowed--;
                    p.x = 0;
                    p.y = 0;
                    p.setNext(this.firstAvailable);
                    this.firstAvailable = p;
                };
                ;
                return PointPool;
            }());
            exports_2("PointPool", PointPool);
        }
    }
});
System.register("src/model/bounds", ["src/model/pointPool"], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var pointPool_1;
    var Bounds;
    return {
        setters:[
            function (pointPool_1_1) {
                pointPool_1 = pointPool_1_1;
            }],
        execute: function() {
            Bounds = (function () {
                function Bounds(x, y, width, height) {
                    if (x === void 0) {
                        x = 0;
                    }
                    if (y === void 0) {
                        y = 0;
                    }
                    if (width === void 0) {
                        width = 0;
                    }
                    if (height === void 0) {
                        height = 0;
                    }
                    this.left = x;
                    this.right = x + width;
                    this.top = y;
                    this.bottom = y + height;
                }
                Bounds.prototype.getWidth = function () {
                    return this.right - this.left;
                };
                ;
                Bounds.prototype.getHeight = function () {
                    return this.bottom - this.top;
                };
                ;
                Bounds.prototype.getCentre = function () {
                    var w = this.getWidth();
                    var h = this.getHeight();
                    return pointPool_1.PointPool.instance.borrow(this.left + (w / 2), this.top + (h / 2));
                };
                ;
                return Bounds;
            }());
            exports_3("Bounds", Bounds);
        }
    }
});
System.register("src/model/handle", ["src/model/point"], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var point_2;
    var Handle;
    return {
        setters:[
            function (point_2_1) {
                point_2 = point_2_1;
            }],
        execute: function() {
            Handle = (function () {
                function Handle(x, y, radius) {
                    this.over = false;
                    this.drag = false;
                    this.position = new point_2.Point(x, y);
                    this.offset = new point_2.Point(0, 0);
                    this.radius = radius;
                }
                Handle.prototype.setDrag = function (value) {
                    this.drag = value;
                    this.setOver(value);
                };
                ;
                Handle.prototype.draw = function (ctx) {
                };
                ;
                Handle.prototype.setOver = function (over) {
                    this.over = over;
                };
                ;
                Handle.prototype.touchInBounds = function (x, y) {
                    return (x > this.position.x - this.radius && x < this.position.x + this.radius && y > this.position.y - this.radius && y < this.position.y + this.radius);
                };
                ;
                Handle.prototype.getPosition = function () {
                    return this.position;
                };
                ;
                Handle.prototype.setPosition = function (x, y) {
                    this.position.x = x;
                    this.position.y = y;
                };
                ;
                return Handle;
            }());
            exports_4("Handle", Handle);
        }
    }
});
System.register("src/model/cornerMarker", ["src/model/handle"], function(exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var handle_1;
    var CornerMarker;
    return {
        setters:[
            function (handle_1_1) {
                handle_1 = handle_1_1;
            }],
        execute: function() {
            CornerMarker = (function (_super) {
                __extends(CornerMarker, _super);
                function CornerMarker() {
                    _super.apply(this, arguments);
                }
                CornerMarker.prototype.drawCornerBorder = function (ctx) {
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
                    ctx.lineJoin = "miter";
                    ctx.moveTo(this.position.x, this.position.y);
                    ctx.lineTo(this.position.x + (sideLength * hDirection), this.position.y);
                    ctx.lineTo(this.position.x + (sideLength * hDirection), this.position.y + (sideLength * vDirection));
                    ctx.lineTo(this.position.x, this.position.y + (sideLength * vDirection));
                    ctx.lineTo(this.position.x, this.position.y);
                    ctx.closePath();
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = 'rgba(255,228,0,1)';
                    ctx.stroke();
                };
                ;
                CornerMarker.prototype.drawCornerFill = function (ctx) {
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
                    ctx.moveTo(this.position.x, this.position.y);
                    ctx.lineTo(this.position.x + (sideLength * hDirection), this.position.y);
                    ctx.lineTo(this.position.x + (sideLength * hDirection), this.position.y + (sideLength * vDirection));
                    ctx.lineTo(this.position.x, this.position.y + (sideLength * vDirection));
                    ctx.lineTo(this.position.x, this.position.y);
                    ctx.closePath();
                    ctx.fillStyle = 'rgba(0,0,0,1)';
                    ctx.fill();
                };
                CornerMarker.prototype.moveX = function (x) {
                    this.setPosition(x, this.position.y);
                };
                ;
                CornerMarker.prototype.moveY = function (y) {
                    this.setPosition(this.position.x, y);
                };
                ;
                CornerMarker.prototype.move = function (x, y) {
                    this.setPosition(x, y);
                    this.verticalNeighbour.moveX(x);
                    this.horizontalNeighbour.moveY(y);
                };
                ;
                CornerMarker.prototype.addHorizontalNeighbour = function (neighbour) {
                    this.horizontalNeighbour = neighbour;
                };
                ;
                CornerMarker.prototype.addVerticalNeighbour = function (neighbour) {
                    this.verticalNeighbour = neighbour;
                };
                ;
                CornerMarker.prototype.getHorizontalNeighbour = function () {
                    return this.horizontalNeighbour;
                };
                ;
                CornerMarker.prototype.getVerticalNeighbour = function () {
                    return this.verticalNeighbour;
                };
                ;
                CornerMarker.prototype.draw = function (ctx) {
                    this.drawCornerFill(ctx);
                    this.drawCornerBorder(ctx);
                };
                ;
                return CornerMarker;
            }(handle_1.Handle));
            exports_5("CornerMarker", CornerMarker);
        }
    }
});
System.register("src/model/dragMarker", ["src/model/handle", "src/model/pointPool"], function(exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var handle_2, pointPool_2;
    var DragMarker;
    return {
        setters:[
            function (handle_2_1) {
                handle_2 = handle_2_1;
            },
            function (pointPool_2_1) {
                pointPool_2 = pointPool_2_1;
            }],
        execute: function() {
            DragMarker = (function (_super) {
                __extends(DragMarker, _super);
                function DragMarker(x, y, radius) {
                    _super.call(this, x, y, radius);
                    this.iconPoints = [];
                    this.scaledIconPoints = [];
                    this.getDragIconPoints(this.iconPoints, 1);
                    this.getDragIconPoints(this.scaledIconPoints, 1.2);
                }
                DragMarker.prototype.draw = function (ctx) {
                    if (this.over || this.drag) {
                        this.drawIcon(ctx, this.scaledIconPoints);
                    }
                    else {
                        this.drawIcon(ctx, this.iconPoints);
                    }
                };
                ;
                DragMarker.prototype.getDragIconPoints = function (arr, scale) {
                    var maxLength = 17 * scale;
                    var arrowWidth = 14 * scale;
                    var arrowLength = 8 * scale;
                    var connectorThroat = 4 * scale;
                    arr.push(pointPool_2.PointPool.instance.borrow(-connectorThroat / 2, maxLength - arrowLength));
                    arr.push(pointPool_2.PointPool.instance.borrow(-arrowWidth / 2, maxLength - arrowLength));
                    arr.push(pointPool_2.PointPool.instance.borrow(0, maxLength));
                    arr.push(pointPool_2.PointPool.instance.borrow(arrowWidth / 2, maxLength - arrowLength));
                    arr.push(pointPool_2.PointPool.instance.borrow(connectorThroat / 2, maxLength - arrowLength));
                    arr.push(pointPool_2.PointPool.instance.borrow(connectorThroat / 2, connectorThroat / 2));
                    arr.push(pointPool_2.PointPool.instance.borrow(maxLength - arrowLength, connectorThroat / 2));
                    arr.push(pointPool_2.PointPool.instance.borrow(maxLength - arrowLength, arrowWidth / 2));
                    arr.push(pointPool_2.PointPool.instance.borrow(maxLength, 0));
                    arr.push(pointPool_2.PointPool.instance.borrow(maxLength - arrowLength, -arrowWidth / 2));
                    arr.push(pointPool_2.PointPool.instance.borrow(maxLength - arrowLength, -connectorThroat / 2));
                    arr.push(pointPool_2.PointPool.instance.borrow(connectorThroat / 2, -connectorThroat / 2));
                    arr.push(pointPool_2.PointPool.instance.borrow(connectorThroat / 2, -maxLength + arrowLength));
                    arr.push(pointPool_2.PointPool.instance.borrow(arrowWidth / 2, -maxLength + arrowLength));
                    arr.push(pointPool_2.PointPool.instance.borrow(0, -maxLength));
                    arr.push(pointPool_2.PointPool.instance.borrow(-arrowWidth / 2, -maxLength + arrowLength));
                    arr.push(pointPool_2.PointPool.instance.borrow(-connectorThroat / 2, -maxLength + arrowLength));
                    arr.push(pointPool_2.PointPool.instance.borrow(-connectorThroat / 2, -connectorThroat / 2));
                    arr.push(pointPool_2.PointPool.instance.borrow(-maxLength + arrowLength, -connectorThroat / 2));
                    arr.push(pointPool_2.PointPool.instance.borrow(-maxLength + arrowLength, -arrowWidth / 2));
                    arr.push(pointPool_2.PointPool.instance.borrow(-maxLength, 0));
                    arr.push(pointPool_2.PointPool.instance.borrow(-maxLength + arrowLength, arrowWidth / 2));
                    arr.push(pointPool_2.PointPool.instance.borrow(-maxLength + arrowLength, connectorThroat / 2));
                    arr.push(pointPool_2.PointPool.instance.borrow(-connectorThroat / 2, connectorThroat / 2));
                };
                ;
                DragMarker.prototype.drawIcon = function (ctx, points) {
                    ctx.beginPath();
                    ctx.moveTo(points[0].x + this.position.x, points[0].y + this.position.y);
                    for (var k = 0; k < points.length; k++) {
                        var p = points[k];
                        ctx.lineTo(p.x + this.position.x, p.y + this.position.y);
                    }
                    ctx.closePath();
                    ctx.fillStyle = 'rgba(255,228,0,1)';
                    ctx.fill();
                };
                ;
                DragMarker.prototype.recalculatePosition = function (bounds) {
                    var c = bounds.getCentre();
                    this.setPosition(c.x, c.y);
                    pointPool_2.PointPool.instance.returnPoint(c);
                };
                ;
                return DragMarker;
            }(handle_2.Handle));
            exports_6("DragMarker", DragMarker);
        }
    }
});
System.register("src/model/cropTouch", [], function(exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var CropTouch;
    return {
        setters:[],
        execute: function() {
            CropTouch = (function () {
                function CropTouch(x, y, id) {
                    if (x === void 0) {
                        x = 0;
                    }
                    if (y === void 0) {
                        y = 0;
                    }
                    if (id === void 0) {
                        id = 0;
                    }
                    this.id = 0;
                    this.x = x;
                    this.y = y;
                    this.id = id;
                }
                return CropTouch;
            }());
            exports_7("CropTouch", CropTouch);
        }
    }
});
System.register("src/imageCropperDataShare", [], function(exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    var ImageCropperDataShare;
    return {
        setters:[],
        execute: function() {
            ImageCropperDataShare = (function () {
                function ImageCropperDataShare() {
                }
                ImageCropperDataShare.setPressed = function (canvas) {
                    this.pressed = canvas;
                };
                ;
                ImageCropperDataShare.setReleased = function (canvas) {
                    if (canvas === this.pressed) {
                        this.pressed = undefined;
                    }
                };
                ;
                ImageCropperDataShare.setOver = function (canvas) {
                    this.over = canvas;
                };
                ;
                ImageCropperDataShare.setStyle = function (canvas, style) {
                    if (this.pressed !== undefined) {
                        if (this.pressed === canvas) {
                        }
                    }
                    else {
                        if (canvas === this.over) {
                        }
                    }
                };
                ;
                ImageCropperDataShare.share = {};
                return ImageCropperDataShare;
            }());
            exports_8("ImageCropperDataShare", ImageCropperDataShare);
        }
    }
});
System.register("src/imageCropper", ['angular2/core', "src/model/pointPool", "src/model/bounds", "src/model/cornerMarker", "src/model/dragMarker", "src/model/cropTouch", "src/imageCropperDataShare"], function(exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    var core_1, pointPool_3, bounds_1, cornerMarker_1, dragMarker_1, cropTouch_1, imageCropperDataShare_1;
    var ImageCropperComponent, CropperSettings, ImageCropperModel, ImageCropper;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (pointPool_3_1) {
                pointPool_3 = pointPool_3_1;
            },
            function (bounds_1_1) {
                bounds_1 = bounds_1_1;
            },
            function (cornerMarker_1_1) {
                cornerMarker_1 = cornerMarker_1_1;
            },
            function (dragMarker_1_1) {
                dragMarker_1 = dragMarker_1_1;
            },
            function (cropTouch_1_1) {
                cropTouch_1 = cropTouch_1_1;
            },
            function (imageCropperDataShare_1_1) {
                imageCropperDataShare_1 = imageCropperDataShare_1_1;
            }],
        execute: function() {
            ImageCropperComponent = (function () {
                function ImageCropperComponent(renderer) {
                    this.renderer = renderer;
                }
                ImageCropperComponent.prototype.ngAfterViewInit = function () {
                    var canvas = this.cropcanvas.nativeElement;
                    if (!this.settings) {
                        this.settings = new CropperSettings();
                    }
                    this.renderer.setElementAttribute(canvas, 'width', this.settings.canvasWidth.toString());
                    this.renderer.setElementAttribute(canvas, 'height', this.settings.canvasHeight.toString());
                    this.cropper = new ImageCropper(canvas, 0, 0, this.settings.width, this.settings.height, this.settings.croppedWidth, this.settings.croppedHeight);
                };
                ImageCropperComponent.prototype.onMouseDown = function ($event) {
                    this.cropper.onMouseDown($event);
                };
                ImageCropperComponent.prototype.onMouseUp = function ($event) {
                    if (this.cropper.isImageSet()) {
                        this.cropper.onMouseUp($event);
                        this.image.image = this.cropper.getCroppedImage().src;
                    }
                };
                ImageCropperComponent.prototype.onMouseMove = function ($event) {
                    this.cropper.onMouseMove($event);
                };
                ImageCropperComponent.prototype.fileChangeListener = function ($event) {
                    var image = new Image();
                    var file = $event.target.files[0];
                    var myReader = new FileReader();
                    var that = this;
                    myReader.onloadend = function (loadEvent) {
                        image.src = loadEvent.target.result;
                        that.cropper.setImage(image);
                    };
                    myReader.readAsDataURL(file);
                };
                __decorate([
                    core_1.ViewChild('cropcanvas'), 
                    __metadata('design:type', core_1.ElementRef)
                ], ImageCropperComponent.prototype, "cropcanvas", void 0);
                ImageCropperComponent = __decorate([
                    core_1.Component({
                        selector: 'img-cropper',
                        template: "\n    <span class=\"ng2-imgcrop\">\n      <input type=\"file\" (change)=\"fileChangeListener($event)\">\n      <canvas #cropcanvas\n              (mousedown)=\"onMouseDown($event)\"\n              (mouseup)=\"onMouseUp($event)\"\n              (mousemove)=\"onMouseMove($event)\"\n              (touchmove)=\"onTouchMove($event)\"\n              (touchend)=\"onTouchEnd($event)\">\n      </canvas>\n    </span>\n  ",
                        inputs: ['image', 'settings']
                    }), 
                    __metadata('design:paramtypes', [core_1.Renderer])
                ], ImageCropperComponent);
                return ImageCropperComponent;
            }());
            exports_9("ImageCropperComponent", ImageCropperComponent);
            CropperSettings = (function () {
                function CropperSettings() {
                    this.canvasWidth = 300;
                    this.canvasHeight = 300;
                    this.width = 200;
                    this.height = 200;
                    this.croppedWidth = 100;
                    this.croppedHeight = 100;
                }
                return CropperSettings;
            }());
            exports_9("CropperSettings", CropperSettings);
            ImageCropperModel = (function () {
                function ImageCropperModel() {
                }
                return ImageCropperModel;
            }());
            exports_9("ImageCropperModel", ImageCropperModel);
            ImageCropper = (function (_super) {
                __extends(ImageCropper, _super);
                function ImageCropper(canvas, x, y, width, height, croppedWidth, croppedHeight, keepAspect, touchRadius, minWidth, minHeight) {
                    if (keepAspect === void 0) { keepAspect = true; }
                    if (touchRadius === void 0) { touchRadius = 50; }
                    if (minWidth === void 0) { minWidth = 50; }
                    if (minHeight === void 0) { minHeight = 50; }
                    _super.call(this);
                    this.crop = this;
                    if (x === void 0) {
                        this.x = 0;
                    }
                    if (y === void 0) {
                        this.y = 0;
                    }
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
                    this.currentDragTouches = new Array();
                    this.isMouseDown = false;
                    this.ratioW = 1;
                    this.ratioH = 1;
                    this.fileType = 'png';
                    this.imageSet = false;
                    this.pointPool = new pointPool_3.PointPool(200);
                    this.buffer = document.createElement('canvas');
                    this.cropCanvas = document.createElement('canvas');
                    this.buffer.width = canvas.width;
                    this.buffer.height = canvas.height;
                    this.tl = new cornerMarker_1.CornerMarker(x, y, touchRadius);
                    this.tr = new cornerMarker_1.CornerMarker(x + width, y, touchRadius);
                    this.bl = new cornerMarker_1.CornerMarker(x, y + height, touchRadius);
                    this.br = new cornerMarker_1.CornerMarker(x + width, y + height, touchRadius);
                    this.tl.addHorizontalNeighbour(this.tr);
                    this.tl.addVerticalNeighbour(this.bl);
                    this.tr.addHorizontalNeighbour(this.tl);
                    this.tr.addVerticalNeighbour(this.br);
                    this.bl.addHorizontalNeighbour(this.br);
                    this.bl.addVerticalNeighbour(this.tl);
                    this.br.addHorizontalNeighbour(this.bl);
                    this.br.addVerticalNeighbour(this.tr);
                    this.markers = [this.tl, this.tr, this.bl, this.br];
                    this.center = new dragMarker_1.DragMarker(x + (width / 2), y + (height / 2), touchRadius);
                    this.canvas = canvas;
                    this.ctx = this.canvas.getContext("2d");
                    this.keepAspect = keepAspect;
                    this.aspectRatio = height / width;
                    this.draw(this.ctx);
                    this.croppedImage = new Image();
                    this.currentlyInteracting = false;
                    this.cropWidth = croppedWidth;
                    this.cropHeight = croppedHeight;
                    //TODO:check
                    /*
                      CropService.init(canvas);
                        angular.element(window)
                          .off('mousemove.angular-img-cropper mouseup.angular-img-cropper touchmove.angular-img-cropper touchend.angular-img-cropper')
                          .on('mousemove.angular-img-cropper', this.onMouseMove.bind(this))
                          .on('mouseup.angular-img-cropper', this.onMouseUp.bind(this))
                          .on('touchmove.angular-img-cropper', this.onTouchMove.bind(this))
                          .on('touchend.angular-img-cropper', this.onTouchEnd.bind(this));
                
                        angular.element(canvas)
                          .off('mousedown.angular-img-cropper touchstart.angular-img-cropper')
                          .on('mousedown.angular-img-cropper', this.onMouseDown.bind(this))
                          .on('touchstart.angular-img-cropper', this.onTouchStart.bind(this));
                          */
                }
                ImageCropper.prototype.resizeCanvas = function (width, height) {
                    this.canvas.width = width;
                    this.canvas.height = height;
                    this.buffer.width = width;
                    this.buffer.height = height;
                    this.draw(this.ctx);
                };
                ;
                ImageCropper.prototype.draw = function (ctx) {
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
                        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
                        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
                        ctx.drawImage(this.buffer, bounds.left, bounds.top, Math.max(bounds.getWidth(), 1), Math.max(bounds.getHeight(), 1), bounds.left, bounds.top, bounds.getWidth(), bounds.getHeight());
                        var marker;
                        for (var i = 0; i < this.markers.length; i++) {
                            marker = this.markers[i];
                            marker.draw(ctx);
                        }
                        this.center.draw(ctx);
                        ctx.lineWidth = 2;
                        ctx.strokeStyle = 'rgba(255,228,0,1)';
                        ctx.strokeRect(bounds.left, bounds.top, bounds.getWidth(), bounds.getHeight());
                    }
                    else {
                        ctx.fillStyle = 'rgba(192,192,192,1)';
                        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                    }
                };
                ;
                ImageCropper.prototype.dragCrop = function (x, y, marker) {
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
                    /*
                    if (scope.cropAreaBounds && this.imageSet) {
                      scope.cropAreaBounds = this.getCropBounds();
                      scope.$apply();
                    }
                    */
                };
                ;
                ImageCropper.prototype.enforceMinSize = function (x, y, marker) {
                    var xLength = x - marker.getHorizontalNeighbour().getPosition().x;
                    var yLength = y - marker.getVerticalNeighbour().getPosition().y;
                    var xOver = this.minWidth - Math.abs(xLength);
                    var yOver = this.minHeight - Math.abs(yLength);
                    if (xLength == 0 || yLength == 0) {
                        x = marker.getPosition().x;
                        y = marker.getPosition().y;
                        return pointPool_3.PointPool.instance.borrow(x, y);
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
                    return pointPool_3.PointPool.instance.borrow(x, y);
                };
                ;
                ImageCropper.prototype.dragCorner = function (x, y, marker) {
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
                                fold = this.getSide(pointPool_3.PointPool.instance.borrow(iX, iY), anchorMarker.getPosition(), pointPool_3.PointPool.instance.borrow(x, y));
                                if (fold > 0) {
                                    newHeight = Math.abs(anchorMarker.getPosition().y - y);
                                    newWidth = newHeight / this.aspectRatio;
                                    newY = anchorMarker.getPosition().y - newHeight;
                                    newX = anchorMarker.getPosition().x - newWidth;
                                    var min = this.enforceMinSize(newX, newY, marker);
                                    marker.move(min.x, min.y);
                                    pointPool_3.PointPool.instance.returnPoint(min);
                                }
                                else if (fold < 0) {
                                    newWidth = Math.abs(anchorMarker.getPosition().x - x);
                                    newHeight = newWidth * this.aspectRatio;
                                    newY = anchorMarker.getPosition().y - newHeight;
                                    newX = anchorMarker.getPosition().x - newWidth;
                                    var min = this.enforceMinSize(newX, newY, marker);
                                    marker.move(min.x, min.y);
                                    pointPool_3.PointPool.instance.returnPoint(min);
                                }
                            }
                            else {
                                iX = ax - (100 / this.aspectRatio);
                                iY = ay + (100 / this.aspectRatio * this.aspectRatio);
                                fold = this.getSide(pointPool_3.PointPool.instance.borrow(iX, iY), anchorMarker.getPosition(), pointPool_3.PointPool.instance.borrow(x, y));
                                if (fold > 0) {
                                    newWidth = Math.abs(anchorMarker.getPosition().x - x);
                                    newHeight = newWidth * this.aspectRatio;
                                    newY = anchorMarker.getPosition().y + newHeight;
                                    newX = anchorMarker.getPosition().x - newWidth;
                                    var min = this.enforceMinSize(newX, newY, marker);
                                    marker.move(min.x, min.y);
                                    pointPool_3.PointPool.instance.returnPoint(min);
                                }
                                else if (fold < 0) {
                                    newHeight = Math.abs(anchorMarker.getPosition().y - y);
                                    newWidth = newHeight / this.aspectRatio;
                                    newY = anchorMarker.getPosition().y + newHeight;
                                    newX = anchorMarker.getPosition().x - newWidth;
                                    var min = this.enforceMinSize(newX, newY, marker);
                                    marker.move(min.x, min.y);
                                    pointPool_3.PointPool.instance.returnPoint(min);
                                }
                            }
                        }
                        else {
                            if (y <= anchorMarker.getPosition().y) {
                                iX = ax + (100 / this.aspectRatio);
                                iY = ay - (100 / this.aspectRatio * this.aspectRatio);
                                fold = this.getSide(pointPool_3.PointPool.instance.borrow(iX, iY), anchorMarker.getPosition(), pointPool_3.PointPool.instance.borrow(x, y));
                                if (fold < 0) {
                                    newHeight = Math.abs(anchorMarker.getPosition().y - y);
                                    newWidth = newHeight / this.aspectRatio;
                                    newY = anchorMarker.getPosition().y - newHeight;
                                    newX = anchorMarker.getPosition().x + newWidth;
                                    var min = this.enforceMinSize(newX, newY, marker);
                                    marker.move(min.x, min.y);
                                    pointPool_3.PointPool.instance.returnPoint(min);
                                }
                                else if (fold > 0) {
                                    newWidth = Math.abs(anchorMarker.getPosition().x - x);
                                    newHeight = newWidth * this.aspectRatio;
                                    newY = anchorMarker.getPosition().y - newHeight;
                                    newX = anchorMarker.getPosition().x + newWidth;
                                    var min = this.enforceMinSize(newX, newY, marker);
                                    marker.move(min.x, min.y);
                                    pointPool_3.PointPool.instance.returnPoint(min);
                                }
                            }
                            else {
                                iX = ax + (100 / this.aspectRatio);
                                iY = ay + (100 / this.aspectRatio * this.aspectRatio);
                                fold = this.getSide(pointPool_3.PointPool.instance.borrow(iX, iY), anchorMarker.getPosition(), pointPool_3.PointPool.instance.borrow(x, y));
                                if (fold < 0) {
                                    newWidth = Math.abs(anchorMarker.getPosition().x - x);
                                    newHeight = newWidth * this.aspectRatio;
                                    newY = anchorMarker.getPosition().y + newHeight;
                                    newX = anchorMarker.getPosition().x + newWidth;
                                    var min = this.enforceMinSize(newX, newY, marker);
                                    marker.move(min.x, min.y);
                                    pointPool_3.PointPool.instance.returnPoint(min);
                                }
                                else if (fold > 0) {
                                    newHeight = Math.abs(anchorMarker.getPosition().y - y);
                                    newWidth = newHeight / this.aspectRatio;
                                    newY = anchorMarker.getPosition().y + newHeight;
                                    newX = anchorMarker.getPosition().x + newWidth;
                                    var min = this.enforceMinSize(newX, newY, marker);
                                    marker.move(min.x, min.y);
                                    pointPool_3.PointPool.instance.returnPoint(min);
                                }
                            }
                        }
                    }
                    else {
                        var min = this.enforceMinSize(x, y, marker);
                        marker.move(min.x, min.y);
                        pointPool_3.PointPool.instance.returnPoint(min);
                    }
                    this.center.recalculatePosition(this.getBounds());
                    /*
                    if (scope.cropAreaBounds && this.imageSet) {
                      scope.cropAreaBounds = this.getCropBounds();
                      scope.$apply();
                    }
                    */
                };
                ;
                ImageCropper.prototype.getSide = function (a, b, c) {
                    var n = this.sign((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x));
                    //TODO move the return of the pools to outside of this function
                    pointPool_3.PointPool.instance.returnPoint(a);
                    pointPool_3.PointPool.instance.returnPoint(c);
                    return n;
                };
                ;
                ImageCropper.prototype.sign = function (x) {
                    if (+x === x) {
                        return (x === 0) ? x : (x > 0) ? 1 : -1;
                    }
                    return NaN;
                };
                ;
                ImageCropper.prototype.handleRelease = function (newCropTouch) {
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
                };
                ;
                ImageCropper.prototype.handleMove = function (newCropTouch) {
                    var matched = false;
                    for (var k = 0; k < this.currentDragTouches.length; k++) {
                        if (newCropTouch.id == this.currentDragTouches[k].id && this.currentDragTouches[k].dragHandle != null) {
                            var dragTouch = this.currentDragTouches[k];
                            var clampedPositions = this.clampPosition(newCropTouch.x - dragTouch.dragHandle.offset.x, newCropTouch.y - dragTouch.dragHandle.offset.y);
                            newCropTouch.x = clampedPositions.x;
                            newCropTouch.y = clampedPositions.y;
                            pointPool_3.PointPool.instance.returnPoint(clampedPositions);
                            if (dragTouch.dragHandle instanceof cornerMarker_1.CornerMarker) {
                                this.dragCorner(newCropTouch.x, newCropTouch.y, dragTouch.dragHandle);
                            }
                            else {
                                this.dragCrop(newCropTouch.x, newCropTouch.y, dragTouch.dragHandle);
                            }
                            this.currentlyInteracting = true;
                            matched = true;
                            imageCropperDataShare_1.ImageCropperDataShare.setPressed(this.canvas);
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
                };
                ;
                ImageCropper.prototype.updateClampBounds = function () {
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
                };
                ;
                ImageCropper.prototype.getCropBounds = function () {
                    var h = this.canvas.height - (this.minYClamp * 2);
                    var bounds = this.getBounds();
                    bounds.top = Math.round((h - bounds.top + this.minYClamp) / this.ratioH);
                    bounds.bottom = Math.round((h - bounds.bottom + this.minYClamp) / this.ratioH);
                    bounds.left = Math.round((bounds.left - this.minXClamp) / this.ratioW);
                    bounds.right = Math.round((bounds.right - this.minXClamp) / this.ratioW);
                    return bounds;
                };
                ;
                ImageCropper.prototype.clampPosition = function (x, y) {
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
                    return pointPool_3.PointPool.instance.borrow(x, y);
                };
                ;
                ImageCropper.prototype.isImageSet = function () {
                    return this.imageSet;
                };
                ;
                ImageCropper.prototype.setImage = function (img) {
                    if (!img) {
                        throw "Image is null";
                    }
                    this.imageSet = true;
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    var bufferContext = this.buffer.getContext('2d');
                    bufferContext.clearRect(0, 0, this.buffer.width, this.buffer.height);
                    /*
                        var splitName = img.src.split('.');
                        var fileType = splitName[1];
                        if (fileType == 'png' || fileType == 'jpg') {
                          this.fileType = fileType;
                        }
                    */
                    this.srcImage = img;
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
                    var tlPos = pointPool_3.PointPool.instance.borrow(cX - cropBounds.getWidth() / 2, cY + cropBounds.getHeight() / 2);
                    var trPos = pointPool_3.PointPool.instance.borrow(cX + cropBounds.getWidth() / 2, cY + cropBounds.getHeight() / 2);
                    var blPos = pointPool_3.PointPool.instance.borrow(cX - cropBounds.getWidth() / 2, cY - cropBounds.getHeight() / 2);
                    var brPos = pointPool_3.PointPool.instance.borrow(cX + cropBounds.getWidth() / 2, cY - cropBounds.getHeight() / 2);
                    this.tl.setPosition(tlPos.x, tlPos.y);
                    this.tr.setPosition(trPos.x, trPos.y);
                    this.bl.setPosition(blPos.x, blPos.y);
                    this.br.setPosition(brPos.x, brPos.y);
                    pointPool_3.PointPool.instance.returnPoint(tlPos);
                    pointPool_3.PointPool.instance.returnPoint(trPos);
                    pointPool_3.PointPool.instance.returnPoint(blPos);
                    pointPool_3.PointPool.instance.returnPoint(brPos);
                    this.center.setPosition(cX, cY);
                    if (cropAspect > sourceAspect) {
                        var imageH = Math.min(w * sourceAspect, h);
                        var cropW = imageH / cropAspect;
                        tlPos = pointPool_3.PointPool.instance.borrow(cX - cropW / 2, cY + imageH / 2);
                        trPos = pointPool_3.PointPool.instance.borrow(cX + cropW / 2, cY + imageH / 2);
                        blPos = pointPool_3.PointPool.instance.borrow(cX - cropW / 2, cY - imageH / 2);
                        brPos = pointPool_3.PointPool.instance.borrow(cX + cropW / 2, cY - imageH / 2);
                    }
                    else if (cropAspect < sourceAspect) {
                        var imageW = Math.min(h / sourceAspect, w);
                        var cropH = imageW * cropAspect;
                        tlPos = pointPool_3.PointPool.instance.borrow(cX - imageW / 2, cY + cropH / 2);
                        trPos = pointPool_3.PointPool.instance.borrow(cX + imageW / 2, cY + cropH / 2);
                        blPos = pointPool_3.PointPool.instance.borrow(cX - imageW / 2, cY - cropH / 2);
                        brPos = pointPool_3.PointPool.instance.borrow(cX + imageW / 2, cY - cropH / 2);
                    }
                    else {
                        var imageW = Math.min(h, w);
                        var cropH = imageW * cropAspect;
                        tlPos = pointPool_3.PointPool.instance.borrow(cX - imageW / 2, cY + cropH / 2);
                        trPos = pointPool_3.PointPool.instance.borrow(cX + imageW / 2, cY + cropH / 2);
                        blPos = pointPool_3.PointPool.instance.borrow(cX - imageW / 2, cY - cropH / 2);
                        brPos = pointPool_3.PointPool.instance.borrow(cX + imageW / 2, cY - cropH / 2);
                    }
                    this.tl.setPosition(tlPos.x, tlPos.y);
                    this.tr.setPosition(trPos.x, trPos.y);
                    this.bl.setPosition(blPos.x, blPos.y);
                    this.br.setPosition(brPos.x, brPos.y);
                    pointPool_3.PointPool.instance.returnPoint(tlPos);
                    pointPool_3.PointPool.instance.returnPoint(trPos);
                    pointPool_3.PointPool.instance.returnPoint(blPos);
                    pointPool_3.PointPool.instance.returnPoint(brPos);
                    //TODO: check this
                    /*
                    if (scope.cropAreaBounds
                      && scope.cropAreaBounds.left !== undefined
                      && scope.cropAreaBounds.top !== undefined
                      && scope.cropAreaBounds.right !== undefined
                      && scope.cropAreaBounds.bottom !== undefined) {
                
                      var canvasAspect = this.canvasHeight / this.canvasWidth;
                      if (canvasAspect > sourceAspect) {
                        w = this.canvasWidth;
                        h = this.canvasWidth * sourceAspect;
                      } else {
                        h = this.canvasHeight;
                        w = this.canvasHeight / sourceAspect;
                      }
                      this.ratioW = w / this.srcImage.width;
                      this.ratioH = h / this.srcImage.height;
                
                      var bounds = new Bounds();
                      bounds.top = Math.round(h + this.minYClamp - this.ratioH * scope.cropAreaBounds.top);
                      bounds.bottom = Math.round(h + this.minYClamp - this.ratioH * scope.cropAreaBounds.bottom);
                      bounds.left = Math.round(this.ratioW * scope.cropAreaBounds.left + this.minXClamp);
                      bounds.right = Math.round(this.ratioW * scope.cropAreaBounds.right + this.minXClamp);
                
                      this.tl.setPosition(bounds.left, bounds.top);
                      this.tr.setPosition(bounds.right, bounds.top);
                      this.bl.setPosition(bounds.left, bounds.bottom);
                      this.br.setPosition(bounds.right, bounds.bottom);
                
                      this.center.setPosition(bounds.left + bounds.getWidth() / 2, bounds.top + bounds.getHeight() / 2);
                    }
                    */
                    this.vertSquashRatio = this.detectVerticalSquash(this.srcImage);
                    this.draw(this.ctx);
                    //TODO: check this
                    var croppedImg = this.getCroppedImage(this.cropWidth, this.cropHeight);
                    this.croppedImage = croppedImg;
                    /*
                        if (scope.cropAreaBounds && this.imageSet) {
                          scope.cropAreaBounds = this.getCropBounds();
                        }
                        */
                };
                ;
                ImageCropper.prototype.getCroppedImage = function (fillWidth, fillHeight) {
                    var bounds = this.getBounds();
                    if (!this.srcImage) {
                        throw "Source image not set.";
                    }
                    if (fillWidth && fillHeight) {
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
                        this.cropCanvas.width = fillWidth;
                        this.cropCanvas.height = fillHeight;
                        var offsetH = (this.buffer.height - h) / 2 / this.ratioH;
                        var offsetW = (this.buffer.width - w) / 2 / this.ratioW;
                        this.drawImageIOSFix(this.cropCanvas.getContext('2d'), this.srcImage, Math.max(Math.round((bounds.left) / this.ratioW - offsetW), 0), Math.max(Math.round(bounds.top / this.ratioH - offsetH), 0), Math.max(Math.round(bounds.getWidth() / this.ratioW), 1), Math.max(Math.round(bounds.getHeight() / this.ratioH), 1), 0, 0, fillWidth, fillHeight);
                        this.croppedImage.width = fillWidth;
                        this.croppedImage.height = fillHeight;
                    }
                    else {
                        this.cropCanvas.width = Math.max(bounds.getWidth(), 1);
                        this.cropCanvas.height = Math.max(bounds.getHeight(), 1);
                        this.cropCanvas.getContext('2d').drawImage(this.buffer, bounds.left, bounds.top, Math.max(bounds.getWidth(), 1), Math.max(bounds.getHeight(), 1), 0, 0, bounds.getWidth(), bounds.getHeight());
                        this.croppedImage.width = this.cropCanvas.width;
                        this.croppedImage.height = this.cropCanvas.height;
                    }
                    this.croppedImage.src = this.cropCanvas.toDataURL("image/" + this.fileType);
                    return this.croppedImage;
                };
                ;
                ImageCropper.prototype.getBounds = function () {
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
                    var bounds = new bounds_1.Bounds();
                    bounds.left = minX;
                    bounds.right = maxX;
                    bounds.top = minY;
                    bounds.bottom = maxY;
                    return bounds;
                };
                ;
                ImageCropper.prototype.setBounds = function (bounds) {
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
                };
                ;
                ImageCropper.prototype.getMousePos = function (canvas, evt) {
                    var rect = canvas.getBoundingClientRect();
                    return pointPool_3.PointPool.instance.borrow(evt.clientX - rect.left, evt.clientY - rect.top);
                };
                ;
                ImageCropper.prototype.getTouchPos = function (canvas, touch) {
                    var rect = canvas.getBoundingClientRect();
                    return pointPool_3.PointPool.instance.borrow(touch.clientX - rect.left, touch.clientY - rect.top);
                };
                ;
                ImageCropper.prototype.onTouchMove = function (e) {
                    if (this.crop.isImageSet()) {
                        e.preventDefault();
                        if (e.touches.length >= 1) {
                            for (var i = 0; i < e.touches.length; i++) {
                                var touch = e.touches[i];
                                var touchPosition = this.getTouchPos(this.canvas, touch);
                                var cropTouch = new cropTouch_1.CropTouch(touchPosition.x, touchPosition.y, touch.identifier);
                                pointPool_3.PointPool.instance.returnPoint(touchPosition);
                                this.move(cropTouch, e);
                            }
                        }
                        this.draw(this.ctx);
                    }
                };
                ;
                ImageCropper.prototype.onMouseMove = function (e) {
                    if (this.crop.isImageSet()) {
                        var mousePosition = this.getMousePos(this.canvas, e);
                        this.move(new cropTouch_1.CropTouch(mousePosition.x, mousePosition.y, 0), e);
                        var dragTouch = this.getDragTouchForID(0);
                        if (dragTouch) {
                            dragTouch.x = mousePosition.x;
                            dragTouch.y = mousePosition.y;
                        }
                        else {
                            dragTouch = new cropTouch_1.CropTouch(mousePosition.x, mousePosition.y, 0);
                        }
                        pointPool_3.PointPool.instance.returnPoint(mousePosition);
                        this.drawCursors(dragTouch, e);
                        this.draw(this.ctx);
                    }
                };
                ;
                ImageCropper.prototype.move = function (cropTouch, e) {
                    if (this.isMouseDown) {
                        this.handleMove(cropTouch);
                    }
                };
                ;
                ImageCropper.prototype.getDragTouchForID = function (id) {
                    for (var i = 0; i < this.currentDragTouches.length; i++) {
                        if (id == this.currentDragTouches[i].id) {
                            return this.currentDragTouches[i];
                        }
                    }
                };
                ;
                ImageCropper.prototype.drawCursors = function (cropTouch, e) {
                    var cursorDrawn = false;
                    if (cropTouch != null) {
                        if (cropTouch.dragHandle == this.center) {
                            imageCropperDataShare_1.ImageCropperDataShare.setStyle(this.canvas, 'move');
                            cursorDrawn = true;
                        }
                        if (cropTouch.dragHandle != null && cropTouch.dragHandle instanceof cornerMarker_1.CornerMarker) {
                            this.drawCornerCursor(cropTouch.dragHandle, cropTouch.dragHandle.getPosition().x, cropTouch.dragHandle.getPosition().y, e);
                            cursorDrawn = true;
                        }
                    }
                    var didDraw = false;
                    if (!cursorDrawn) {
                        for (var i = 0; i < this.markers.length; i++) {
                            didDraw = didDraw || this.drawCornerCursor(this.markers[i], cropTouch.x, cropTouch.y, e);
                        }
                        if (!didDraw) {
                            imageCropperDataShare_1.ImageCropperDataShare.setStyle(this.canvas, 'initial');
                        }
                    }
                    if (!didDraw && !cursorDrawn && this.center.touchInBounds(cropTouch.x, cropTouch.y)) {
                        this.center.setOver(true);
                        imageCropperDataShare_1.ImageCropperDataShare.setOver(this.canvas);
                        imageCropperDataShare_1.ImageCropperDataShare.setStyle(this.canvas, 'move');
                    }
                    else {
                        this.center.setOver(false);
                    }
                };
                ;
                ImageCropper.prototype.drawCornerCursor = function (marker, x, y, e) {
                    if (marker.touchInBounds(x, y)) {
                        marker.setOver(true);
                        if (marker.getHorizontalNeighbour().getPosition().x > marker.getPosition().x) {
                            if (marker.getVerticalNeighbour().getPosition().y > marker.getPosition().y) {
                                imageCropperDataShare_1.ImageCropperDataShare.setOver(this.canvas);
                                imageCropperDataShare_1.ImageCropperDataShare.setStyle(this.canvas, 'nwse-resize');
                            }
                            else {
                                imageCropperDataShare_1.ImageCropperDataShare.setOver(this.canvas);
                                imageCropperDataShare_1.ImageCropperDataShare.setStyle(this.canvas, 'nesw-resize');
                            }
                        }
                        else {
                            if (marker.getVerticalNeighbour().getPosition().y > marker.getPosition().y) {
                                imageCropperDataShare_1.ImageCropperDataShare.setOver(this.canvas);
                                imageCropperDataShare_1.ImageCropperDataShare.setStyle(this.canvas, 'nesw-resize');
                            }
                            else {
                                imageCropperDataShare_1.ImageCropperDataShare.setOver(this.canvas);
                                imageCropperDataShare_1.ImageCropperDataShare.setStyle(this.canvas, 'nwse-resize');
                            }
                        }
                        return true;
                    }
                    marker.setOver(false);
                    return false;
                };
                ;
                ImageCropper.prototype.onTouchStart = function (e) {
                    if (this.crop.isImageSet()) {
                        this.isMouseDown = true;
                    }
                };
                ;
                ImageCropper.prototype.onTouchEnd = function (e) {
                    if (this.crop.isImageSet()) {
                        for (var i = 0; i < e.changedTouches.length; i++) {
                            var touch = e.changedTouches[i];
                            var dragTouch = this.getDragTouchForID(touch.identifier);
                            if (dragTouch != null) {
                                if (dragTouch.dragHandle instanceof cornerMarker_1.CornerMarker || dragTouch.dragHandle instanceof dragMarker_1.DragMarker) {
                                    dragTouch.dragHandle.setOver(false);
                                }
                                this.handleRelease(dragTouch);
                            }
                        }
                        if (this.crop.isImageSet() && this.currentlyInteracting) {
                        }
                        if (this.currentDragTouches.length == 0) {
                            this.isMouseDown = false;
                            this.currentlyInteracting = false;
                        }
                    }
                };
                ;
                //http://stackoverflow.com/questions/11929099/html5-canvas-drawimage-ratio-bug-ios
                ImageCropper.prototype.drawImageIOSFix = function (ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
                    // Works only if whole image is displayed:
                    // ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
                    // The following works correct also when only a part of the image is displayed:
                    ctx.drawImage(img, sx * this.vertSquashRatio, sy * this.vertSquashRatio, sw * this.vertSquashRatio, sh * this.vertSquashRatio, dx, dy, dw, dh);
                };
                ;
                ImageCropper.prototype.detectVerticalSquash = function (img) {
                    var iw = img.naturalWidth, ih = img.naturalHeight;
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
                };
                ;
                ImageCropper.prototype.onMouseDown = function (e) {
                    if (this.crop.isImageSet()) {
                        this.isMouseDown = true;
                    }
                };
                ;
                ImageCropper.prototype.onMouseUp = function (e) {
                    if (this.crop.isImageSet()) {
                        imageCropperDataShare_1.ImageCropperDataShare.setReleased(this.canvas);
                        this.isMouseDown = false;
                        this.handleRelease(new cropTouch_1.CropTouch(0, 0, 0));
                    }
                };
                ;
                return ImageCropper;
            }(ImageCropperModel));
            exports_9("ImageCropper", ImageCropper);
        }
    }
});
System.register("components", ["src/imageCropper"], function(exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    var imageCropper_1;
    function exportStar_1(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_10(exports);
    }
    return {
        setters:[
            function (imageCropper_1_1) {
                imageCropper_1 = imageCropper_1_1;
                exportStar_1(imageCropper_1_1);
            }],
        execute: function() {
            exports_10("default",{
                directives: [imageCropper_1.ImageCropperComponent, imageCropper_1.CropperSettings]
            });
        }
    }
});
System.register("runtime/app", ['angular2/core', "components"], function(exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    var core_2, components_1;
    var AppComponent;
    return {
        setters:[
            function (core_2_1) {
                core_2 = core_2_1;
            },
            function (components_1_1) {
                components_1 = components_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent() {
                    this.cropperSettings = new components_1.CropperSettings();
                    this.cropperSettings.width = 100;
                    this.cropperSettings.height = 100;
                    this.cropperSettings.croppedWidth = 100;
                    this.cropperSettings.croppedHeight = 100;
                    this.cropperSettings.canvasWidth = 400;
                    this.cropperSettings.canvasHeight = 300;
                    this.data = {};
                }
                AppComponent = __decorate([
                    core_2.Component({
                        selector: 'test-app',
                        template: "<div>\n        <img-cropper [image]=\"data\" [settings]=\"cropperSettings\"></img-cropper><br>\n        <img [src]=\"data.image\" [width]=\"cropperSettings.croppedWidth\" [height]=\"cropperSettings.croppedHeight\">\n    </div>",
                        directives: [components_1.ImageCropperComponent]
                    }), 
                    __metadata('design:paramtypes', [])
                ], AppComponent);
                return AppComponent;
            }());
            exports_11("AppComponent", AppComponent);
        }
    }
});
/// <reference path="../node_modules/angular2/typings/browser.d.ts"/>
System.register("runtime/main", ['angular2/platform/browser', "runtime/app"], function(exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    var browser_1, app_1;
    return {
        setters:[
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (app_1_1) {
                app_1 = app_1_1;
            }],
        execute: function() {
            browser_1.bootstrap(app_1.AppComponent, []);
        }
    }
});
System.register("src/model/cropService", [], function(exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
    var CropService;
    return {
        setters:[],
        execute: function() {
            CropService = (function () {
                function CropService() {
                    this.DEG2RAD = 0.0174532925;
                }
                CropService.prototype.init = function (canvas) {
                    this.canvas = canvas;
                    this.ctx = this.canvas.getContext("2d");
                };
                ;
                return CropService;
            }());
            exports_13("CropService", CropService);
        }
    }
});
//# sourceMappingURL=ng2-img-cropper.js.map