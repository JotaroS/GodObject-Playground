let radius = 10;
let radius2 = 15;
let prevMouseX = 0
let prevMouseY = 0;
let s1, s2;
let activeSegment;

let segments = [];

function setup() {
    createCanvas(400, 400);
    // s1 = new Segment(0, 200 / 2, 400 / 2, 350);
    // s2 = new Segment(400 / 2, 350, 400, 200 / 2);

    // UNCOMMENT HERE TO SEE DIFFERENT GEOMETRY
    // s1 = new Segment(0,400 / 2, 400 / 2, 400 / 2);
    // s2 = new Segment(400 / 2, 400 / 2,400, 400);

}

function draw() {
    background(245);
}