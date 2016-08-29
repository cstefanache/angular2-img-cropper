export declare class Exif {
    private static debug;
    static IptcFieldMap: Object;
    static Tags: Object;
    static TiffTags: Object;
    static GPSTags: Object;
    static StringValues: Object;
    static addEvent(element: any, event: any, handler: any): void;
    static imageHasData(img: any): boolean;
    static base64ToArrayBuffer(base64: any, contentType?: any): ArrayBuffer;
    static objectURLToBlob(url: any, callback: any): void;
    static getImageData(img: any, callback: any): void;
    static findEXIFinJPEG(file: any): any;
    static findIPTCinJPEG(file: any): {};
    static readIPTCData(file: any, startOffset: any, sectionLength: any): {};
    static readTags(file: any, tiffStart: any, dirStart: any, strings: any, bigEnd: any): {};
    static readTagValue(file: any, entryOffset: any, tiffStart: any, dirStart: any, bigEnd: any): any;
    static getStringFromDB(buffer: any, start: any, length: any): string;
    static readEXIFData(file: any, start: any): any;
    static getData(img: any, callback: Function): boolean;
    static getTag(img: any, tag: any): any;
    static getAllTags(img: any): {};
    static pretty(img: any): string;
    readFromBinaryFile(file: any): any;
}
