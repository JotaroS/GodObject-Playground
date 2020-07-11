radius = 10;
function setup() {
    createCanvas(400, 400);
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