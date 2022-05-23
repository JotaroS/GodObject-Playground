let radius = 10;
let radius2 = 15;
let prevMouseX = 0
let prevMouseY = 0;
let s1, s2;
let activeSegment;

function setup() {
    createCanvas(400, 400);
    s1 = new Segment(0, 200 / 2, 400 / 2, 350);
    s2 = new Segment(400 / 2, 350, 400, 200 / 2);

    // // UNCOMMENT HERE TO SEE DIFFERENT GEOMETRY
    // s1 = new Segment(0, 400 / 2, 400 / 2, 400 / 2);
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
    let mouseToCollisionPoint = segment.getNormal().mult((segment.eval(mouseVector)>0)?-d:d);
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
   
    if (!isSegmentActive) collisionDetection(segments);
    let mouseVector = createVector(mouseX, mouseY);
    for(let s of segments) {
        if(s.isPointOutOfSegment(mouseVector))s.setActive(false);
    }
    for (let s of segments) {
        if (s.isActive) {
            isSegmentActive = true;
            break;
        }
    }
    godObjectPosition = createVector(mouseX, mouseY);

    if (isSegmentActive) {
        let edgePosition;
        s1.setActive(true);s2.setActive(true);

        //calculate candidate point of the god objects
        e1 = calculateCollisionPoint(s1);
        e2 = calculateCollisionPoint(s2);

        strokeWeight(0);
        fill(200); // point of collision
        ellipse(e1.x, e1.y, radius2, radius2);
        strokeWeight(0);
        fill(200); // point of collision
        ellipse(e2.x, e2.y, radius2, radius2);
            
        let mouseVector = createVector(mouseX, mouseY);

        // intersection of the lines. calculating best concave position using lagrangean multiplier
        // you don't have to do lagrangean, but this can be scaled to 3D situation
        const a1 = s1.a, a2 = s2.a;
        const b1 = s1.b, b2 = s2.b;
        const c1 = s1.c, c2 = s2.c;
        const A = [
            [a1,b1],
            [a2,b2]
        ]
        const b = [-c1, -c2]; //vector to solve
        const x = math.lusolve(A,b); // solution
        //this point gives the intersection of tthe lines.
        intersectionPoint = createVector(x[0][0], x[1][0]);
        ellipse(intersectionPoint.x, intersectionPoint.y, radius2, radius2);
        godObjectPosition = createVector(mouseX, mouseY);
      
        let candidates = [intersectionPoint];
        for(e of [e1, e2]){
            if(s1.eval(e)< -0.01||s2.eval(e)< -0.01){}
            else{
                candidates.push(e);
            }
        }
      
        // TODO: Identify a point in Vector2[] candidates that's closest to the meHandle, and assign it as the godObjectPosition.
        // --
        // candidates: p5.Vector[] candidate points for god object on concave corner.
        // mouseX, mouseY: position of meHandle (=mouse) x, y position.
        // --
      
        // YOUR CODE STARTS HERE
        // let minDist = 100000;
        // // for every candidate points:
        // for(let candidatePoint of candidates){
        //     // STEP 1: calcaulte distance from candidatePoint to mouseX, mouseY. Use createVector(), .mag() mouseX and mouseY.
        //     let d = createVector(candidatePoint.x - mouseX,candidatePoint.y - mouseY).mag();
        //     // STEP 2: if distance is smaller than minDist, then assign godObjectPosition, update minDist.
        //     if(minDist > d){
        //         minDist = d;
        //         godObjectPosition = candidatePoint;
        //     }
        // }
        // YOUR CODE ENDS HERE
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
    // debugOutput(debugArr);
}