import {Point} from './point';

export class PointPool {

   private static _instance:PointPool;

   private borrowed:number;
   private firstAvailable:Point;

   constructor(initialSize) {
     PointPool._instance = this;
     var prev = null;
     for (var i = 0; i < initialSize; i++) {
         if (i === 0) {
             this.firstAvailable = new Point();
             prev = this.firstAvailable;
         }
         else {
             var p = new Point();
             prev.setNext(p);
             prev = p;
         }
     }
   }

   static get instance():PointPool {
     return PointPool._instance;
   }

   public borrow(x, y):Point {
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

   public returnPoint(p:Point) {
       this.borrowed--;
       p.x = 0;
       p.y = 0;
       p.setNext(this.firstAvailable);
       this.firstAvailable = p;
   };
}
