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
                Object.defineProperty(Point.prototype, "next", {
                    get: function () {
                        return this._next;
                    },
                    set: function (p) {
                        this._next = p;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Point.prototype, "prev", {
                    get: function () {
                        return this._prev;
                    },
                    set: function (p) {
                        this._prev = p;
                    },
                    enumerable: true,
                    configurable: true
                });
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
                            prev.next = p;
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
                    this.firstAvailable = p.next;
                    p.x = x;
                    p.y = y;
                    return p;
                };
                ;
                PointPool.prototype.returnPoint = function (p) {
                    this.borrowed--;
                    p.x = 0;
                    p.y = 0;
                    p.next = this.firstAvailable;
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
                Object.defineProperty(Bounds.prototype, "width", {
                    get: function () {
                        return this.right - this.left;
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(Bounds.prototype, "height", {
                    get: function () {
                        return this.bottom - this.top;
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Bounds.prototype.getCentre = function () {
                    var w = this.width;
                    var h = this.height;
                    return pointPool_1.PointPool.instance.borrow(this.left + (w / 2), this.top + (h / 2));
                };
                ;
                return Bounds;
            }());
            exports_3("Bounds", Bounds);
        }
    }
});
System.register("src/cropperDrawSettings", [], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var CropperDrawSettings;
    return {
        setters:[],
        execute: function() {
            CropperDrawSettings = (function () {
                function CropperDrawSettings() {
                    this.strokeWidth = 1;
                    this.strokeColor = "rgba(255,255,255,1)";
                }
                return CropperDrawSettings;
            }());
            exports_4("CropperDrawSettings", CropperDrawSettings);
        }
    }
});
System.register("src/cropperSettings", ["src/cropperDrawSettings"], function(exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var cropperDrawSettings_1;
    var CropperSettings;
    return {
        setters:[
            function (cropperDrawSettings_1_1) {
                cropperDrawSettings_1 = cropperDrawSettings_1_1;
            }],
        execute: function() {
            CropperSettings = (function () {
                function CropperSettings() {
                    this.canvasWidth = 300;
                    this.canvasHeight = 300;
                    this.width = 200;
                    this.height = 200;
                    this.minWidth = 50;
                    this.minHeight = 50;
                    this.minWithRelativeToResolution = true;
                    this.responsive = false;
                    this.croppedWidth = 100;
                    this.croppedHeight = 100;
                    this.cropperDrawSettings = new cropperDrawSettings_1.CropperDrawSettings();
                    this.touchRadius = 20;
                    this.noFileInput = false;
                    this.allowedFilesRegex = /\.(jpe?g|png|gif)$/i;
                    this._rounded = false;
                    this._keepAspect = true;
                    this.cropWidth = 0;
                    this.cropHeight = 0;
                    // init
                }
                Object.defineProperty(CropperSettings.prototype, "rounded", {
                    get: function () {
                        return this._rounded;
                    },
                    set: function (val) {
                        this._rounded = val;
                        if (val) {
                            this._keepAspect = true;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(CropperSettings.prototype, "keepAspect", {
                    get: function () {
                        return this._keepAspect;
                    },
                    set: function (val) {
                        if (val === false && this._rounded) {
                            throw new Error("Cannot set keep aspect to false on rounded cropper. Ellipsis not supported");
                        }
                        this._keepAspect = val;
                    },
                    enumerable: true,
                    configurable: true
                });
                return CropperSettings;
            }());
            exports_5("CropperSettings", CropperSettings);
        }
    }
});
System.register("src/model/handle", ["src/model/point", "src/cropperSettings"], function(exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var point_2, cropperSettings_1;
    var Handle;
    return {
        setters:[
            function (point_2_1) {
                point_2 = point_2_1;
            },
            function (cropperSettings_1_1) {
                cropperSettings_1 = cropperSettings_1_1;
            }],
        execute: function() {
            Handle = (function () {
                function Handle(x, y, radius, settings) {
                    this.cropperSettings = new cropperSettings_1.CropperSettings();
                    this.over = false;
                    this.drag = false;
                    this._position = new point_2.Point(x, y);
                    this.offset = new point_2.Point(0, 0);
                    this.radius = radius;
                    this.cropperSettings = settings;
                }
                Handle.prototype.setDrag = function (value) {
                    this.drag = value;
                    this.setOver(value);
                };
                Handle.prototype.draw = function (ctx) {
                    // this should't be empty
                };
                Handle.prototype.setOver = function (over) {
                    this.over = over;
                };
                Handle.prototype.touchInBounds = function (x, y) {
                    return (x > this.position.x - this.radius + this.offset.x) &&
                        (x < this.position.x + this.radius + this.offset.x) &&
                        (y > this.position.y - this.radius + this.offset.y) &&
                        (y < this.position.y + this.radius + this.offset.y);
                };
                Object.defineProperty(Handle.prototype, "position", {
                    get: function () {
                        return this._position;
                    },
                    enumerable: true,
                    configurable: true
                });
                Handle.prototype.setPosition = function (x, y) {
                    this._position.x = x;
                    this._position.y = y;
                };
                return Handle;
            }());
            exports_6("Handle", Handle);
        }
    }
});
System.register("src/model/cornerMarker", ["src/model/handle"], function(exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
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
                function CornerMarker(x, y, radius, cropperSettings) {
                    _super.call(this, x, y, radius, cropperSettings);
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
                    if (this.cropperSettings.rounded) {
                        var width = this.position.x - this.horizontalNeighbour.position.x;
                        var height = this.position.y - this.verticalNeighbour.position.y;
                        var offX = Math.round(Math.sin(Math.PI / 2) * Math.abs(width / 2)) / 4;
                        var offY = Math.round(Math.sin(Math.PI / 2) * Math.abs(height / 2)) / 4;
                        this.offset.x = hDirection > 0 ? offX : -offX;
                        this.offset.y = vDirection > 0 ? offY : -offY;
                    }
                    else {
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
                };
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
                    ctx.moveTo(this.position.x + this.offset.x, this.position.y + this.offset.y);
                    ctx.lineTo(this.position.x + this.offset.x + (sideLength * hDirection), this.position.y + this.offset.y);
                    ctx.lineTo(this.position.x + this.offset.x + (sideLength * hDirection), this.position.y + this.offset.y +
                        (sideLength * vDirection));
                    ctx.lineTo(this.position.x + this.offset.x, this.position.y + this.offset.y + (sideLength * vDirection));
                    ctx.lineTo(this.position.x + this.offset.x, this.position.y + this.offset.y);
                    ctx.closePath();
                    ctx.fillStyle = "rgba(255,255,255,.7)";
                    ctx.fill();
                };
                CornerMarker.prototype.moveX = function (x) {
                    this.setPosition(x, this.position.y);
                };
                CornerMarker.prototype.moveY = function (y) {
                    this.setPosition(this.position.x, y);
                };
                CornerMarker.prototype.move = function (x, y) {
                    this.setPosition(x, y);
                    this.verticalNeighbour.moveX(x);
                    this.horizontalNeighbour.moveY(y);
                };
                CornerMarker.prototype.addHorizontalNeighbour = function (neighbour) {
                    this.horizontalNeighbour = neighbour;
                };
                CornerMarker.prototype.addVerticalNeighbour = function (neighbour) {
                    this.verticalNeighbour = neighbour;
                };
                CornerMarker.prototype.getHorizontalNeighbour = function () {
                    return this.horizontalNeighbour;
                };
                CornerMarker.prototype.getVerticalNeighbour = function () {
                    return this.verticalNeighbour;
                };
                CornerMarker.prototype.draw = function (ctx) {
                    this.drawCornerFill(ctx);
                    this.drawCornerBorder(ctx);
                };
                return CornerMarker;
            }(handle_1.Handle));
            exports_7("CornerMarker", CornerMarker);
        }
    }
});
System.register("src/model/dragMarker", ["src/model/handle", "src/model/pointPool"], function(exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
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
                function DragMarker(x, y, radius, cropperSettings) {
                    _super.call(this, x, y, radius, cropperSettings);
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
                DragMarker.prototype.drawIcon = function (ctx, points) {
                    ctx.beginPath();
                    ctx.moveTo(points[0].x + this.position.x, points[0].y + this.position.y);
                    for (var k = 0; k < points.length; k++) {
                        var p = points[k];
                        ctx.lineTo(p.x + this.position.x, p.y + this.position.y);
                    }
                    ctx.closePath();
                    ctx.fillStyle = this.cropperSettings.cropperDrawSettings.strokeColor;
                    ctx.fill();
                };
                DragMarker.prototype.recalculatePosition = function (bounds) {
                    var c = bounds.getCentre();
                    this.setPosition(c.x, c.y);
                    pointPool_2.PointPool.instance.returnPoint(c);
                };
                return DragMarker;
            }(handle_2.Handle));
            exports_8("DragMarker", DragMarker);
        }
    }
});
System.register("src/model/cropTouch", [], function(exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    var CropTouch;
    return {
        setters:[],
        execute: function() {
            CropTouch = (function () {
                function CropTouch(x, y, id) {
                    this.id = id || 0;
                    this.x = x || 0;
                    this.y = y || 0;
                    this.dragHandle = null;
                }
                return CropTouch;
            }());
            exports_9("CropTouch", CropTouch);
        }
    }
});
System.register("src/model/imageCropperModel", [], function(exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    var ImageCropperModel;
    return {
        setters:[],
        execute: function() {
            ImageCropperModel = (function () {
                function ImageCropperModel() {
                }
                return ImageCropperModel;
            }());
            exports_10("ImageCropperModel", ImageCropperModel);
        }
    }
});
System.register("src/imageCropperDataShare", [], function(exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
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
            exports_11("ImageCropperDataShare", ImageCropperDataShare);
        }
    }
});
System.register("src/imageCropper", ["src/model/bounds", "src/model/cornerMarker", "src/model/cropTouch", "src/model/dragMarker", "src/model/imageCropperModel", "src/imageCropperDataShare", "src/model/pointPool"], function(exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    var bounds_1, cornerMarker_1, cropTouch_1, dragMarker_1, imageCropperModel_1, imageCropperDataShare_1, pointPool_3;
    var ImageCropper;
    return {
        setters:[
            function (bounds_1_1) {
                bounds_1 = bounds_1_1;
            },
            function (cornerMarker_1_1) {
                cornerMarker_1 = cornerMarker_1_1;
            },
            function (cropTouch_1_1) {
                cropTouch_1 = cropTouch_1_1;
            },
            function (dragMarker_1_1) {
                dragMarker_1 = dragMarker_1_1;
            },
            function (imageCropperModel_1_1) {
                imageCropperModel_1 = imageCropperModel_1_1;
            },
            function (imageCropperDataShare_1_1) {
                imageCropperDataShare_1 = imageCropperDataShare_1_1;
            },
            function (pointPool_3_1) {
                pointPool_3 = pointPool_3_1;
            }],
        execute: function() {
            ImageCropper = (function (_super) {
                __extends(ImageCropper, _super);
                function ImageCropper(cropperSettings) {
                    _super.call(this);
                    var x = 0;
                    var y = 0;
                    var width = cropperSettings.width;
                    var height = cropperSettings.height;
                    var keepAspect = cropperSettings.keepAspect;
                    var touchRadius = cropperSettings.touchRadius;
                    var minWidth = cropperSettings.minWidth;
                    var minHeight = cropperSettings.minHeight;
                    var croppedWidth = cropperSettings.croppedWidth;
                    var croppedHeight = cropperSettings.croppedHeight;
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
                    this.pointPool = new pointPool_3.PointPool(200);
                    this.tl = new cornerMarker_1.CornerMarker(x, y, touchRadius, this.cropperSettings);
                    this.tr = new cornerMarker_1.CornerMarker(x + width, y, touchRadius, this.cropperSettings);
                    this.bl = new cornerMarker_1.CornerMarker(x, y + height, touchRadius, this.cropperSettings);
                    this.br = new cornerMarker_1.CornerMarker(x + width, y + height, touchRadius, this.cropperSettings);
                    this.tl.addHorizontalNeighbour(this.tr);
                    this.tl.addVerticalNeighbour(this.bl);
                    this.tr.addHorizontalNeighbour(this.tl);
                    this.tr.addVerticalNeighbour(this.br);
                    this.bl.addHorizontalNeighbour(this.br);
                    this.bl.addVerticalNeighbour(this.tl);
                    this.br.addHorizontalNeighbour(this.bl);
                    this.br.addVerticalNeighbour(this.tr);
                    this.markers = [this.tl, this.tr, this.bl, this.br];
                    this.center = new dragMarker_1.DragMarker(x + (width / 2), y + (height / 2), touchRadius, this.cropperSettings);
                    this.keepAspect = keepAspect;
                    this.aspectRatio = height / width;
                    this.croppedImage = new Image();
                    this.currentlyInteracting = false;
                    this.cropWidth = croppedWidth;
                    this.cropHeight = croppedHeight;
                }
                ImageCropper.sign = function (x) {
                    if (+x === x) {
                        return (x === 0) ? x : (x > 0) ? 1 : -1;
                    }
                    return NaN;
                };
                ImageCropper.getMousePos = function (canvas, evt) {
                    var rect = canvas.getBoundingClientRect();
                    return pointPool_3.PointPool.instance.borrow(evt.clientX - rect.left, evt.clientY - rect.top);
                };
                ImageCropper.getTouchPos = function (canvas, touch) {
                    var rect = canvas.getBoundingClientRect();
                    return pointPool_3.PointPool.instance.borrow(touch.clientX - rect.left, touch.clientY - rect.top);
                };
                ImageCropper.detectVerticalSquash = function (img) {
                    var ih = img.height;
                    var canvas = document.createElement("canvas");
                    canvas.width = 1;
                    canvas.height = ih;
                    var ctx = canvas.getContext("2d");
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
                ImageCropper.prototype.prepare = function (canvas) {
                    this.buffer = document.createElement("canvas");
                    this.cropCanvas = document.createElement("canvas");
                    // todo get more reliable parent width value.
                    var responsiveWidth = canvas.parentElement.clientWidth;
                    if (responsiveWidth > 0 && this.cropperSettings.responsive) {
                        this.cropCanvas.width = responsiveWidth;
                        this.buffer.width = responsiveWidth;
                        canvas.width = responsiveWidth;
                    }
                    else {
                        this.cropCanvas.width = this.cropWidth;
                        this.buffer.width = canvas.width;
                    }
                    this.cropCanvas.height = this.cropHeight;
                    this.buffer.height = canvas.height;
                    this.canvas = canvas;
                    this.ctx = this.canvas.getContext("2d");
                    this.draw(this.ctx);
                };
                ImageCropper.prototype.resizeCanvas = function (width, height) {
                    this.canvas.width = width;
                    this.canvas.height = height;
                    this.buffer.width = width;
                    this.buffer.height = height;
                    this.draw(this.ctx);
                };
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
                        this.buffer.getContext("2d").drawImage(this.canvas, 0, 0, this.canvasWidth, this.canvasHeight);
                        ctx.lineWidth = this.cropperSettings.cropperDrawSettings.strokeWidth;
                        ctx.strokeStyle = this.cropperSettings.cropperDrawSettings.strokeColor; // "rgba(255,228,0,1)";
                        if (!this.cropperSettings.rounded) {
                            ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
                            ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
                            ctx.drawImage(this.buffer, bounds.left, bounds.top, Math.max(bounds.width, 1), Math.max(bounds.height, 1), bounds.left, bounds.top, bounds.width, bounds.height);
                            ctx.strokeRect(bounds.left, bounds.top, bounds.width, bounds.height);
                        }
                        else {
                            ctx.beginPath();
                            ctx.arc(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2, bounds.width / 2, 0, Math.PI * 2, true);
                            ctx.closePath();
                            ctx.stroke();
                        }
                        var marker = void 0;
                        for (var i = 0; i < this.markers.length; i++) {
                            marker = this.markers[i];
                            marker.draw(ctx);
                        }
                        this.center.draw(ctx);
                    }
                    else {
                        ctx.fillStyle = "rgba(192,192,192,1)";
                        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                    }
                };
                ImageCropper.prototype.dragCenter = function (x, y, marker) {
                    var bounds = this.getBounds();
                    var left = x - (bounds.width / 2);
                    var right = x + (bounds.width / 2);
                    var top = y - (bounds.height / 2);
                    var bottom = y + (bounds.height / 2);
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
                };
                ImageCropper.prototype.enforceMinSize = function (x, y, marker) {
                    var xLength = x - marker.getHorizontalNeighbour().position.x;
                    var yLength = y - marker.getVerticalNeighbour().position.y;
                    var xOver = this.minWidth - Math.abs(xLength);
                    var yOver = this.minHeight - Math.abs(yLength);
                    if (xLength === 0 || yLength === 0) {
                        x = marker.position.x;
                        y = marker.position.y;
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
                            else {
                                if (yOver > 0) {
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
                        x = marker.position.x;
                        y = marker.position.y;
                    }
                    return pointPool_3.PointPool.instance.borrow(x, y);
                };
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
                        ax = anchorMarker.position.x;
                        ay = anchorMarker.position.y;
                        if (x <= anchorMarker.position.x) {
                            if (y <= anchorMarker.position.y) {
                                iX = ax - (100 / this.aspectRatio);
                                iY = ay - (100 / this.aspectRatio * this.aspectRatio);
                                fold = this.getSide(pointPool_3.PointPool.instance.borrow(iX, iY), anchorMarker.position, pointPool_3.PointPool.instance.borrow(x, y));
                                if (fold > 0) {
                                    newHeight = Math.abs(anchorMarker.position.y - y);
                                    newWidth = newHeight / this.aspectRatio;
                                    newY = anchorMarker.position.y - newHeight;
                                    newX = anchorMarker.position.x - newWidth;
                                    var min = this.enforceMinSize(newX, newY, marker);
                                    marker.move(min.x, min.y);
                                    pointPool_3.PointPool.instance.returnPoint(min);
                                }
                                else {
                                    if (fold < 0) {
                                        newWidth = Math.abs(anchorMarker.position.x - x);
                                        newHeight = newWidth * this.aspectRatio;
                                        newY = anchorMarker.position.y - newHeight;
                                        newX = anchorMarker.position.x - newWidth;
                                        var min = this.enforceMinSize(newX, newY, marker);
                                        marker.move(min.x, min.y);
                                        pointPool_3.PointPool.instance.returnPoint(min);
                                    }
                                }
                            }
                            else {
                                iX = ax - (100 / this.aspectRatio);
                                iY = ay + (100 / this.aspectRatio * this.aspectRatio);
                                fold = this.getSide(pointPool_3.PointPool.instance.borrow(iX, iY), anchorMarker.position, pointPool_3.PointPool.instance.borrow(x, y));
                                if (fold > 0) {
                                    newWidth = Math.abs(anchorMarker.position.x - x);
                                    newHeight = newWidth * this.aspectRatio;
                                    newY = anchorMarker.position.y + newHeight;
                                    newX = anchorMarker.position.x - newWidth;
                                    var min = this.enforceMinSize(newX, newY, marker);
                                    marker.move(min.x, min.y);
                                    pointPool_3.PointPool.instance.returnPoint(min);
                                }
                                else {
                                    if (fold < 0) {
                                        newHeight = Math.abs(anchorMarker.position.y - y);
                                        newWidth = newHeight / this.aspectRatio;
                                        newY = anchorMarker.position.y + newHeight;
                                        newX = anchorMarker.position.x - newWidth;
                                        var min = this.enforceMinSize(newX, newY, marker);
                                        marker.move(min.x, min.y);
                                        pointPool_3.PointPool.instance.returnPoint(min);
                                    }
                                }
                            }
                        }
                        else {
                            if (y <= anchorMarker.position.y) {
                                iX = ax + (100 / this.aspectRatio);
                                iY = ay - (100 / this.aspectRatio * this.aspectRatio);
                                fold = this.getSide(pointPool_3.PointPool.instance.borrow(iX, iY), anchorMarker.position, pointPool_3.PointPool.instance.borrow(x, y));
                                if (fold < 0) {
                                    newHeight = Math.abs(anchorMarker.position.y - y);
                                    newWidth = newHeight / this.aspectRatio;
                                    newY = anchorMarker.position.y - newHeight;
                                    newX = anchorMarker.position.x + newWidth;
                                    var min = this.enforceMinSize(newX, newY, marker);
                                    marker.move(min.x, min.y);
                                    pointPool_3.PointPool.instance.returnPoint(min);
                                }
                                else {
                                    if (fold > 0) {
                                        newWidth = Math.abs(anchorMarker.position.x - x);
                                        newHeight = newWidth * this.aspectRatio;
                                        newY = anchorMarker.position.y - newHeight;
                                        newX = anchorMarker.position.x + newWidth;
                                        var min = this.enforceMinSize(newX, newY, marker);
                                        marker.move(min.x, min.y);
                                        pointPool_3.PointPool.instance.returnPoint(min);
                                    }
                                }
                            }
                            else {
                                iX = ax + (100 / this.aspectRatio);
                                iY = ay + (100 / this.aspectRatio * this.aspectRatio);
                                fold = this.getSide(pointPool_3.PointPool.instance.borrow(iX, iY), anchorMarker.position, pointPool_3.PointPool.instance.borrow(x, y));
                                if (fold < 0) {
                                    newWidth = Math.abs(anchorMarker.position.x - x);
                                    newHeight = newWidth * this.aspectRatio;
                                    newY = anchorMarker.position.y + newHeight;
                                    newX = anchorMarker.position.x + newWidth;
                                    var min = this.enforceMinSize(newX, newY, marker);
                                    marker.move(min.x, min.y);
                                    pointPool_3.PointPool.instance.returnPoint(min);
                                }
                                else {
                                    if (fold > 0) {
                                        newHeight = Math.abs(anchorMarker.position.y - y);
                                        newWidth = newHeight / this.aspectRatio;
                                        newY = anchorMarker.position.y + newHeight;
                                        newX = anchorMarker.position.x + newWidth;
                                        var min = this.enforceMinSize(newX, newY, marker);
                                        marker.move(min.x, min.y);
                                        pointPool_3.PointPool.instance.returnPoint(min);
                                    }
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
                };
                ImageCropper.prototype.getSide = function (a, b, c) {
                    var n = ImageCropper.sign((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x));
                    // TODO move the return of the pools to outside of this function
                    pointPool_3.PointPool.instance.returnPoint(a);
                    pointPool_3.PointPool.instance.returnPoint(c);
                    return n;
                };
                ImageCropper.prototype.handleRelease = function (newCropTouch) {
                    if (newCropTouch == null) {
                        return;
                    }
                    var index = 0;
                    for (var k = 0; k < this.currentDragTouches.length; k++) {
                        if (newCropTouch.id === this.currentDragTouches[k].id) {
                            this.currentDragTouches[k].dragHandle.setDrag(false);
                            newCropTouch.dragHandle = null;
                            index = k;
                        }
                    }
                    this.currentDragTouches.splice(index, 1);
                    this.draw(this.ctx);
                };
                ImageCropper.prototype.handleMove = function (newCropTouch) {
                    var matched = false;
                    for (var k = 0; k < this.currentDragTouches.length; k++) {
                        if (newCropTouch.id === this.currentDragTouches[k].id && this.currentDragTouches[k].dragHandle != null) {
                            var dragTouch = this.currentDragTouches[k];
                            var clampedPositions = this.clampPosition(newCropTouch.x - dragTouch.dragHandle.offset.x, newCropTouch.y - dragTouch.dragHandle.offset.y);
                            newCropTouch.x = clampedPositions.x;
                            newCropTouch.y = clampedPositions.y;
                            pointPool_3.PointPool.instance.returnPoint(clampedPositions);
                            if (dragTouch.dragHandle instanceof cornerMarker_1.CornerMarker) {
                                this.dragCorner(newCropTouch.x, newCropTouch.y, dragTouch.dragHandle);
                            }
                            else {
                                this.dragCenter(newCropTouch.x, newCropTouch.y, dragTouch.dragHandle);
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
                                newCropTouch.dragHandle.offset.x = newCropTouch.x - newCropTouch.dragHandle.position.x;
                                newCropTouch.dragHandle.offset.y = newCropTouch.y - newCropTouch.dragHandle.position.y;
                                this.dragCorner(newCropTouch.x - newCropTouch.dragHandle.offset.x, newCropTouch.y - newCropTouch.dragHandle.offset.y, newCropTouch.dragHandle);
                                break;
                            }
                        }
                        if (newCropTouch.dragHandle === null || typeof newCropTouch.dragHandle === "undefined") {
                            if (this.center.touchInBounds(newCropTouch.x, newCropTouch.y)) {
                                newCropTouch.dragHandle = this.center;
                                this.currentDragTouches.push(newCropTouch);
                                newCropTouch.dragHandle.setDrag(true);
                                newCropTouch.dragHandle.offset.x = newCropTouch.x - newCropTouch.dragHandle.position.x;
                                newCropTouch.dragHandle.offset.y = newCropTouch.y - newCropTouch.dragHandle.position.y;
                                this.dragCenter(newCropTouch.x - newCropTouch.dragHandle.offset.x, newCropTouch.y - newCropTouch.dragHandle.offset.y, newCropTouch.dragHandle);
                            }
                        }
                    }
                };
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
                ImageCropper.prototype.getCropBounds = function () {
                    var bounds = this.getBounds();
                    bounds.top = Math.round((bounds.top + this.minYClamp) / this.ratioH);
                    bounds.bottom = Math.round((bounds.bottom + this.minYClamp) / this.ratioH);
                    bounds.left = Math.round((bounds.left - this.minXClamp) / this.ratioW);
                    bounds.right = Math.round((bounds.right - this.minXClamp) / this.ratioW);
                    return bounds;
                };
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
                ImageCropper.prototype.isImageSet = function () {
                    return this.imageSet;
                };
                ImageCropper.prototype.setImage = function (img) {
                    if (!img) {
                        throw "Image is null";
                    }
                    this.srcImage = img;
                    this.imageSet = true;
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    var bufferContext = this.buffer.getContext("2d");
                    bufferContext.clearRect(0, 0, this.buffer.width, this.buffer.height);
                    var splitName = img.src.split(".");
                    var fileType = splitName[1];
                    if (fileType === "png" || fileType === "jpg") {
                        this.fileType = fileType;
                    }
                    // TODO: investigate better solution
                    // this.fileType = img.src.match(/^data:.+\/(.+);base64,(.*)$/)[1];
                    if (this.cropperSettings.minWithRelativeToResolution) {
                        this.minWidth = (this.canvas.width * this.minWidth / this.srcImage.width);
                        this.minHeight = (this.canvas.height * this.minHeight / this.srcImage.height);
                    }
                    this.updateClampBounds();
                    var sourceAspect = this.srcImage.height / this.srcImage.width;
                    var cropBounds = this.getBounds();
                    var cropAspect = cropBounds.height / cropBounds.width;
                    var w = this.canvas.width;
                    var h = this.canvas.height;
                    this.canvasWidth = w;
                    this.canvasHeight = h;
                    var cX = this.canvas.width / 2;
                    var cY = this.canvas.height / 2;
                    var tlPos = pointPool_3.PointPool.instance.borrow(cX - cropBounds.width / 2, cY + cropBounds.height / 2);
                    var trPos = pointPool_3.PointPool.instance.borrow(cX + cropBounds.width / 2, cY + cropBounds.height / 2);
                    var blPos = pointPool_3.PointPool.instance.borrow(cX - cropBounds.width / 2, cY - cropBounds.height / 2);
                    var brPos = pointPool_3.PointPool.instance.borrow(cX + cropBounds.width / 2, cY - cropBounds.height / 2);
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
                    else {
                        var imageW = Math.min(h / sourceAspect, w);
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
                    this.vertSquashRatio = ImageCropper.detectVerticalSquash(this.srcImage);
                    this.draw(this.ctx);
                    this.croppedImage = this.getCroppedImage(this.cropWidth, this.cropHeight);
                };
                // todo: Unused parameters?
                ImageCropper.prototype.getCroppedImage = function (fillWidth, fillHeight) {
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
                    else {
                        if (canvasAspect < sourceAspect) {
                            h = this.canvas.height;
                            w = this.canvas.height / sourceAspect;
                        }
                        else {
                            h = this.canvas.height;
                            w = this.canvas.width;
                        }
                    }
                    this.ratioW = w / this.srcImage.width;
                    this.ratioH = h / this.srcImage.height;
                    var offsetH = (this.buffer.height - h) / 2 / this.ratioH;
                    var offsetW = (this.buffer.width - w) / 2 / this.ratioW;
                    var ctx = this.cropCanvas.getContext("2d");
                    this.cropCanvas.width = Math.abs(bounds.left - bounds.right);
                    this.cropCanvas.height = Math.abs(bounds.top - bounds.bottom);
                    ctx.clearRect(0, 0, this.cropCanvas.width, this.cropCanvas.height);
                    this.drawImageIOSFix(ctx, this.srcImage, Math.max(Math.round((bounds.left) / this.ratioW - offsetW), 0), Math.max(Math.round(bounds.top / this.ratioH - offsetH), 0), Math.max(Math.round(bounds.width / this.ratioW), 1), Math.max(Math.round(bounds.height / this.ratioH), 1), 0, 0, this.cropCanvas.width, this.cropCanvas.height);
                    this.croppedImage.width = this.cropCanvas.width;
                    this.croppedImage.height = this.cropCanvas.height;
                    this.croppedImage.src = this.cropCanvas.toDataURL("image/" + this.fileType);
                    return this.croppedImage;
                };
                ImageCropper.prototype.getBounds = function () {
                    var minX = Number.MAX_VALUE;
                    var minY = Number.MAX_VALUE;
                    var maxX = -Number.MAX_VALUE;
                    var maxY = -Number.MAX_VALUE;
                    for (var i = 0; i < this.markers.length; i++) {
                        var marker = this.markers[i];
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
                    var bounds = new bounds_1.Bounds();
                    bounds.left = minX;
                    bounds.right = maxX;
                    bounds.top = minY;
                    bounds.bottom = maxY;
                    return bounds;
                };
                ImageCropper.prototype.setBounds = function (bounds) {
                    var topLeft;
                    var topRight;
                    var bottomLeft;
                    var bottomRight;
                    var currentBounds = this.getBounds();
                    for (var i = 0; i < this.markers.length; i++) {
                        var marker = this.markers[i];
                        if (marker.position.x === currentBounds.left) {
                            if (marker.position.y === currentBounds.top) {
                                topLeft = marker;
                            }
                            else {
                                bottomLeft = marker;
                            }
                        }
                        else {
                            if (marker.position.y === currentBounds.top) {
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
                ImageCropper.prototype.onTouchMove = function (event) {
                    if (this.crop.isImageSet()) {
                        event.preventDefault();
                        if (event.touches.length === 1) {
                            for (var i = 0; i < event.touches.length; i++) {
                                var touch = event.touches[i];
                                var touchPosition = ImageCropper.getTouchPos(this.canvas, touch);
                                var cropTouch = new cropTouch_1.CropTouch(touchPosition.x, touchPosition.y, touch.identifier);
                                pointPool_3.PointPool.instance.returnPoint(touchPosition);
                                this.move(cropTouch);
                            }
                        }
                        else {
                            if (event.touches.length === 2) {
                                var distance = ((event.touches[0].clientX - event.touches[1].clientX) * (event.touches[0].clientX - event.touches[1].clientX)) + ((event.touches[0].clientY - event.touches[1].clientY) * (event.touches[0].clientY - event.touches[1].clientY));
                                if (this.previousDistance && this.previousDistance !== distance) {
                                    var increment = distance < this.previousDistance ? 1 : -1;
                                    var bounds = this.getBounds();
                                    bounds.top += increment;
                                    bounds.left += increment;
                                    bounds.right -= increment;
                                    bounds.bottom -= increment;
                                    this.setBounds(bounds);
                                }
                                this.previousDistance = distance;
                            }
                        }
                        this.draw(this.ctx);
                    }
                };
                ImageCropper.prototype.onMouseMove = function (e) {
                    if (this.crop.isImageSet()) {
                        var mousePosition = ImageCropper.getMousePos(this.canvas, e);
                        this.move(new cropTouch_1.CropTouch(mousePosition.x, mousePosition.y, 0));
                        var dragTouch = this.getDragTouchForID(0);
                        if (dragTouch) {
                            dragTouch.x = mousePosition.x;
                            dragTouch.y = mousePosition.y;
                        }
                        else {
                            dragTouch = new cropTouch_1.CropTouch(mousePosition.x, mousePosition.y, 0);
                        }
                        pointPool_3.PointPool.instance.returnPoint(mousePosition);
                        this.drawCursors(dragTouch);
                        this.draw(this.ctx);
                    }
                };
                ImageCropper.prototype.move = function (cropTouch) {
                    if (this.isMouseDown) {
                        this.handleMove(cropTouch);
                    }
                };
                ImageCropper.prototype.getDragTouchForID = function (id) {
                    var currentDragTouch;
                    for (var i = 0; i < this.currentDragTouches.length; i++) {
                        if (id === this.currentDragTouches[i].id) {
                            currentDragTouch = this.currentDragTouches[i];
                        }
                    }
                    return currentDragTouch;
                };
                ImageCropper.prototype.drawCursors = function (cropTouch) {
                    var cursorDrawn = false;
                    if (cropTouch != null) {
                        if (cropTouch.dragHandle === this.center) {
                            imageCropperDataShare_1.ImageCropperDataShare.setStyle(this.canvas, "move");
                            cursorDrawn = true;
                        }
                        if (cropTouch.dragHandle !== null && cropTouch.dragHandle instanceof cornerMarker_1.CornerMarker) {
                            this.drawCornerCursor(cropTouch.dragHandle, cropTouch.dragHandle.position.x, cropTouch.dragHandle.position.y);
                            cursorDrawn = true;
                        }
                    }
                    var didDraw = false;
                    if (!cursorDrawn) {
                        for (var i = 0; i < this.markers.length; i++) {
                            didDraw = didDraw || this.drawCornerCursor(this.markers[i], cropTouch.x, cropTouch.y);
                        }
                        if (!didDraw) {
                            imageCropperDataShare_1.ImageCropperDataShare.setStyle(this.canvas, "initial");
                        }
                    }
                    if (!didDraw && !cursorDrawn && this.center.touchInBounds(cropTouch.x, cropTouch.y)) {
                        this.center.setOver(true);
                        imageCropperDataShare_1.ImageCropperDataShare.setOver(this.canvas);
                        imageCropperDataShare_1.ImageCropperDataShare.setStyle(this.canvas, "move");
                    }
                    else {
                        this.center.setOver(false);
                    }
                };
                ImageCropper.prototype.drawCornerCursor = function (marker, x, y) {
                    if (marker.touchInBounds(x, y)) {
                        marker.setOver(true);
                        if (marker.getHorizontalNeighbour().position.x > marker.position.x) {
                            if (marker.getVerticalNeighbour().position.y > marker.position.y) {
                                imageCropperDataShare_1.ImageCropperDataShare.setOver(this.canvas);
                                imageCropperDataShare_1.ImageCropperDataShare.setStyle(this.canvas, "nwse-resize");
                            }
                            else {
                                imageCropperDataShare_1.ImageCropperDataShare.setOver(this.canvas);
                                imageCropperDataShare_1.ImageCropperDataShare.setStyle(this.canvas, "nesw-resize");
                            }
                        }
                        else {
                            if (marker.getVerticalNeighbour().position.y > marker.position.y) {
                                imageCropperDataShare_1.ImageCropperDataShare.setOver(this.canvas);
                                imageCropperDataShare_1.ImageCropperDataShare.setStyle(this.canvas, "nesw-resize");
                            }
                            else {
                                imageCropperDataShare_1.ImageCropperDataShare.setOver(this.canvas);
                                imageCropperDataShare_1.ImageCropperDataShare.setStyle(this.canvas, "nwse-resize");
                            }
                        }
                        return true;
                    }
                    marker.setOver(false);
                    return false;
                };
                // todo: Unused param
                ImageCropper.prototype.onTouchStart = function (event) {
                    if (this.crop.isImageSet()) {
                        this.isMouseDown = true;
                    }
                };
                ImageCropper.prototype.onTouchEnd = function (event) {
                    if (this.crop.isImageSet()) {
                        for (var i = 0; i < event.changedTouches.length; i++) {
                            var touch = event.changedTouches[i];
                            var dragTouch = this.getDragTouchForID(touch.identifier);
                            if (dragTouch !== null) {
                                if (dragTouch.dragHandle instanceof cornerMarker_1.CornerMarker || dragTouch.dragHandle instanceof dragMarker_1.DragMarker) {
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
                };
                // http://stackoverflow.com/questions/11929099/html5-canvas-drawimage-ratio-bug-ios
                ImageCropper.prototype.drawImageIOSFix = function (ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
                    // Works only if whole image is displayed:
                    // ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
                    // The following works correct also when only a part of the image is displayed:
                    // ctx.drawImage(img, sx * this.vertSquashRatio, sy * this.vertSquashRatio, sw * this.vertSquashRatio, sh *
                    // this.vertSquashRatio, dx, dy, dw, dh);
                    ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
                };
                ImageCropper.prototype.onMouseDown = function () {
                    if (this.crop.isImageSet()) {
                        this.isMouseDown = true;
                    }
                };
                ImageCropper.prototype.onMouseUp = function () {
                    if (this.crop.isImageSet()) {
                        imageCropperDataShare_1.ImageCropperDataShare.setReleased(this.canvas);
                        this.isMouseDown = false;
                        this.handleRelease(new cropTouch_1.CropTouch(0, 0, 0));
                    }
                };
                return ImageCropper;
            }(imageCropperModel_1.ImageCropperModel));
            exports_12("ImageCropper", ImageCropper);
        }
    }
});
System.register("src/exif", [], function(exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
    var Fraction, Debug, Exif;
    return {
        setters:[],
        execute: function() {
            Fraction = (function (_super) {
                __extends(Fraction, _super);
                function Fraction() {
                    _super.apply(this, arguments);
                }
                return Fraction;
            }(Number));
            exports_13("Fraction", Fraction);
            // Console debug wrapper that makes code looks a little bit cleaner
            Debug = (function () {
                function Debug() {
                }
                Debug.log = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i - 0] = arguments[_i];
                    }
                    if (Exif.debug) {
                        console.log(args);
                    }
                };
                return Debug;
            }());
            exports_13("Debug", Debug);
            Exif = (function () {
                function Exif() {
                }
                Exif.addEvent = function (element, event, handler) {
                    if (element.addEventListener) {
                        element.addEventListener(event, handler, false);
                    }
                    else {
                        // Hello, IE!
                        if (element.attachEvent) {
                            element.attachEvent("on" + event, handler);
                        }
                    }
                };
                Exif.imageHasData = function (img) {
                    return !!(img.exifdata);
                };
                Exif.base64ToArrayBuffer = function (base64, contentType) {
                    // e.g. 'data:image/jpeg;base64,...' => 'image/jpeg'
                    contentType = contentType || base64.match(/^data:([^;]+);base64,/mi)[1] || "";
                    base64 = base64.replace(/^data:([^;]+);base64,/gmi, "");
                    var binary = atob(base64);
                    var len = binary.length;
                    var buffer = new ArrayBuffer(len);
                    var view = new Uint8Array(buffer);
                    for (var i = 0; i < len; i++) {
                        view[i] = binary.charCodeAt(i);
                    }
                    return buffer;
                };
                Exif.objectURLToBlob = function (url, callback) {
                    var http = new XMLHttpRequest();
                    http.open("GET", url, true);
                    http.responseType = "blob";
                    http.onload = function () {
                        if (this.status === 200 || this.status === 0) {
                            callback(http.response);
                        }
                    };
                    http.send();
                };
                Exif.getImageData = function (img, callback) {
                    function handleBinaryFile(binFile) {
                        var data = Exif.findEXIFinJPEG(binFile);
                        var iptcdata = Exif.findIPTCinJPEG(binFile);
                        img.exifdata = data || {};
                        img.iptcdata = iptcdata || {};
                        if (callback) {
                            callback.call(img);
                        }
                    }
                    if ("src" in img && img.src) {
                        if (/^data:/i.test(img.src)) {
                            var arrayBuffer = Exif.base64ToArrayBuffer(img.src);
                            handleBinaryFile(arrayBuffer);
                        }
                        else {
                            if (/^blob:/i.test(img.src)) {
                                var fileReader_1 = new FileReader();
                                fileReader_1.onload = function (e) {
                                    handleBinaryFile(e.target.result);
                                };
                                Exif.objectURLToBlob(img.src, function (blob) {
                                    fileReader_1.readAsArrayBuffer(blob);
                                });
                            }
                            else {
                                var http_1 = new XMLHttpRequest();
                                http_1.onload = function () {
                                    if (this.status === 200 || this.status === 0) {
                                        handleBinaryFile(http_1.response);
                                    }
                                    else {
                                        throw "Could not load image";
                                    }
                                    http_1 = null;
                                };
                                http_1.open("GET", img.src, true);
                                http_1.responseType = "arraybuffer";
                                http_1.send(null);
                            }
                        }
                    }
                    else {
                        if (FileReader && (img instanceof Blob || img instanceof File)) {
                            var fileReader = new FileReader();
                            fileReader.onload = function (e) {
                                Debug.log("Got file of length " + e.target.result.byteLength);
                                handleBinaryFile(e.target.result);
                            };
                            fileReader.readAsArrayBuffer(img);
                        }
                    }
                };
                Exif.findEXIFinJPEG = function (file) {
                    var dataView = new DataView(file);
                    Debug.log("Got file of length " + file.byteLength);
                    if ((dataView.getUint8(0) !== 0xFF) || (dataView.getUint8(1) !== 0xD8)) {
                        Debug.log("Not a valid JPEG");
                        return false; // not a valid jpeg
                    }
                    var offset = 2;
                    var length = file.byteLength;
                    var marker;
                    while (offset < length) {
                        if (dataView.getUint8(offset) !== 0xFF) {
                            Debug.log("Not a valid marker at offset " + offset + ", found: " + dataView.getUint8(offset));
                            return false; // not a valid marker, something is wrong
                        }
                        marker = dataView.getUint8(offset + 1);
                        Debug.log(marker);
                        // we could implement handling for other markers here,
                        // but we're only looking for 0xFFE1 for EXIF data
                        if (marker === 225) {
                            Debug.log("Found 0xFFE1 marker");
                            return Exif.readEXIFData(dataView, offset + 4); // , dataView.getUint16(offset + 2) - 2);
                        }
                        else {
                            offset += 2 + dataView.getUint16(offset + 2);
                        }
                    }
                };
                Exif.findIPTCinJPEG = function (file) {
                    var dataView = new DataView(file);
                    Debug.log("Got file of length " + file.byteLength);
                    if ((dataView.getUint8(0) !== 0xFF) || (dataView.getUint8(1) !== 0xD8)) {
                        Debug.log("Not a valid JPEG");
                        return false; // not a valid jpeg
                    }
                    var offset = 2;
                    var length = file.byteLength;
                    var isFieldSegmentStart = function (_dataView, _offset) {
                        return (_dataView.getUint8(_offset) === 0x38 && _dataView.getUint8(_offset + 1) === 0x42 && _dataView.getUint8(_offset + 2) === 0x49 && _dataView.getUint8(_offset + 3) === 0x4D && _dataView.getUint8(_offset + 4) === 0x04 && _dataView.getUint8(_offset + 5) === 0x04);
                    };
                    while (offset < length) {
                        if (isFieldSegmentStart(dataView, offset)) {
                            // Get the length of the name header (which is padded to an even number of bytes)
                            var nameHeaderLength = dataView.getUint8(offset + 7);
                            if (nameHeaderLength % 2 !== 0) {
                                nameHeaderLength += 1;
                            }
                            // Check for pre photoshop 6 format
                            if (nameHeaderLength === 0) {
                                // Always 4
                                nameHeaderLength = 4;
                            }
                            var startOffset = offset + 8 + nameHeaderLength;
                            var sectionLength = dataView.getUint16(offset + 6 + nameHeaderLength);
                            return Exif.readIPTCData(file, startOffset, sectionLength);
                        }
                        // Not the marker, continue searching
                        offset++;
                    }
                };
                Exif.readIPTCData = function (file, startOffset, sectionLength) {
                    var dataView = new DataView(file);
                    var data = {};
                    var fieldValue, fieldName, dataSize, segmentType, segmentSize;
                    var segmentStartPos = startOffset;
                    while (segmentStartPos < startOffset + sectionLength) {
                        if (dataView.getUint8(segmentStartPos) === 0x1C && dataView.getUint8(segmentStartPos + 1) === 0x02) {
                            segmentType = dataView.getUint8(segmentStartPos + 2);
                            if (segmentType in Exif.IptcFieldMap) {
                                dataSize = dataView.getInt16(segmentStartPos + 3);
                                segmentSize = dataSize + 5;
                                fieldName = Exif.IptcFieldMap[segmentType];
                                fieldValue = Exif.getStringFromDB(dataView, segmentStartPos + 5, dataSize);
                                // Check if we already stored a value with this name
                                if (data.hasOwnProperty(fieldName)) {
                                    // Value already stored with this name, create multivalue field
                                    if (data[fieldName] instanceof Array) {
                                        data[fieldName].push(fieldValue);
                                    }
                                    else {
                                        data[fieldName] = [data[fieldName], fieldValue];
                                    }
                                }
                                else {
                                    data[fieldName] = fieldValue;
                                }
                            }
                        }
                        segmentStartPos++;
                    }
                    return data;
                };
                Exif.readTags = function (file, tiffStart, dirStart, strings, bigEnd) {
                    var entries = file.getUint16(dirStart, !bigEnd);
                    var tags = {};
                    var entryOffset;
                    var tag;
                    for (var i = 0; i < entries; i++) {
                        entryOffset = dirStart + i * 12 + 2;
                        tag = strings[file.getUint16(entryOffset, !bigEnd)];
                        if (!tag) {
                            Debug.log("Unknown tag: " + file.getUint16(entryOffset, !bigEnd));
                        }
                        tags[tag] = Exif.readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd);
                    }
                    return tags;
                };
                Exif.readTagValue = function (file, entryOffset, tiffStart, dirStart, bigEnd) {
                    var type = file.getUint16(entryOffset + 2, !bigEnd);
                    var numValues = file.getUint32(entryOffset + 4, !bigEnd);
                    var valueOffset = file.getUint32(entryOffset + 8, !bigEnd) + tiffStart;
                    var offset;
                    var vals, val, n;
                    var numerator;
                    var denominator;
                    switch (type) {
                        case 1: // byte, 8-bit unsigned int
                        case 7:
                            if (numValues === 1) {
                                return file.getUint8(entryOffset + 8, !bigEnd);
                            }
                            else {
                                offset = numValues > 4 ? valueOffset : (entryOffset + 8);
                                vals = [];
                                for (n = 0; n < numValues; n++) {
                                    vals[n] = file.getUint8(offset + n);
                                }
                                return vals;
                            }
                        case 2:
                            offset = numValues > 4 ? valueOffset : (entryOffset + 8);
                            return Exif.getStringFromDB(file, offset, numValues - 1);
                        case 3:
                            if (numValues === 1) {
                                return file.getUint16(entryOffset + 8, !bigEnd);
                            }
                            else {
                                offset = numValues > 2 ? valueOffset : (entryOffset + 8);
                                vals = [];
                                for (n = 0; n < numValues; n++) {
                                    vals[n] = file.getUint16(offset + 2 * n, !bigEnd);
                                }
                                return vals;
                            }
                        case 4:
                            if (numValues === 1) {
                                return file.getUint32(entryOffset + 8, !bigEnd);
                            }
                            else {
                                vals = [];
                                for (n = 0; n < numValues; n++) {
                                    vals[n] = file.getUint32(valueOffset + 4 * n, !bigEnd);
                                }
                                return vals;
                            }
                        case 5:
                            if (numValues === 1) {
                                numerator = file.getUint32(valueOffset, !bigEnd);
                                denominator = file.getUint32(valueOffset + 4, !bigEnd);
                                val = new Fraction(numerator / denominator);
                                val.numerator = numerator;
                                val.denominator = denominator;
                                return val;
                            }
                            else {
                                vals = [];
                                for (n = 0; n < numValues; n++) {
                                    numerator = file.getUint32(valueOffset + 8 * n, !bigEnd);
                                    denominator = file.getUint32(valueOffset + 4 + 8 * n, !bigEnd);
                                    vals[n] = new Fraction(numerator / denominator);
                                    vals[n].numerator = numerator;
                                    vals[n].denominator = denominator;
                                }
                                return vals;
                            }
                        case 9:
                            if (numValues === 1) {
                                return file.getInt32(entryOffset + 8, !bigEnd);
                            }
                            else {
                                vals = [];
                                for (n = 0; n < numValues; n++) {
                                    vals[n] = file.getInt32(valueOffset + 4 * n, !bigEnd);
                                }
                                return vals;
                            }
                        case 10:
                            if (numValues === 1) {
                                return file.getInt32(valueOffset, !bigEnd) / file.getInt32(valueOffset + 4, !bigEnd);
                            }
                            else {
                                vals = [];
                                for (n = 0; n < numValues; n++) {
                                    vals[n] = file.getInt32(valueOffset + 8 * n, !bigEnd) / file.getInt32(valueOffset + 4 + 8 * n, !bigEnd);
                                }
                                return vals;
                            }
                        default:
                            break;
                    }
                };
                Exif.getStringFromDB = function (buffer, start, length) {
                    var outstr = "";
                    for (var n = start; n < start + length; n++) {
                        outstr += String.fromCharCode(buffer.getUint8(n));
                    }
                    return outstr;
                };
                Exif.readEXIFData = function (file, start) {
                    if (Exif.getStringFromDB(file, start, 4) !== "Exif") {
                        Debug.log("Not valid EXIF data! " + Exif.getStringFromDB(file, start, 4));
                        return false;
                    }
                    var bigEnd, tags, tag, exifData, gpsData, tiffOffset = start + 6;
                    // test for TIFF validity and endianness
                    if (file.getUint16(tiffOffset) === 0x4949) {
                        bigEnd = false;
                    }
                    else {
                        if (file.getUint16(tiffOffset) === 0x4D4D) {
                            bigEnd = true;
                        }
                        else {
                            Debug.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)");
                            return false;
                        }
                    }
                    if (file.getUint16(tiffOffset + 2, !bigEnd) !== 0x002A) {
                        Debug.log("Not valid TIFF data! (no 0x002A)");
                        return false;
                    }
                    var firstIFDOffset = file.getUint32(tiffOffset + 4, !bigEnd);
                    if (firstIFDOffset < 0x00000008) {
                        Debug.log("Not valid TIFF data! (First offset less than 8)", file.getUint32(tiffOffset + 4, !bigEnd));
                        return false;
                    }
                    tags = Exif.readTags(file, tiffOffset, tiffOffset + firstIFDOffset, Exif.TiffTags, bigEnd);
                    if (tags.ExifIFDPointer) {
                        exifData = Exif.readTags(file, tiffOffset, tiffOffset + tags.ExifIFDPointer, Exif.Tags, bigEnd);
                        for (tag in exifData) {
                            if ({}.hasOwnProperty.call(exifData, tag)) {
                                switch (tag) {
                                    case "LightSource":
                                    case "Flash":
                                    case "MeteringMode":
                                    case "ExposureProgram":
                                    case "SensingMethod":
                                    case "SceneCaptureType":
                                    case "SceneType":
                                    case "CustomRendered":
                                    case "WhiteBalance":
                                    case "GainControl":
                                    case "Contrast":
                                    case "Saturation":
                                    case "Sharpness":
                                    case "SubjectDistanceRange":
                                    case "FileSource":
                                        exifData[tag] = Exif.StringValues[tag][exifData[tag]];
                                        break;
                                    case "ExifVersion":
                                    case "FlashpixVersion":
                                        exifData[tag] = String.fromCharCode(exifData[tag][0], exifData[tag][1], exifData[tag][2], exifData[tag][3]);
                                        break;
                                    case "ComponentsConfiguration":
                                        var compopents = "Components";
                                        exifData[tag] = Exif.StringValues[compopents][exifData[tag][0]] + Exif.StringValues[compopents][exifData[tag][1]] + Exif.StringValues[compopents][exifData[tag][2]] + Exif.StringValues[compopents][exifData[tag][3]];
                                        break;
                                    default:
                                        break;
                                }
                                tags[tag] = exifData[tag];
                            }
                        }
                    }
                    if (tags.GPSInfoIFDPointer) {
                        gpsData = Exif.readTags(file, tiffOffset, tiffOffset + tags.GPSInfoIFDPointer, Exif.GPSTags, bigEnd);
                        for (tag in gpsData) {
                            if ({}.hasOwnProperty.call(gpsData, tag)) {
                                switch (tag) {
                                    case "GPSVersionID":
                                        gpsData[tag] = gpsData[tag][0] + "." + gpsData[tag][1] + "." + gpsData[tag][2] + "." + gpsData[tag][3];
                                        break;
                                    default:
                                        break;
                                }
                                tags[tag] = gpsData[tag];
                            }
                        }
                    }
                    return tags;
                };
                Exif.getData = function (img, callback) {
                    if ((img instanceof Image || img instanceof HTMLImageElement) && !img.complete) {
                        return false;
                    }
                    if (!Exif.imageHasData(img)) {
                        Exif.getImageData(img, callback);
                    }
                    else {
                        if (callback) {
                            callback.call(img);
                        }
                    }
                    return true;
                };
                Exif.getTag = function (img, tag) {
                    if (!Exif.imageHasData(img)) {
                        return;
                    }
                    return img.exifdata[tag];
                };
                ;
                Exif.getAllTags = function (img) {
                    if (!Exif.imageHasData(img)) {
                        return {};
                    }
                    var a, data = img.exifdata, tags = {};
                    for (a in data) {
                        if (data.hasOwnProperty(a)) {
                            tags[a] = data[a];
                        }
                    }
                    return tags;
                };
                ;
                Exif.pretty = function (img) {
                    if (!Exif.imageHasData(img)) {
                        return "";
                    }
                    var a, data = img.exifdata, strPretty = "";
                    for (a in data) {
                        if (data.hasOwnProperty(a)) {
                            if (typeof data[a] === "object") {
                                if (data[a] instanceof Number) {
                                    strPretty += a + " : " + data[a] + " [" + data[a].numerator + "/" + data[a].denominator + "]\r\n";
                                }
                                else {
                                    strPretty += a + " : [" + data[a].length + " values]\r\n";
                                }
                            }
                            else {
                                strPretty += a + " : " + data[a] + "\r\n";
                            }
                        }
                    }
                    return strPretty;
                };
                Exif.readFromBinaryFile = function (file) {
                    return Exif.findEXIFinJPEG(file);
                };
                Exif.debug = false;
                Exif.IptcFieldMap = {
                    0x78: "caption",
                    0x6E: "credit",
                    0x19: "keywords",
                    0x37: "dateCreated",
                    0x50: "byline",
                    0x55: "bylineTitle",
                    0x7A: "captionWriter",
                    0x69: "headline",
                    0x74: "copyright",
                    0x0F: "category"
                };
                Exif.Tags = {
                    // version tags
                    0x9000: "ExifVersion",
                    0xA000: "FlashpixVersion",
                    // colorspace tags
                    0xA001: "ColorSpace",
                    // image configuration
                    0xA002: "PixelXDimension",
                    0xA003: "PixelYDimension",
                    0x9101: "ComponentsConfiguration",
                    0x9102: "CompressedBitsPerPixel",
                    // user information
                    0x927C: "MakerNote",
                    0x9286: "UserComment",
                    // related file
                    0xA004: "RelatedSoundFile",
                    // date and time
                    0x9003: "DateTimeOriginal",
                    0x9004: "DateTimeDigitized",
                    0x9290: "SubsecTime",
                    0x9291: "SubsecTimeOriginal",
                    0x9292: "SubsecTimeDigitized",
                    // picture-taking conditions
                    0x829A: "ExposureTime",
                    0x829D: "FNumber",
                    0x8822: "ExposureProgram",
                    0x8824: "SpectralSensitivity",
                    0x8827: "ISOSpeedRatings",
                    0x8828: "OECF",
                    0x9201: "ShutterSpeedValue",
                    0x9202: "ApertureValue",
                    0x9203: "BrightnessValue",
                    0x9204: "ExposureBias",
                    0x9205: "MaxApertureValue",
                    0x9206: "SubjectDistance",
                    0x9207: "MeteringMode",
                    0x9208: "LightSource",
                    0x9209: "Flash",
                    0x9214: "SubjectArea",
                    0x920A: "FocalLength",
                    0xA20B: "FlashEnergy",
                    0xA20C: "SpatialFrequencyResponse",
                    0xA20E: "FocalPlaneXResolution",
                    0xA20F: "FocalPlaneYResolution",
                    0xA210: "FocalPlaneResolutionUnit",
                    0xA214: "SubjectLocation",
                    0xA215: "ExposureIndex",
                    0xA217: "SensingMethod",
                    0xA300: "FileSource",
                    0xA301: "SceneType",
                    0xA302: "CFAPattern",
                    0xA401: "CustomRendered",
                    0xA402: "ExposureMode",
                    0xA403: "WhiteBalance",
                    0xA404: "DigitalZoomRation",
                    0xA405: "FocalLengthIn35mmFilm",
                    0xA406: "SceneCaptureType",
                    0xA407: "GainControl",
                    0xA408: "Contrast",
                    0xA409: "Saturation",
                    0xA40A: "Sharpness",
                    0xA40B: "DeviceSettingDescription",
                    0xA40C: "SubjectDistanceRange",
                    // other tags
                    0xA005: "InteroperabilityIFDPointer", 0xA420: "ImageUniqueID" // Identifier assigned uniquely to each image
                };
                Exif.TiffTags = {
                    0x0100: "ImageWidth",
                    0x0101: "ImageHeight",
                    0x8769: "ExifIFDPointer",
                    0x8825: "GPSInfoIFDPointer",
                    0xA005: "InteroperabilityIFDPointer",
                    0x0102: "BitsPerSample",
                    0x0103: "Compression",
                    0x0106: "PhotometricInterpretation",
                    0x0112: "Orientation",
                    0x0115: "SamplesPerPixel",
                    0x011C: "PlanarConfiguration",
                    0x0212: "YCbCrSubSampling",
                    0x0213: "YCbCrPositioning",
                    0x011A: "XResolution",
                    0x011B: "YResolution",
                    0x0128: "ResolutionUnit",
                    0x0111: "StripOffsets",
                    0x0116: "RowsPerStrip",
                    0x0117: "StripByteCounts",
                    0x0201: "JPEGInterchangeFormat",
                    0x0202: "JPEGInterchangeFormatLength",
                    0x012D: "TransferFunction",
                    0x013E: "WhitePoint",
                    0x013F: "PrimaryChromaticities",
                    0x0211: "YCbCrCoefficients",
                    0x0214: "ReferenceBlackWhite",
                    0x0132: "DateTime",
                    0x010E: "ImageDescription",
                    0x010F: "Make",
                    0x0110: "Model",
                    0x0131: "Software",
                    0x013B: "Artist",
                    0x8298: "Copyright"
                };
                Exif.GPSTags = {
                    0x0000: "GPSVersionID",
                    0x0001: "GPSLatitudeRef",
                    0x0002: "GPSLatitude",
                    0x0003: "GPSLongitudeRef",
                    0x0004: "GPSLongitude",
                    0x0005: "GPSAltitudeRef",
                    0x0006: "GPSAltitude",
                    0x0007: "GPSTimeStamp",
                    0x0008: "GPSSatellites",
                    0x0009: "GPSStatus",
                    0x000A: "GPSMeasureMode",
                    0x000B: "GPSDOP",
                    0x000C: "GPSSpeedRef",
                    0x000D: "GPSSpeed",
                    0x000E: "GPSTrackRef",
                    0x000F: "GPSTrack",
                    0x0010: "GPSImgDirectionRef",
                    0x0011: "GPSImgDirection",
                    0x0012: "GPSMapDatum",
                    0x0013: "GPSDestLatitudeRef",
                    0x0014: "GPSDestLatitude",
                    0x0015: "GPSDestLongitudeRef",
                    0x0016: "GPSDestLongitude",
                    0x0017: "GPSDestBearingRef",
                    0x0018: "GPSDestBearing",
                    0x0019: "GPSDestDistanceRef",
                    0x001A: "GPSDestDistance",
                    0x001B: "GPSProcessingMethod",
                    0x001C: "GPSAreaInformation",
                    0x001D: "GPSDateStamp",
                    0x001E: "GPSDifferential"
                };
                Exif.StringValues = {
                    ExposureProgram: {
                        0: "Not defined",
                        1: "Manual",
                        2: "Normal program",
                        3: "Aperture priority",
                        4: "Shutter priority",
                        5: "Creative program",
                        6: "Action program",
                        7: "Portrait mode",
                        8: "Landscape mode"
                    }, MeteringMode: {
                        0: "Unknown",
                        1: "Average",
                        2: "CenterWeightedAverage",
                        3: "Spot",
                        4: "MultiSpot",
                        5: "Pattern",
                        6: "Partial",
                        255: "Other"
                    }, LightSource: {
                        0: "Unknown",
                        1: "Daylight",
                        2: "Fluorescent",
                        3: "Tungsten (incandescent light)",
                        4: "Flash",
                        9: "Fine weather",
                        10: "Cloudy weather",
                        11: "Shade",
                        12: "Daylight fluorescent (D 5700 - 7100K)",
                        13: "Day white fluorescent (N 4600 - 5400K)",
                        14: "Cool white fluorescent (W 3900 - 4500K)",
                        15: "White fluorescent (WW 3200 - 3700K)",
                        17: "Standard light A",
                        18: "Standard light B",
                        19: "Standard light C",
                        20: "D55",
                        21: "D65",
                        22: "D75",
                        23: "D50",
                        24: "ISO studio tungsten",
                        255: "Other"
                    }, Flash: {
                        0x0000: "Flash did not fire",
                        0x0001: "Flash fired",
                        0x0005: "Strobe return light not detected",
                        0x0007: "Strobe return light detected",
                        0x0009: "Flash fired, compulsory flash mode",
                        0x000D: "Flash fired, compulsory flash mode, return light not detected",
                        0x000F: "Flash fired, compulsory flash mode, return light detected",
                        0x0010: "Flash did not fire, compulsory flash mode",
                        0x0018: "Flash did not fire, auto mode",
                        0x0019: "Flash fired, auto mode",
                        0x001D: "Flash fired, auto mode, return light not detected",
                        0x001F: "Flash fired, auto mode, return light detected",
                        0x0020: "No flash function",
                        0x0041: "Flash fired, red-eye reduction mode",
                        0x0045: "Flash fired, red-eye reduction mode, return light not detected",
                        0x0047: "Flash fired, red-eye reduction mode, return light detected",
                        0x0049: "Flash fired, compulsory flash mode, red-eye reduction mode",
                        0x004D: "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
                        0x004F: "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
                        0x0059: "Flash fired, auto mode, red-eye reduction mode",
                        0x005D: "Flash fired, auto mode, return light not detected, red-eye reduction mode",
                        0x005F: "Flash fired, auto mode, return light detected, red-eye reduction mode"
                    }, SensingMethod: {
                        1: "Not defined",
                        2: "One-chip color area sensor",
                        3: "Two-chip color area sensor",
                        4: "Three-chip color area sensor",
                        5: "Color sequential area sensor",
                        7: "Trilinear sensor",
                        8: "Color sequential linear sensor"
                    }, SceneCaptureType: {
                        0: "Standard", 1: "Landscape", 2: "Portrait", 3: "Night scene"
                    }, SceneType: {
                        1: "Directly photographed"
                    }, CustomRendered: {
                        0: "Normal process", 1: "Custom process"
                    }, WhiteBalance: {
                        0: "Auto white balance", 1: "Manual white balance"
                    }, GainControl: {
                        0: "None", 1: "Low gain up", 2: "High gain up", 3: "Low gain down", 4: "High gain down"
                    }, Contrast: {
                        0: "Normal", 1: "Soft", 2: "Hard"
                    }, Saturation: {
                        0: "Normal", 1: "Low saturation", 2: "High saturation"
                    }, Sharpness: {
                        0: "Normal", 1: "Soft", 2: "Hard"
                    }, SubjectDistanceRange: {
                        0: "Unknown", 1: "Macro", 2: "Close view", 3: "Distant view"
                    }, FileSource: {
                        3: "DSC"
                    },
                    Components: {
                        0: "", 1: "Y", 2: "Cb", 3: "Cr", 4: "R", 5: "G", 6: "B"
                    }
                };
                return Exif;
            }());
            exports_13("Exif", Exif);
        }
    }
});
System.register("src/imageCropperComponent", ["@angular/core", "src/imageCropper", "src/cropperSettings", "src/exif"], function(exports_14, context_14) {
    "use strict";
    var __moduleName = context_14 && context_14.id;
    var core_1, imageCropper_1, cropperSettings_2, exif_1;
    var ImageCropperComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (imageCropper_1_1) {
                imageCropper_1 = imageCropper_1_1;
            },
            function (cropperSettings_2_1) {
                cropperSettings_2 = cropperSettings_2_1;
            },
            function (exif_1_1) {
                exif_1 = exif_1_1;
            }],
        execute: function() {
            ImageCropperComponent = (function (_super) {
                __extends(ImageCropperComponent, _super);
                function ImageCropperComponent(renderer) {
                    _super.call(this);
                    this.onCrop = new core_1.EventEmitter();
                    this.renderer = renderer;
                }
                ImageCropperComponent.prototype.ngAfterViewInit = function () {
                    var canvas = this.cropcanvas.nativeElement;
                    if (!this.settings) {
                        this.settings = new cropperSettings_2.CropperSettings();
                    }
                    this.renderer.setElementAttribute(canvas, "width", this.settings.canvasWidth.toString());
                    this.renderer.setElementAttribute(canvas, "height", this.settings.canvasHeight.toString());
                    if (!this.cropper) {
                        this.cropper = new imageCropper_1.ImageCropper(this.settings);
                    }
                    this.cropper.prepare(canvas);
                };
                ImageCropperComponent.prototype.onTouchMove = function (event) {
                    this.cropper.onTouchMove(event);
                };
                ImageCropperComponent.prototype.onTouchStart = function (event) {
                    this.cropper.onTouchStart(event);
                };
                ImageCropperComponent.prototype.onTouchEnd = function (event) {
                    this.cropper.onTouchEnd(event);
                    if (this.cropper.isImageSet()) {
                        var bounds = this.cropper.getCropBounds();
                        this.image.image = this.cropper.getCroppedImage().src;
                        this.settings.cropWidth = bounds.right - bounds.left;
                        this.settings.cropHeight = bounds.bottom - bounds.top;
                        this.onCrop.emit(bounds);
                    }
                };
                ImageCropperComponent.prototype.onMouseDown = function () {
                    this.cropper.onMouseDown();
                };
                ImageCropperComponent.prototype.onMouseUp = function () {
                    if (this.cropper.isImageSet()) {
                        var bounds = this.cropper.getCropBounds();
                        this.cropper.onMouseUp();
                        this.image.image = this.cropper.getCroppedImage().src;
                        this.settings.cropWidth = bounds.right - bounds.left;
                        this.settings.cropHeight = bounds.bottom - bounds.top;
                        this.onCrop.emit(bounds);
                    }
                };
                ImageCropperComponent.prototype.onMouseMove = function (event) {
                    this.cropper.onMouseMove(event);
                };
                ImageCropperComponent.prototype.fileChangeListener = function ($event) {
                    var file = $event.target.files[0];
                    if (this.settings.allowedFilesRegex.test(file.name)) {
                        var image_1 = new Image();
                        var fileReader = new FileReader();
                        var that_1 = this;
                        fileReader.addEventListener("loadend", function (loadEvent) {
                            image_1.src = loadEvent.target.result;
                            that_1.setImage(image_1);
                        });
                        fileReader.readAsDataURL(file);
                    }
                };
                ImageCropperComponent.prototype.setImage = function (image) {
                    var self = this;
                    this.intervalRef = window.setInterval(function () {
                        if (this.intervalRef) {
                            clearInterval(this.intervalRef);
                        }
                        if (image.naturalHeight > 0) {
                            image.height = image.naturalHeight;
                            image.width = image.naturalWidth;
                            clearInterval(self.intervalRef);
                            self.getOrientedImage(image, function (img) {
                                self.cropper.setImage(img);
                                self.image.original = img;
                                var bounds = self.cropper.getCropBounds();
                                self.image.image = self.cropper.getCroppedImage().src;
                                self.settings.cropWidth = bounds.right - bounds.left;
                                self.settings.cropHeight = bounds.bottom - bounds.top;
                                self.onCrop.emit(bounds);
                            });
                        }
                    }, 10);
                };
                ImageCropperComponent.prototype.getOrientedImage = function (image, callback) {
                    var img;
                    exif_1.Exif.getData(image, function () {
                        var orientation = exif_1.Exif.getTag(image, "Orientation");
                        if ([3, 6, 8].indexOf(orientation) > -1) {
                            var canvas = document.createElement("canvas"), ctx = canvas.getContext("2d"), cw = image.width, ch = image.height, cx = 0, cy = 0, deg = 0;
                            switch (orientation) {
                                case 3:
                                    cx = -image.width;
                                    cy = -image.height;
                                    deg = 180;
                                    break;
                                case 6:
                                    cw = image.height;
                                    ch = image.width;
                                    cy = -image.height;
                                    deg = 90;
                                    break;
                                case 8:
                                    cw = image.height;
                                    ch = image.width;
                                    cx = -image.width;
                                    deg = 270;
                                    break;
                                default:
                                    break;
                            }
                            canvas.width = cw;
                            canvas.height = ch;
                            ctx.rotate(deg * Math.PI / 180);
                            ctx.drawImage(image, cx, cy);
                            img = document.createElement("img");
                            img.width = cw;
                            img.height = ch;
                            img.src = canvas.toDataURL("image/png");
                        }
                        else {
                            img = image;
                        }
                        callback(img);
                    });
                };
                __decorate([
                    core_1.ViewChild("cropcanvas", undefined), 
                    __metadata('design:type', core_1.ElementRef)
                ], ImageCropperComponent.prototype, "cropcanvas", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', cropperSettings_2.CropperSettings)
                ], ImageCropperComponent.prototype, "settings", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], ImageCropperComponent.prototype, "image", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', imageCropper_1.ImageCropper)
                ], ImageCropperComponent.prototype, "cropper", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], ImageCropperComponent.prototype, "onCrop", void 0);
                ImageCropperComponent = __decorate([
                    core_1.Component({
                        selector: "img-cropper", template: "\n    <span class=\"ng2-imgcrop\">\n      <input *ngIf=\"!settings.noFileInput\" type=\"file\" (change)=\"fileChangeListener($event)\" >\n      <canvas #cropcanvas\n              (mousedown)=\"onMouseDown($event)\"\n              (mouseup)=\"onMouseUp($event)\"\n              (mousemove)=\"onMouseMove($event)\"\n              (mouseleave)=\"onMouseUp($event)\"\n              (touchmove)=\"onTouchMove($event)\"\n              (touchend)=\"onTouchEnd($event)\"\n              (touchstart)=\"onTouchStart($event)\">\n      </canvas>\n    </span>\n  "
                    }), 
                    __metadata('design:paramtypes', [core_1.Renderer])
                ], ImageCropperComponent);
                return ImageCropperComponent;
            }(core_1.Type));
            exports_14("ImageCropperComponent", ImageCropperComponent);
        }
    }
});
System.register("src/imageCropperModule", ['@angular/common', '@angular/core', "src/imageCropperComponent"], function(exports_15, context_15) {
    "use strict";
    var __moduleName = context_15 && context_15.id;
    var common_1, core_2, imageCropperComponent_1;
    var ImageCropperModule;
    return {
        setters:[
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (core_2_1) {
                core_2 = core_2_1;
            },
            function (imageCropperComponent_1_1) {
                imageCropperComponent_1 = imageCropperComponent_1_1;
            }],
        execute: function() {
            ImageCropperModule = (function () {
                function ImageCropperModule() {
                }
                ImageCropperModule = __decorate([
                    core_2.NgModule({
                        imports: [common_1.CommonModule],
                        declarations: [imageCropperComponent_1.ImageCropperComponent],
                        exports: [imageCropperComponent_1.ImageCropperComponent]
                    }), 
                    __metadata('design:paramtypes', [])
                ], ImageCropperModule);
                return ImageCropperModule;
            }());
            exports_15("ImageCropperModule", ImageCropperModule);
        }
    }
});
System.register("index", ["src/imageCropperModule", "src/imageCropperComponent", "src/imageCropper", "src/cropperSettings", "src/cropperDrawSettings", "src/model/bounds"], function(exports_16, context_16) {
    "use strict";
    var __moduleName = context_16 && context_16.id;
    return {
        setters:[
            function (imageCropperModule_1_1) {
                exports_16({
                    "ImageCropperModule": imageCropperModule_1_1["ImageCropperModule"]
                });
            },
            function (imageCropperComponent_2_1) {
                exports_16({
                    "ImageCropperComponent": imageCropperComponent_2_1["ImageCropperComponent"]
                });
            },
            function (imageCropper_2_1) {
                exports_16({
                    "ImageCropper": imageCropper_2_1["ImageCropper"]
                });
            },
            function (cropperSettings_3_1) {
                exports_16({
                    "CropperSettings": cropperSettings_3_1["CropperSettings"]
                });
            },
            function (cropperDrawSettings_2_1) {
                exports_16({
                    "CropperDrawSettings": cropperDrawSettings_2_1["CropperDrawSettings"]
                });
            },
            function (bounds_2_1) {
                exports_16({
                    "Bounds": bounds_2_1["Bounds"]
                });
            }],
        execute: function() {
        }
    }
});
System.register("runtime/app", ['@angular/core', "index"], function(exports_17, context_17) {
    "use strict";
    var __moduleName = context_17 && context_17.id;
    var core_3, index_1;
    var AppComponent;
    return {
        setters:[
            function (core_3_1) {
                core_3 = core_3_1;
            },
            function (index_1_1) {
                index_1 = index_1_1;
            }],
        execute: function() {
            AppComponent = (function (_super) {
                __extends(AppComponent, _super);
                function AppComponent() {
                    _super.call(this);
                    this.cropperSettings1 = new index_1.CropperSettings();
                    this.cropperSettings1.width = 200;
                    this.cropperSettings1.height = 200;
                    this.cropperSettings1.croppedWidth = 200;
                    this.cropperSettings1.croppedHeight = 200;
                    this.cropperSettings1.canvasWidth = 500;
                    this.cropperSettings1.canvasHeight = 300;
                    this.cropperSettings1.minWidth = 100;
                    this.cropperSettings1.minHeight = 100;
                    this.cropperSettings1.rounded = false;
                    this.cropperSettings1.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
                    this.cropperSettings1.cropperDrawSettings.strokeWidth = 2;
                    this.cropperSettings1.keepAspect = false;
                    this.data1 = {};
                    //Cropper settings 2
                    this.cropperSettings2 = new index_1.CropperSettings();
                    this.cropperSettings2.width = 200;
                    this.cropperSettings2.height = 200;
                    this.cropperSettings2.keepAspect = false;
                    this.cropperSettings2.croppedWidth = 200;
                    this.cropperSettings2.croppedHeight = 200;
                    this.cropperSettings2.canvasWidth = 500;
                    this.cropperSettings2.canvasHeight = 300;
                    this.cropperSettings2.minWidth = 100;
                    this.cropperSettings2.minHeight = 100;
                    this.cropperSettings2.rounded = true;
                    this.cropperSettings2.minWithRelativeToResolution = false;
                    this.cropperSettings2.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
                    this.cropperSettings2.cropperDrawSettings.strokeWidth = 2;
                    this.cropperSettings2.noFileInput = true;
                    this.data2 = {};
                }
                AppComponent.prototype.cropped = function (bounds) {
                    console.log(this);
                    //console.log(bounds);
                };
                /**
                 * Used to send image to second cropper
                 * @param $event
                 */
                AppComponent.prototype.fileChangeListener = function ($event) {
                    var image = new Image();
                    var file = $event.target.files[0];
                    var myReader = new FileReader();
                    var that = this;
                    myReader.addEventListener('loadend', function (loadEvent) {
                        image.src = loadEvent.target.result;
                        that.cropper.setImage(image);
                    });
                    myReader.readAsDataURL(file);
                };
                __decorate([
                    core_3.ViewChild('cropper', undefined), 
                    __metadata('design:type', index_1.ImageCropperComponent)
                ], AppComponent.prototype, "cropper", void 0);
                AppComponent = __decorate([
                    core_3.Component({
                        selector: 'test-app',
                        template: "\n<div class=\"page-header\">\n  <h1>angular2-img-cropper <small>samples</small></h1>\n</div>\n<tabset [pills]=\"false\" >\n    <tab title=\"Sample 1\" [disabled]=\"false\">\n        <div class=\"row\">\n        <div class=\"col-md-9\">\n            <h3>source</h3>\n            <img-cropper [image]=\"data1\" [settings]=\"cropperSettings1\" (onCrop)=\"cropped($event)\"></img-cropper>\n        </div>\n        <h3>result</h3>\n        <div class=\"col-md-3\">\n            <span *ngIf=\"data1.image\" >\n                <img [src]=\"data1.image\"\n                    [width]=\"cropperSettings1.cropWidth\"\n                    [height]=\"cropperSettings1.cropHeight\"\n                    style=\"max-width: 200px; height: auto;\">\n            </span>\n        </div>\n        </div>\n<h3>settings</h3>\n<pre>\n<code>\nthis.cropperSettings1 = new CropperSettings();\nthis.cropperSettings1.width = 200;\nthis.cropperSettings1.height = 200;\n\nthis.cropperSettings1.croppedWidth = 200;\nthis.cropperSettings1.croppedHeight = 200;\n\nthis.cropperSettings1.canvasWidth = 500;\nthis.cropperSettings1.canvasHeight = 300;\n\nthis.cropperSettings1.minWidth = 100;\nthis.cropperSettings1.minHeight = 100;\n\nthis.cropperSettings1.rounded = false;\n\nthis.cropperSettings1.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';\nthis.cropperSettings1.cropperDrawSettings.strokeWidth = 2;\n</code>\n</pre>\n    </tab>\n    <tab title=\"Sample 2\" [disabled]=\"false\">\n        <div class=\"row\">\n        <div class=\"col-md-9\">\n            <h3>source</h3>\n            <img-cropper #cropper [image]=\"data2\" [settings]=\"cropperSettings2\"></img-cropper>\n            <div>\n                <label class=\"btn btn-primary\">\n                    Upload\n                    <input id=\"file_input_file\" class=\"none\" type=\"file\" style=\"display: none;\" (change)=\"fileChangeListener($event)\"/>\n                </label>\n            </div>\n        </div>\n        <h3>result</h3>\n        <div class=\"col-md-3\">\n            <span *ngIf=\"data2.image\" >\n              <img [src]=\"data2.image\" [width]=\"cropperSettings2.croppedWidth\" [height]=\"cropperSettings2.croppedHeight\" style=\"border-radius: 100px\">\n            </span>\n        </div>\n        </div>\n<h3>settings</h3>\n<pre>\n<code>\nthis.cropperSettings2 = new CropperSettings();\nthis.cropperSettings2.width = 200;\nthis.cropperSettings2.height = 200;\nthis.cropperSettings2.keepAspect = false;\n\nthis.cropperSettings2.croppedWidth = 200;\nthis.cropperSettings2.croppedHeight = 200;\n\nthis.cropperSettings2.canvasWidth = 500;\nthis.cropperSettings2.canvasHeight = 300;\n\nthis.cropperSettings2.minWidth = 100;\nthis.cropperSettings2.minHeight = 100;\n\nthis.cropperSettings2.rounded = true;\nthis.cropperSettings2.minWithRelativeToResolution = false;\n\nthis.cropperSettings2.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';\nthis.cropperSettings2.cropperDrawSettings.strokeWidth = 2;\nthis.cropperSettings2.noFileInput = true;\n</code>\n</pre>\n\n    </tab>\n</tabset>    \n    "
                    }), 
                    __metadata('design:paramtypes', [])
                ], AppComponent);
                return AppComponent;
            }(core_3.Type));
            exports_17("AppComponent", AppComponent);
        }
    }
});
System.register("runtime/app.module", ['@angular/core', '@angular/platform-browser', "index", 'rxjs/Rx', "runtime/app", "ng2-tabs"], function(exports_18, context_18) {
    "use strict";
    var __moduleName = context_18 && context_18.id;
    var core_4, platform_browser_1, index_2, app_1, ng2_tabs_1;
    var AppModule;
    return {
        setters:[
            function (core_4_1) {
                core_4 = core_4_1;
            },
            function (platform_browser_1_1) {
                platform_browser_1 = platform_browser_1_1;
            },
            function (index_2_1) {
                index_2 = index_2_1;
            },
            function (_1) {},
            function (app_1_1) {
                app_1 = app_1_1;
            },
            function (ng2_tabs_1_1) {
                ng2_tabs_1 = ng2_tabs_1_1;
            }],
        execute: function() {
            AppModule = (function () {
                function AppModule() {
                }
                AppModule = __decorate([
                    core_4.NgModule({
                        imports: [platform_browser_1.BrowserModule, ng2_tabs_1.TabsModule],
                        declarations: [
                            app_1.AppComponent, index_2.ImageCropperComponent
                        ],
                        bootstrap: [app_1.AppComponent]
                    }), 
                    __metadata('design:paramtypes', [])
                ], AppModule);
                return AppModule;
            }());
            exports_18("AppModule", AppModule);
        }
    }
});
System.register("runtime/main", ['@angular/platform-browser-dynamic', "runtime/app.module"], function(exports_19, context_19) {
    "use strict";
    var __moduleName = context_19 && context_19.id;
    var platform_browser_dynamic_1, app_module_1;
    return {
        setters:[
            function (platform_browser_dynamic_1_1) {
                platform_browser_dynamic_1 = platform_browser_dynamic_1_1;
            },
            function (app_module_1_1) {
                app_module_1 = app_module_1_1;
            }],
        execute: function() {
            platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule);
        }
    }
});
//# sourceMappingURL=img-cropper-test-app.js.map