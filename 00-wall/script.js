radius = 10;
function setup() {
    createCanvas(400, 400);
}

function calculateCollisionPoint(){
    //TODO: let's build a wall logic.
    // godObjectPosition should stay on the wall in the middle of screen.
    // you need to set godObjectPosition.x so that it stops on the center to the right.
    // variables:
    // wallX : position of boundary of the wall.
    // meHandle : P5.vector object. position of me handle == mouse.

    const wallX = width / 2;
    const meHandle = createVector(mouseX,mouseY);
    godObjectPosition = createVector();
    if(meHandle.x < wallX){ //if meHandle is out of wall,
        // godObjectPosition.x = ???;
    }
    else{ // if me handle is in the wall
        // godObjectPosition.x = ???;
    }
    godObjectPosition.y = meHandle.y;
    return godObjectPosition;
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

    // draw me handle / collision point
    strokeWeight(0)
    stroke(0);
    fill(200);
    rect(width/2, 0, width, height);
    let godObjectPosition = calculateCollisionPoint();
    fill(0, 0, 255); // point of collision
    ellipse(godObjectPosition.x, godObjectPosition.y, radius, radius);    
    fill(0,255,0); // me handle position
    ellipse(mouseX, mouseY, radius, radius);
    strokeWeight(2);

    // 
    stroke(150);
    line(mouseX, mouseY, godObjectPosition.x, godObjectPosition.y);

    let forceVector = calculateForce(createVector(godObjectPosition.x, godObjectPosition.y), createVector(mouseX, mouseY));
    drawForce(godObjectPosition.x, godObjectPosition.y, godObjectPosition.x+forceVector.x, godObjectPosition.y+forceVector.y);
}