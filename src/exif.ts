export class Fraction extends Number {
    numerator: number;
    denominator: number;
}


export interface IImageExtended extends HTMLImageElement {
    exifdata: any;
    iptcdata: any;
}

// Console debug wrapper that makes code looks a little bit cleaner
export class Debug {
    public static log(...args: any[]) {
        if (Exif.debug) {
            console.log(args);
        }
    }
}

export class Exif {

    public static debug: boolean = false;

    public static IptcFieldMap: any = {
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

    public static Tags: any = {

        // version tags
        0x9000: "ExifVersion",             // EXIF version
        0xA000: "FlashpixVersion",         // Flashpix format version

        // colorspace tags
        0xA001: "ColorSpace",              // Color space information tag

        // image configuration
        0xA002: "PixelXDimension",         // Valid width of meaningful image
        0xA003: "PixelYDimension",         // Valid height of meaningful image
        0x9101: "ComponentsConfiguration", // Information about channels
        0x9102: "CompressedBitsPerPixel",  // Compressed bits per pixel

        // user information
        0x927C: "MakerNote",               // Any desired information written by the manufacturer
        0x9286: "UserComment",             // Comments by user

        // related file
        0xA004: "RelatedSoundFile",        // Name of related sound file

        // date and time
        0x9003: "DateTimeOriginal",        // Date and time when the original image was generated
        0x9004: "DateTimeDigitized",       // Date and time when the image was stored digitally
        0x9290: "SubsecTime",              // Fractions of seconds for DateTime
        0x9291: "SubsecTimeOriginal",      // Fractions of seconds for DateTimeOriginal
        0x9292: "SubsecTimeDigitized",     // Fractions of seconds for DateTimeDigitized

        // picture-taking conditions
        0x829A: "ExposureTime",            // Exposure time (in seconds)
        0x829D: "FNumber",                 // F number
        0x8822: "ExposureProgram",         // Exposure program
        0x8824: "SpectralSensitivity",     // Spectral sensitivity
        0x8827: "ISOSpeedRatings",         // ISO speed rating
        0x8828: "OECF",                    // Optoelectric conversion factor
        0x9201: "ShutterSpeedValue",       // Shutter speed
        0x9202: "ApertureValue",           // Lens aperture
        0x9203: "BrightnessValue",         // Value of brightness
        0x9204: "ExposureBias",            // Exposure bias
        0x9205: "MaxApertureValue",        // Smallest F number of lens
        0x9206: "SubjectDistance",         // Distance to subject in meters
        0x9207: "MeteringMode",            // Metering mode
        0x9208: "LightSource",             // Kind of light source
        0x9209: "Flash",                   // Flash status
        0x9214: "SubjectArea",             // Location and area of main subject
        0x920A: "FocalLength",             // Focal length of the lens in mm
        0xA20B: "FlashEnergy",             // Strobe energy in BCPS
        0xA20C: "SpatialFrequencyResponse",    //
        0xA20E: "FocalPlaneXResolution",   // Number of pixels in width direction per FocalPlaneResolutionUnit
        0xA20F: "FocalPlaneYResolution",   // Number of pixels in height direction per FocalPlaneResolutionUnit
        0xA210: "FocalPlaneResolutionUnit",    // Unit for measuring FocalPlaneXResolution and FocalPlaneYResolution
        0xA214: "SubjectLocation",         // Location of subject in image
        0xA215: "ExposureIndex",           // Exposure index selected on camera
        0xA217: "SensingMethod",           // Image sensor type
        0xA300: "FileSource",              // Image source (3 == DSC)
        0xA301: "SceneType",               // Scene type (1 == directly photographed)
        0xA302: "CFAPattern",              // Color filter array geometric pattern
        0xA401: "CustomRendered",          // Special processing
        0xA402: "ExposureMode",            // Exposure mode
        0xA403: "WhiteBalance",            // 1 = auto white balance, 2 = manual
        0xA404: "DigitalZoomRation",       // Digital zoom ratio
        0xA405: "FocalLengthIn35mmFilm",   // Equivalent foacl length assuming 35mm film camera (in mm)
        0xA406: "SceneCaptureType",        // Type of scene
        0xA407: "GainControl",             // Degree of overall image gain adjustment
        0xA408: "Contrast",                // Direction of contrast processing applied by camera
        0xA409: "Saturation",              // Direction of saturation processing applied by camera
        0xA40A: "Sharpness",               // Direction of sharpness processing applied by camera
        0xA40B: "DeviceSettingDescription",    //
        0xA40C: "SubjectDistanceRange",    // Distance to subject

        // other tags
        0xA005: "InteroperabilityIFDPointer", 0xA420: "ImageUniqueID"  // Identifier assigned uniquely to each image
    };

    public static TiffTags: any = {
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

    public static GPSTags: any = {
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

    public static StringValues: any = {
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

    public static addEvent(element: EventTarget | any, event: string, handler: EventListener) {
        if (element.addEventListener) {
            element.addEventListener(event, handler, false);
        } else {
            // Hello, IE!
            if (element.attachEvent) {
                element.attachEvent("on" + event, handler);
            }
        }
    }

    public static imageHasData(img: IImageExtended) {
        return !!(img.exifdata);
    }

    public static base64ToArrayBuffer(base64: string, contentType?: string): ArrayBuffer {
        // e.g. 'data:image/jpeg;base64,...' => 'image/jpeg'
        contentType = contentType || base64.match(/^data:([^;]+);base64,/mi)[1] || "";
        base64 = base64.replace(/^data:([^;]+);base64,/gmi, "");
        let binary: string = atob(base64);
        let len: number = binary.length;
        let buffer: ArrayBuffer = new ArrayBuffer(len);
        let view: Uint8Array = new Uint8Array(buffer);
        for (let i = 0; i < len; i++) {
            view[i] = binary.charCodeAt(i);
        }
        return buffer;
    }

    public static objectURLToBlob(url: string, callback: Function) {
        let http: XMLHttpRequest = new XMLHttpRequest();
        http.open("GET", url, true);
        http.responseType = "blob";
        http.onload = function () {
            if (this.status === 200 || this.status === 0) {
                callback(http.response);
            }
        };
        http.send();
    }

    public static getImageData(img: IImageExtended | Blob | File, callback: Function) {
        function handleBinaryFile(binFile: ArrayBuffer) {
            let data = Exif.findEXIFinJPEG(binFile);
            let iptcdata = Exif.findIPTCinJPEG(binFile);
            (img as IImageExtended).exifdata = data || {};
            (img as IImageExtended).iptcdata = iptcdata || {};
            if (callback) {
                callback.call(img);
            }
        }

        if ("src" in img && (img as IImageExtended).src) {
            if (/^data:/i.test((img as IImageExtended).src)) { // Data URI
                let arrayBuffer = Exif.base64ToArrayBuffer((img as IImageExtended).src);
                handleBinaryFile(arrayBuffer);
            } else {
                if (/^blob:/i.test((img as IImageExtended).src)) { // Object URL
                    let fileReader = new FileReader();
                    fileReader.onload = (e: any) => {
                        handleBinaryFile(e.target.result);
                    };
                    Exif.objectURLToBlob((img as IImageExtended).src, (blob: Blob) => {
                        fileReader.readAsArrayBuffer(blob);
                    });
                } else {
                    let http = new XMLHttpRequest();
                    http.onload = function () {
                        if (this.status === 200 || this.status === 0) {
                            handleBinaryFile(http.response);
                        } else {
                            throw "Could not load image";
                        }
                        http = null;
                    };
                    http.open("GET", (img as IImageExtended).src, true);
                    http.responseType = "arraybuffer";
                    http.send(null);
                }
            }
        } else {
            if (FileReader && (img instanceof Blob || img instanceof File)) {
                let fileReader = new FileReader();
                fileReader.onload = function (e: any) {
                    Debug.log("Got file of length " + e.target.result.byteLength);
                    handleBinaryFile(e.target.result);
                };

                fileReader.readAsArrayBuffer(img);
            }
        }
    }

    public static findEXIFinJPEG(file: ArrayBuffer) {
        let dataView = new DataView(file);

        Debug.log("Got file of length " + file.byteLength);
        if ((dataView.getUint8(0) !== 0xFF) || (dataView.getUint8(1) !== 0xD8)) {
            Debug.log("Not a valid JPEG");
            return false; // not a valid jpeg
        }

        let offset = 2;
        let length: number = file.byteLength;
        let marker: number;

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
                // offset += 2 + file.getShortAt(offset+2, true);

            } else {
                offset += 2 + dataView.getUint16(offset + 2);
            }
        }
    }

    public static findIPTCinJPEG(file: ArrayBuffer) {
        let dataView = new DataView(file);

        Debug.log("Got file of length " + file.byteLength);
        if ((dataView.getUint8(0) !== 0xFF) || (dataView.getUint8(1) !== 0xD8)) {
            Debug.log("Not a valid JPEG");
            return false; // not a valid jpeg
        }

        let offset = 2;
        let length = file.byteLength;

        let isFieldSegmentStart = function (_dataView: DataView, _offset: number) {
            return (
                _dataView.getUint8(_offset) === 0x38 && _dataView.getUint8(_offset + 1) === 0x42 && _dataView.getUint8(
                    _offset + 2) === 0x49 && _dataView.getUint8(_offset + 3) === 0x4D && _dataView.getUint8(
                    _offset + 4) === 0x04 && _dataView.getUint8(_offset + 5) === 0x04
            );
        };

        while (offset < length) {

            if (isFieldSegmentStart(dataView, offset)) {

                // Get the length of the name header (which is padded to an even number of bytes)
                let nameHeaderLength = dataView.getUint8(offset + 7);
                if (nameHeaderLength % 2 !== 0) {
                    nameHeaderLength += 1;
                }
                // Check for pre photoshop 6 format
                if (nameHeaderLength === 0) {
                    // Always 4
                    nameHeaderLength = 4;
                }

                let startOffset = offset + 8 + nameHeaderLength;
                let sectionLength = dataView.getUint16(offset + 6 + nameHeaderLength);

                return Exif.readIPTCData(file, startOffset, sectionLength);
            }

            // Not the marker, continue searching
            offset++;

        }

    }

    public static readIPTCData(file: ArrayBuffer, startOffset: number, sectionLength: number) {
        let dataView = new DataView(file);
        let data: any = {};
        let fieldValue: any, fieldName: string, dataSize: number, segmentType: any, segmentSize: number;
        let segmentStartPos = startOffset;
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
                        } else {
                            data[fieldName] = [data[fieldName], fieldValue];
                        }
                    } else {
                        data[fieldName] = fieldValue;
                    }
                }
            }
            segmentStartPos++;
        }
        return data;
    }

    public static readTags(file: DataView, tiffStart: number, dirStart: number, strings: string[],
                           bigEnd: boolean): Object {
        let entries: number = file.getUint16(dirStart, !bigEnd);
        let tags: any = {};
        let entryOffset: number;
        let tag: string;

        for (let i = 0; i < entries; i++) {
            entryOffset = dirStart + i * 12 + 2;
            tag = strings[file.getUint16(entryOffset, !bigEnd)];
            if (!tag) {
                Debug.log("Unknown tag: " + file.getUint16(entryOffset, !bigEnd));
            }
            tags[tag] = Exif.readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd);
        }
        return tags;
    }

    public static readTagValue(file: any, entryOffset: number, tiffStart: number, dirStart: number,
                               bigEnd: boolean): any {
        let type: number = file.getUint16(entryOffset + 2, !bigEnd);
        let numValues = file.getUint32(entryOffset + 4, !bigEnd);
        let valueOffset = file.getUint32(entryOffset + 8, !bigEnd) + tiffStart;
        let offset: number;
        let vals: any[], val: any, n: number;
        let numerator: any;
        let denominator: any;

        switch (type) {
            case 1: // byte, 8-bit unsigned int
            case 7: // undefined, 8-bit byte, value depending on field
                if (numValues === 1) {
                    return file.getUint8(entryOffset + 8, !bigEnd);
                } else {
                    offset = numValues > 4 ? valueOffset : (entryOffset + 8);
                    vals = [];
                    for (n = 0; n < numValues; n++) {
                        vals[n] = file.getUint8(offset + n);
                    }
                    return vals;
                }

            case 2: // ascii, 8-bit byte
                offset = numValues > 4 ? valueOffset : (entryOffset + 8);
                return Exif.getStringFromDB(file, offset, numValues - 1);

            case 3: // short, 16 bit int
                if (numValues === 1) {
                    return file.getUint16(entryOffset + 8, !bigEnd);
                } else {
                    offset = numValues > 2 ? valueOffset : (entryOffset + 8);
                    vals = [];
                    for (n = 0; n < numValues; n++) {
                        vals[n] = file.getUint16(offset + 2 * n, !bigEnd);
                    }
                    return vals;
                }

            case 4: // long, 32 bit int
                if (numValues === 1) {
                    return file.getUint32(entryOffset + 8, !bigEnd);
                } else {
                    vals = [];
                    for (n = 0; n < numValues; n++) {
                        vals[n] = file.getUint32(valueOffset + 4 * n, !bigEnd);
                    }
                    return vals;
                }

            case 5:    // rational = two long values, first is numerator, second is denominator
                if (numValues === 1) {
                    numerator = file.getUint32(valueOffset, !bigEnd);
                    denominator = file.getUint32(valueOffset + 4, !bigEnd);
                    val = new Fraction(numerator / denominator);
                    val.numerator = numerator;
                    val.denominator = denominator;
                    return val;
                } else {
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

            case 9: // slong, 32 bit signed int
                if (numValues === 1) {
                    return file.getInt32(entryOffset + 8, !bigEnd);
                } else {
                    vals = [];
                    for (n = 0; n < numValues; n++) {
                        vals[n] = file.getInt32(valueOffset + 4 * n, !bigEnd);
                    }
                    return vals;
                }

            case 10: // signed rational, two slongs, first is numerator, second is denominator
                if (numValues === 1) {
                    return file.getInt32(valueOffset, !bigEnd) / file.getInt32(valueOffset + 4, !bigEnd);
                } else {
                    vals = [];
                    for (n = 0; n < numValues; n++) {
                        vals[n] = file.getInt32(valueOffset + 8 * n, !bigEnd) / file.getInt32(valueOffset + 4 + 8 * n,
                                !bigEnd);
                    }
                    return vals;
                }
            default:
                break;
        }
    }

    public static getStringFromDB(buffer: DataView, start: number, length: number): string {
        let outstr = "";
        for (let n = start; n < start + length; n++) {
            outstr += String.fromCharCode(buffer.getUint8(n));
        }
        return outstr;
    }

    public static readEXIFData(file: DataView, start: number): any {
        if (Exif.getStringFromDB(file, start, 4) !== "Exif") {
            Debug.log("Not valid EXIF data! " + Exif.getStringFromDB(file, start, 4));

            return false;
        }

        let bigEnd: boolean, tags: any, tag: string, exifData: any, gpsData: any, tiffOffset: number = start + 6;

        // test for TIFF validity and endianness
        if (file.getUint16(tiffOffset) === 0x4949) {
            bigEnd = false;
        } else {
            if (file.getUint16(tiffOffset) === 0x4D4D) {
                bigEnd = true;
            } else {
                Debug.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)");
                return false;
            }
        }

        if (file.getUint16(tiffOffset + 2, !bigEnd) !== 0x002A) {
            Debug.log("Not valid TIFF data! (no 0x002A)");
            return false;
        }

        let firstIFDOffset = file.getUint32(tiffOffset + 4, !bigEnd);

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
                        case "LightSource" :
                        case "Flash" :
                        case "MeteringMode" :
                        case "ExposureProgram" :
                        case "SensingMethod" :
                        case "SceneCaptureType" :
                        case "SceneType" :
                        case "CustomRendered" :
                        case "WhiteBalance" :
                        case "GainControl" :
                        case "Contrast" :
                        case "Saturation" :
                        case "Sharpness" :
                        case "SubjectDistanceRange" :
                        case "FileSource" :
                            exifData[tag] = Exif.StringValues[tag][exifData[tag]];
                            break;
                        case "ExifVersion" :
                        case "FlashpixVersion" :
                            exifData[tag] = String.fromCharCode(exifData[tag][0], exifData[tag][1], exifData[tag][2],
                                exifData[tag][3]);
                            break;
                        case "ComponentsConfiguration" :
                            let compopents = "Components";
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
                        case "GPSVersionID" :
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
    }

    public static getData(img: IImageExtended | HTMLImageElement, callback: Function) {

        if ((img instanceof Image || img instanceof HTMLImageElement) && !img.complete) {
            return false;
        }

        if (!Exif.imageHasData((img as IImageExtended))) {
            Exif.getImageData((img as IImageExtended), callback);
        } else {
            if (callback) {
                callback.call(img);
            }
        }
        return true;
    }

    public static getTag(img: any, tag: string) {
        if (!Exif.imageHasData(img)) {
            return;
        }
        return img.exifdata[tag];
    };

    public static getAllTags(img: any) {
        if (!Exif.imageHasData(img)) {
            return {};
        }
        let a: string, data: any = img.exifdata, tags: any = {};
        for (a in data) {
            if (data.hasOwnProperty(a)) {
                tags[a] = data[a];
            }
        }
        return tags;
    };

    public static pretty(img: IImageExtended) {
        if (!Exif.imageHasData(img)) {
            return "";
        }
        let a: any, data: any = img.exifdata, strPretty = "";
        for (a in data) {
            if (data.hasOwnProperty(a)) {
                if (typeof data[a] === "object") {
                    if (data[a] instanceof Number) {
                        strPretty += `${a} : ${data[a]} [${data[a].numerator}/${data[a].denominator}]\r\n`;
                    } else {
                        strPretty += `${a} : [${data[a].length} values]\r\n`;
                    }
                } else {
                    strPretty += `${a} : ${data[a]}\r\n`;
                }
            }
        }
        return strPretty;
    }

    public static readFromBinaryFile(file: ArrayBuffer) {
        return Exif.findEXIFinJPEG(file);
    }
}
