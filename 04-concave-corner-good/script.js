let radius = 10;
let radius2 = 15;
let prevMouseX = 0
let prevMouseY = 0;
let s1, s2;
let activeSegment;

function setup() {
    createCanvas(400, 400);
    s1 = new Segment(0, 600 / 2, 400 / 2, 350);
    s2 = new Segment(400 / 2, 350, 400, 600 / 2);

    // UNCOMMENT HERE TO SEE DIFFERENT GEOMETRY
    // s1 = new Segment(0,400 / 2, 400 / 2, 400 / 2);
    // s2 = new Segment(400 / 2, 400 / 2,400, 400);

}

function collisionDetection(segments) {
    for (let s of segments) {
        mouseSegment = new Segment(mouseX, mouseY, prevMouseX, prevMouseY);
        if (s.isIntersecting(mouseSegment)) {
            s.setActive(true);
            activeSegment = s;
            return;
        }
    }
}

function collisionUpdate(segments, objectPoint) {
    for (let s of segments) {
        mouseSegment = new Segment(mouseX, mouseY, objectPoint.x, objectPoint.y);
        if (s.isIntersecting(mouseSegment)) {
            s.setActive(true);
            activeSegment = s;
            return;
        }
    }
}

function calculateCollisionPoint(segment) {
    mouseVector = createVector(mouseX, mouseY);
    let d = segment.distanceTo(mouseVector);
    let mouseToCollisionPoint = segment.getNormal().mult(d);
    let collisionPoint = mouseVector.add(mouseToCollisionPoint);
    return collisionPoint;
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

function debugOutput(stringArray) {
    let y = 10;
    strokeWeight(0);
    fill(0);
    for (var s of stringArray) {
        text(s, 10, y);
        y += 15;
    }
}

function draw() {
    let debugArr = ["------debug--------"]; // add whatever you want
    background(245);
    let segments = [s1, s2];
    let isSegmentActive = false;
    let godObjectPosition;
    for (let s of segments) {
        if (s.isActive) {
            isSegmentActive = true;
            break;
        }
    }
    if (!isSegmentActive) collisionDetection(segments);

    godObjectPosition = createVector(mouseX, mouseY);

    if (isSegmentActive) {
        if (s1.isActive) godObjectPosition = calculateCollisionPoint(s1);
        else if (s2.isActive) godObjectPosition = calculateCollisionPoint(s2);
        // is still colliding ?
        let currentActiveSegment;
        let reJudgeFlag = false;
        // for (let s of segments) {
        //     if (s.isActive) {
        //         let epsilon = createVector(godObjectPosition.x - mouseX, godObjectPosition.y - mouseY).normalize().mult(2);
        //         let mouseCollisionSegment = new Segment(mouseX, mouseY, godObjectPosition.x + epsilon.x, godObjectPosition.y + epsilon.y);
        //         if (s.isIntersecting(mouseCollisionSegment) == false) {
        //             s.setActive(s.isIntersecting(mouseCollisionSegment));
        //             // reJudgeFlag = true;
        //             break;
        //         }

        //     }
        // }

        // if the segment is off during dragging, we need to calculate another collision.
        // if(reJudgeFlag){
        //     console.log("rejudge");
        //     currentActiveSegment = activeSegment;
        //     collisionUpdate(segments, godObjectPosition);
        //     godObjectPosition = calculateCollisionPoint(activeSegment);
        // }
        let godobjectPoint = createVector(mouseX, mouseY);
        let ratio = 0.5;
        if (isSegmentActive) {
            let count =0;
            while (!s1.isPointOutOfSegment(godobjectPoint) || !s2.isPointOutOfSegment(godobjectPoint)) {
                for (let s of segments) {
                    if (!s.isPointOutOfSegment(godobjectPoint)) {
                        let delta = s.getNormal().mult(ratio);
                        godobjectPoint.add(delta);
                        fill(0,200,0);
                        ellipse(godobjectPoint.x, godobjectPoint.y, 1, 1);
                    }  
                }
                count++;
            }
            debugArr.push("count:",count);
        }
        godObjectPosition = godobjectPoint;
    }

    strokeWeight(0);
    fill(0, 0, 255); // point of collision
    ellipse(godObjectPosition.x, godObjectPosition.y, radius2, radius2);
    fill(0, 255, 0); // me handle position
    ellipse(mouseX, mouseY, radius, radius);
    strokeWeight(2);
    s1.draw(true);
    s2.draw(true);

    let forceVector = calculateForce(createVector(godObjectPosition.x, godObjectPosition.y), createVector(mouseX, mouseY));
    drawForce(godObjectPosition.x, godObjectPosition.y, godObjectPosition.x + forceVector.x, godObjectPosition.y + forceVector.y);
    prevMouseX = mouseX;
    prevMouseY = mouseY;

    
    debugArr.push("s1 is outside : " + s1.isPointOutOfSegment(createVector(mouseX, mouseY)));
    debugArr.push("s2 is outside : " + s2.isPointOutOfSegment(createVector(mouseX, mouseY)));
    debugOutput(debugArr);
}