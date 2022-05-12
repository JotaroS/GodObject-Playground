let radius = 10;
let radius2 = 15;
let prevMouseX = 0
let prevMouseY = 0;
let s1, s2;
let activeSegment;
function setup() {
    createCanvas(400, 400);
    // s1 = new Segment(0,400 / 2, 400 / 2, 400 / 2);
    // s2 = new Segment(400 / 2, 400 / 2,400 / 2, 400);

    // UNCOMMENT HERE TO SEE DIFFERENT GEOMETRY
    s1 = new Segment(0,500 / 2, 400 / 2, 400 / 2);
    s2 = new Segment(400 / 2, 400 / 2,400, 500/2);

}

function collisionDetection(segments){
    for(let segment of segments){
        mouseSegment = new Segment(mouseX, mouseY, prevMouseX, prevMouseY);
        // TODO: 
        // activate segment if mouse Segment intersects.
        // variables and functions:::
        // segment: Segment object. edges of object in the scene
        // mouseSegment: Segment object made from current and previous mouse position.
        // Segment.setActive(bool ): set segment as active/inactive
        // Segment.isIntersecting(Segment ):

        let mouseP = createVector(mouseX, mouseY);
        let prevMouseP = createVector(prevMouseX, prevMouseY);
        
        // uncomment/code below!
        if(segment.isIntersecting(mouseSegment) && segment.eval(mouseP)<=0 && segment.eval(prevMouseP)>0){
            segment.setActive(true);
        }
    }
    return;
}

function collisionUpdate(segments, objectPoint){
    for(let s of segments){
        mouseSegment = new Segment(mouseX, mouseY, objectPoint.x, objectPoint.y);
        if(s.isIntersecting(mouseSegment)){
            s.setActive(true);
            activeSegment = s;
            return;
        }
    }
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
    let isSegmentActive=false; // if one of segment is active this should be true.
    let godObjectPosition;
    for(let s of segments) {if(s.isActive){isSegmentActive=true; break;}}

    // collision entry detection using current and previous mouse position.
    if(!isSegmentActive)collisionDetection(segments);
    godObjectPosition = createVector(mouseX, mouseY);

    // calculate nearest godObject against active segment.
    for(let s of segments){
        if(s.isActive)godObjectPosition = calculateCollisionPoint(s);
    }
    
    // is still colliding? (calculated god object above might be already out of segment)
    let currentActiveSegment = s1;
    let reJudgeFlag = false;
    for(let s of segments){
        if(s.isActive){
            // this small vector is needed somehow to avoid numerical error...
            let epsilon = createVector(godObjectPosition.x-mouseX, godObjectPosition.y-mouseY).normalize().mult(2);
            let mouseCollisionSegment = new Segment(mouseX, mouseY, godObjectPosition.x+epsilon.x, godObjectPosition.y+epsilon.y);
            if(s.isIntersecting(mouseCollisionSegment)==false){
                s.setActive(s.isIntersecting(mouseCollisionSegment));
                reJudgeFlag = true;
                break;
            }
        }
    }
    // if the segment is off during dragging, we need to recalculate another collision.
    if(reJudgeFlag){
        activeSegment = currentActiveSegment;
        collisionUpdate(segments, godObjectPosition);
        godObjectPosition = calculateCollisionPoint(currentActiveSegment);
    }

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