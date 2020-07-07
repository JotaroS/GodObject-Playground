// segment.js
// Author: Jotaro Shigeyama
// MIT License

class Segment{
    //line parametrized expression: y = ax + b;
    constructor(_x1, _y1, _x2, _y2){
        this.x1 = _x1;
        this.y1 = _y1;
        this.x2 = _x2;
        this.y2 = _y2;
        this.isActive = false;
        this.m = (this.y1 - this.y2) / (this.x1 - this.x2);//TODO:handle exception
        this.n = this.y2 - this.m * this.x2;

        // generalized form <<ax + by + c = 0>>
        this.a = this.m;
        this.b = -1;
        this.c = this.n;

        //x = c form
        if(this.x1 == this.x2){
            this.a =1;
            this.b =0;
            this.c = -this.x1;
        }

        this.p1 = createVector(_x1, _y1);
        this.p2 = createVector(_x2, _y2);
    }
    _f(p1, p2, p3){
        return (p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x)
    }

    isPointOutOfSegment(p){
        return(this._f(this.p1, this.p2, p)<=0.0);
    }

    isIntersecting(otherSegment){
        let p1 = this.p1;
        let p2 = this.p2;
        let p3 = otherSegment.p1;
        let p4 = otherSegment.p2;

        let t1 = this._f(p1, p2, p3);
        let t2 = this._f(p1, p2, p4);
        let t3 = this._f(p3, p4, p1);
        let t4 = this._f(p3, p4, p2);

        return (t1 * t2 <= 0.0 && t3 * t4 <= 0.0);
    }
    distanceTo(pointVector){
        let d = Math.abs(this.a * pointVector.x + this.b * pointVector.y + this.c) 
                / Math.sqrt(this.a * this.a + this.b * this.b);
        return d;
    }
    
    setActive(active){
        this.isActive = active;
    }

    isActive(){
        return this.isActive;
    }

    getNormal(){
        return createVector(this.x2-this.x1, this.y2-this.y1).rotate(-HALF_PI);
    }

    magnitude(){
        return Math.sqrt()
    }

    draw(){
        strokeWeight(2);
        if(this.isActive)stroke(0,0,255);
        else stroke(0);
        line(this.x1, this.y1, this.x2, this.y2);
    }
}
