let radius = 10;
let radius2 = 15;
let prevMouseX = 0
let prevMouseY = 0;
let s1, s2;
let activeSegment;

let segments = [];
let points = [];
let type = [];
var gx=0, gy=0;
function setup() {
    createCanvas(400, 400);

}

function draw() {
    background(245);
    for(let s of segments) {
        s.draw();
    }
    for (var i =0; i < points.length; i++) {
        strokeWeight(0);
        fill(50+50*type[i],100,200);
        // console.log(type[i]);
        ellipse(points[i].x,points[i].y,10,10);
    }

    ellipse(gx, gy,10,10);
}

function mousePressed(){
    segments = [];
    prevMouseX = mouseX;
    prevMouseY = mouseY;
}

function mouseDragged(){
    segments.push(new Segment(prevMouseX, prevMouseY, mouseX, mouseY));
    prevMouseX = mouseX;
    prevMouseY = mouseY;
}
function mouseReleased(){
    points = [];
    type = [];
    let len = segments.length;
    segments.push(new Segment(segments[0].x1, segments[0].y1, segments[len-1].x2, segments[len-1].y2));
    let idx = [0, int(segments.length/4), int(segments.length/2), int(segments.length/4) * 3, segments.length-1];
    
    for(var i =0; i < segments.length; i++){
        gx += segments[i].x1;
        gy += segments[i].y1;
    }
    gx /= segments.length;
    gy /= segments.length;
    // console.log(gx, gy);

    for(var i = 0; i < 4; i++){
        for(var k = idx[i]; k < idx[i+1]; k++){
            let v = createVector(segments[k].x1 - gx,  segments[k].y1 - gy);
            v = v.normalize();
            // vx /= sqrt(vx*vx + vy*vy);
            // vy /= sqrt(vx*vx + vy*vy);
            let normal = segments[k].getNormal();
            normal = normal.normalize();
            let norm = abs(v.x*normal.x, v.y*normal.y);
            // console.log(normal);
            // console.log(vx, vy);
            // console.log(norm);
            if(norm >0.7){
                points.push(createVector(segments[k].x1, segments[k].y1));
                type.push(i);
            }
            if(norm <0.1){
                points.push(createVector(segments[k].x1, segments[k].y1));
                type.push(i);
            }

            
            console.log(i);
        }
    }
    
}