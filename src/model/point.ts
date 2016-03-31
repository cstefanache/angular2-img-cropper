export class Point {

  public x:number;
  public y:number;

  private _next: Point;
  private _prev: Point;


  constructor(x?:number, y?:number) {
    this.x = x;
    this.y = y;
  }

  getNext():Point { return this._next; }
  setNext(p:Point) { this._next = p; }

  getPrev():Point { return this._prev; }
  setPrev(p:Point) { this._prev = p; }


}
