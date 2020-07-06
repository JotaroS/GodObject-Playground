radius = 10;
function setup() {
    createCanvas(400, 400);
}

function calculateCollisionPoint(){
    //wallY is set to windowHeight / 2;
    //logic:
    //  pointOfCollision.x = mouseX
    //  pointOfCollision.y = if(mouseY < wallY)then mouseY. else...
    const topWallY = height / 2;
    pointOfCollision = createVector(mouseX, min(mouseY, topWallY));
    return pointOfCollision;
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

let prevMouseX, prevMouseY;
function draw() {
    background(245);
    let s1 = new Segment(10,10,200,200);
    let s2 = new Segment(200,200,140,359);
    let s3 = new Segment(200, 10, 10, 200);

    let segments = [s1, s2, s3];

    let st = new Segment(prevMouseX, prevMouseY, mouseX, mouseY);

    for(var s of segments){
        if(s.isIntersecting(st))s.setActive(true);
    }

    s1.draw();
    s2.draw();
    s3.draw();

    strokeWeight(0);
    text('mouse dist to s1 = '+s1.distanceTo(createVector(mouseX, mouseY)),10, 20);
    text('intersection s1 to s2 '+s1.isIntersecting(s2), 10, 30);
    text('intersection s1 to s3 '+s1.isIntersecting(s3), 10, 40);
    text('intersection s2 to s3 '+s2.isIntersecting(s3), 10, 50);

    text('mouse is out of s1 ' + s1.isPointOutOfSegment(createVector(mouseX, mouseY)),10, 70);
    text('mouse is out of s2 ' + s2.isPointOutOfSegment(createVector(mouseX, mouseY)),10, 80);
    text('mouse is out of s3 ' + s3.isPointOutOfSegment(createVector(mouseX, mouseY)),10, 90);

    prevMouseX = mouseX;
    prevMouseY = mouseY;
}