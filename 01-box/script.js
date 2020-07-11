
radius = 10;

function setup() {
    createCanvas(200, 200);
}


let isTopWallActive = false;
let isRightWallActive = false;

let prevMouseX, prevMouseY;

function checkCollision(x, y) {
    //check top wall
    const topWallY = height / 2;
    const rightWallX = width / 2;
    if (!isRightWallActive && y > topWallY && prevMouseX < rightWallX) isTopWallActive = true;
    else isTopWallActive = false;
    if (!isTopWallActive && x < rightWallX && prevMouseY > topWallY) isRightWallActive = true;
    else isRightWallActive = false;
    return;
}


function calculateCollisionPoint() {
    const topWallY = height / 2;
    const rightWallX = width / 2;
    if (isTopWallActive) {
        return createVector(mouseX, min(mouseY, topWallY));
    } else if (isRightWallActive) {
        return createVector(max(mouseX, rightWallX), mouseY);
    } else return createVector(mouseX, mouseY);
}

function calculateForce(godObjectPosition, pointOfMeHandle) {
    let errVector = godObjectPosition.sub(pointOfMeHandle);
    let forceVector = errVector.mult(2.0);
    return forceVector;
}

function drawForce(sx, sy, tx, ty) {
    strokeWeight(3);
    stroke(255, 0, 0);
    line(sx, sy, tx, ty);
    let arrayVector = createVector(tx, ty).sub(createVector(sx, sy));
    arrayVector.normalize();
    arrayVector.rotate(-HALF_PI * 1.5);
    arrayVector.mult(10)
    line(tx, ty, tx + arrayVector.x, ty + arrayVector.y);
    arrayVector.rotate(+HALF_PI * 1.5 * 2);
    line(tx, ty, tx + arrayVector.x, ty + arrayVector.y);
}

function draw() {
    background(245);
    checkCollision(mouseX, mouseY);
    strokeWeight(5);
    stroke(0,0,255);
    if(isRightWallActive)line(width/2, height/2, width/2, height);
    else if(isTopWallActive)line(0, height/2, width/2,height / 2);
    // draw me handle / collision point
    strokeWeight(0)
    stroke(0);
    fill(200);
    rect(0, height / 2, width / 2, height / 2);
    let godObjectPosition = calculateCollisionPoint();
    fill(0, 0, 255); // point of collision
    ellipse(godObjectPosition.x, godObjectPosition.y, radius, radius);
    fill(0, 255, 0); // me handle position
    ellipse(mouseX, mouseY, radius, radius);
    strokeWeight(2);

    // 
    stroke(150);
    line(mouseX, mouseY, godObjectPosition.x, godObjectPosition.y);

    let forceVector = calculateForce(createVector(godObjectPosition.x, godObjectPosition.y), createVector(mouseX, mouseY));
    drawForce(godObjectPosition.x, godObjectPosition.y, godObjectPosition.x + forceVector.x, godObjectPosition.y + forceVector.y);
    prevMouseX = mouseX;
    prevMouseY = mouseY;
}