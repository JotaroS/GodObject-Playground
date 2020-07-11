let radius = 10;
let radius2 = 15;
let prevMouseX = 0
let prevMouseY = 0;
let s1, s2;
let activeSegment;
function setup() {
    createCanvas(400, 400);
    s1 = new Segment(400/2 ,0 , 400 / 2, 400/2);
    s2 = new Segment(400 / 2, 400/2 ,400, 400/2);

    // UNCOMMENT HERE TO SEE DIFFERENT GEOMETRY
    // s1 = new Segment(0,400 / 2, 400 / 2, 400 / 2);
    // s2 = new Segment(400 / 2, 400 / 2,400, 400);

}

function collisionDetection(segments){
    for(let s of segments){
        mouseSegment = new Segment(mouseX, mouseY, prevMouseX, prevMouseY);
        if(s.isIntersecting(mouseSegment)){
            s.setActive(true);
            activeSegment = s;
            return;
        }
    }
}

function collisionUpdate(segments, objectPoint){
    for(let s of segments){
        let epsilon = createVector(objectPoint.x-mouseX, objectPoint.y-mouseY).normalize().mult(20);
        mouseSegment = new Segment(mouseX, mouseY, objectPoint.x+epsilon.x, objectPoint.y+epsilon.y);
        if(s.isIntersecting(mouseSegment)){
            s.setActive(true);
            return;
        }
    }
}

function updateCollisionPoint(godObjectPosition){
    let cornerPoint = createVector(width/2, height/2);
    mouseVector = createVector(mouseX, mouseY);
    // TODO: set collisionPoint to the corner
    if(s1.isPointInsideOfSegment(mouseVector) && s2.isPointInsideOfSegment(mouseVector)){
        return cornerPoint;
    }
    else return godObjectPosition;
}

function calculateCollisionPoint(segment){
    mouseVector = createVector(mouseX, mouseY);
    let d = segment.distanceTo(mouseVector);
    let mouseToCollisionPoint = segment.getNormal().mult(d);
    let collisionPoint = mouseVector.add(mouseToCollisionPoint);    
    return collisionPoint;
}


function calculateForce(godObjectPosition, pointOfMeHandle){
    let errVector = godObjectPosition.sub(pointOfMeHandle);
    let forceVector = errVector.mult(2.0);
    return forceVector;
}

function drawForce(sx, sy, tx, ty){
    strokeWeight(3);
    stroke(255, 0, 0);
    line(sx, sy, tx, ty);
    let arrayVector = createVector(tx, ty).sub(createVector(sx, sy));
    arrayVector.normalize();
    arrayVector.rotate(-HALF_PI*1.5);
    arrayVector.mult(10)
    line(tx, ty, tx+arrayVector.x, ty+arrayVector.y);
    arrayVector.rotate(+HALF_PI*1.5*2);
    line(tx, ty, tx+arrayVector.x, ty+arrayVector.y);
}

function draw() {
    background(245);
    let segments = [s1, s2];
    let isSegmentActive=false;
    let godObjectPosition;
    for(let s of segments) {if(s.isActive){isSegmentActive=true; break;}}
    if(!isSegmentActive)collisionDetection(segments);

    godObjectPosition = createVector(mouseX, mouseY);

    // if(isSegmentActive){
    if(s1.isActive)godObjectPosition = calculateCollisionPoint(s1);
    else if(s2.isActive)godObjectPosition = calculateCollisionPoint(s2);
    // is still colliding ?
    for (let s of segments){
        let mouseVector = createVector(mouseX, mouseY);
        if(s.isPointOutOfSegment(mouseVector)){
            s.setActive(false);
        }
        else {
            s.setActive(true);
            godObjectPosition = calculateCollisionPoint(s);
        }
    }
 
    collisionUpdate(segments, godObjectPosition);    
    godObjectPosition = updateCollisionPoint(godObjectPosition);

    strokeWeight(0);
    fill(0, 0, 255); // point of collision
    ellipse(godObjectPosition.x, godObjectPosition.y, radius2, radius2);
    fill(0, 255, 0); // me handle position
    ellipse(mouseX, mouseY, radius, radius);
    strokeWeight(2);
    s1.draw();s2.draw();

    let forceVector = calculateForce(createVector(godObjectPosition.x, godObjectPosition.y), createVector(mouseX, mouseY));
    drawForce(godObjectPosition.x, godObjectPosition.y, godObjectPosition.x + forceVector.x, godObjectPosition.y + forceVector.y);
    prevMouseX = mouseX;
    prevMouseY = mouseY;

}