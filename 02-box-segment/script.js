let radius = 10;
let radius2 = 15;
let prevMouseX = 0
let prevMouseY = 0;
let s1, s2;
function setup() {
    createCanvas(400, 400);
    s1 = new Segment(0,400 / 2, 400 / 2, 400 / 2);
    s2 = new Segment(400 / 2, 400 / 2,400 / 2, 400);
}

function collisionDetection(segments){
    for(let s of segments){
        mouseSegment = new Segment(mouseX, mouseY, prevMouseX, prevMouseY);
        if(s.isIntersecting(mouseSegment)){
            s.setActive(true);
        }
    }
}

function calculateCollisionPoint(segment){
    mouseVector = createVector(mouseX, mouseY);
    let d = segment.distanceTo(mouseVector);
    let mouseToCollisionPoint = segment.getNormal().normalize().mult(d);
    let collisionPoint = mouseVector.add(mouseToCollisionPoint);
    return collisionPoint;
}


function calculateForce(pointOfCollision, pointOfMeHandle){
    let errVector = pointOfCollision.sub(pointOfMeHandle);
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
    if(!s1.isActive && !s2.isActive)collisionDetection(segments);

    let pointOfCollision;
    if(s1.isActive)pointOfCollision = calculateCollisionPoint(s1);
    else if(s2.isActive)pointOfCollision = calculateCollisionPoint(s2);
    else  pointOfCollision = createVector(mouseX, mouseY);

    // is still colliding ?

    for(let s of segments){
        if(s.isActive){
            let mouseCollisionSegment = new Segment(mouseX, mouseY, pointOfCollision.x, pointOfCollision.y);
            s.setActive(s.isIntersecting(mouseCollisionSegment));
        }
    }
    
    strokeWeight(0);
    fill(0, 0, 255); // point of collision
    ellipse(pointOfCollision.x, pointOfCollision.y, radius2, radius2);
    fill(0, 255, 0); // me handle position
    ellipse(mouseX, mouseY, radius, radius);
    strokeWeight(2);
    s1.draw();s2.draw();

    let forceVector = calculateForce(createVector(pointOfCollision.x, pointOfCollision.y), createVector(mouseX, mouseY));
    drawForce(pointOfCollision.x, pointOfCollision.y, pointOfCollision.x + forceVector.x, pointOfCollision.y + forceVector.y);
    prevMouseX = mouseX;
    prevMouseY = mouseY;

}