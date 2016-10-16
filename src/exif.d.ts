export declare class Fraction extends Number {
    numerator: number;
    denominator: number;
}
export interface IImageExtended extends HTMLImageElement {
    exifdata: any;
    iptcdata: any;
}
export declare class Debug {
    static log(...args: any[]): void;
}
export declare class Exif {
    static debug: boolean;
    static IptcFieldMap: any;
    static Tags: any;
    static TiffTags: any;
    static GPSTags: any;
    static StringValues: any;
    static addEvent(element: EventTarget | any, event: string, handler: EventListener): void;
    static imageHasData(img: IImageExtended): boolean;
    static base64ToArrayBuffer(base64: string, contentType?: string): ArrayBuffer;
    static objectURLToBlob(url: string, callback: Function): void;
    static getImageData(img: IImageExtended | Blob | File, callback: Function): void;
    static findEXIFinJPEG(file: ArrayBuffer): any;
    static findIPTCinJPEG(file: ArrayBuffer): any;
    static readIPTCData(file: ArrayBuffer, startOffset: number, sectionLength: number): any;
    static readTags(file: DataView, tiffStart: number, dirStart: number, strings: string[], bigEnd: boolean): Object;
    static readTagValue(file: any, entryOffset: number, tiffStart: number, dirStart: number, bigEnd: boolean): any;
    static getStringFromDB(buffer: DataView, start: number, length: number): string;
    static readEXIFData(file: DataView, start: number): any;
    static getData(img: IImageExtended | HTMLImageElement, callback: Function): boolean;
    static getTag(img: any, tag: string): any;
    static getAllTags(img: any): any;
    static pretty(img: IImageExtended): string;
    static readFromBinaryFile(file: ArrayBuffer): any;
}
