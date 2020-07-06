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

function draw() {
    background(245);

    // draw me handle / collision point
    strokeWeight(0)
    stroke(0);
    fill(200);
    rect(0, width/2, width, height/2);
    let pointOfCollision = calculateCollisionPoint();
    fill(0, 0, 255); // point of collision
    ellipse(pointOfCollision.x, pointOfCollision.y, radius, radius);    
    fill(0,255,0); // me handle position
    ellipse(mouseX, mouseY, radius, radius);
    strokeWeight(2);

    // 
    stroke(150);
    line(mouseX, mouseY, pointOfCollision.x, pointOfCollision.y);

    let forceVector = calculateForce(createVector(pointOfCollision.x, pointOfCollision.y), createVector(mouseX, mouseY));
    drawForce(pointOfCollision.x, pointOfCollision.y, pointOfCollision.x+forceVector.x, pointOfCollision.y+forceVector.y);
}