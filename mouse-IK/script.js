//pantograph world
var motorLeft, motorRight; //motor locations in world coords
var theta_L, theta_R; //angles in radians
var l_upper = 5;
var l_lower = 8;
var elbowLeft, elbowRight; //locations of the elbows in world coords
var endEffector; //location of end effector


//drawing variables
var motorDrawDiameter = 25; //pixels
var world2pixelscale = 10; //pixels per unit
var worldOriginInPixels;


//UI widgets
var angleSliderLeft, angleSliderRight;
var angleSliderResolution = 100.0;
var angleSliderXLeft = 10, angleSliderXRight = 200, angleSliderY = 10;


function setup() {
  createCanvas(900, 900);
  worldOriginInPixels = createVector(width / 5, height / 8);

  //setup motors
  motorLeft = createVector(-2, 0);
  motorRight = createVector(2, 0);

  //setup angles
  theta_L = 0;
  theta_R = 0;

  //setup UI controls
  angleSliderLeft = createSlider(0, TWO_PI*angleSliderResolution, TWO_PI*5/8*angleSliderResolution);
  angleSliderRight = createSlider(0, TWO_PI*angleSliderResolution, TWO_PI*7/8*angleSliderResolution);
  angleSliderLeft.position(angleSliderXLeft, angleSliderY);
  angleSliderRight.position(angleSliderXRight, angleSliderY);
  img = createImg('https://i.ibb.co/z4TMpkR/Screenshot-2020-06-11-11-53-45.png');
  img2 = createImg('https://i.ibb.co/SQzFDmM/panto-step-image.png');
  img.hide();
}

//**************************
// calculateElbow(motorLocation, motorAngle)
//
// motorLocation :: p5.Vector
// motorAngle :: angle in radians
//
// returns a P5.Vector to the elbow, given a motor location and an angle
//**************************
function calculateElbow(motorLocation, motorAngle) {
  var elbow = createVector(0,0); //This is the position of the elbow.
  //SOLUTION
  elbow.x = motorLocation.x + l_upper*cos(motorAngle)
  elbow.y = motorLocation.y + l_upper*sin(motorAngle);
  return elbow;
}


//**************************
// calculateEndEffector()
// STUB: implement this
//
// returns a P5.Vector to end effector position
//**************************
function calculateEndEffector() {
    // TODO2 : "Locate End Effector!"
    // functions and variables:
    // ----
    // createVector(x, y)          creates P5.Vector variable
    // p5.Vector.add(), .mult(), .sub(), ... 
    // e.g. p5.Vector.add(a, b);   note : a.add(b) is mutating a.
    // p5.Vector.normalize() ...   create a unit vector (a vector which its length = 1)
    // p5.Vector.rotate(angle) ... rotate the vector by angle[rad]
    // ---
    // global variables:
    // elbowLeft  :: P5.Vector 
    // elbowRight :: P5.Vector 
    // l_upper : linkages from motors to elbow [cm]
    // l_lower : linkages from elbow to endeffector [cm]
    //constants:
    // HALF_PI :: PI / 2. identical to 90[deg] in radians.
    
    // SOLUTION (uncomment below)
    var diagonal = p5.Vector.sub(elbowRight, elbowLeft); //subtract two vectors to create diagonal
    var elbowLeftToPH = diagonal.mult(0.5); //calculate midpoint vector of diagonal
    var length_h = sqrt(l_lower * l_lower - elbowLeftToPH.mag()*elbowLeftToPH.mag()); //do Pythagoras. use .mag() method
    
    var pHtoEndEffector = elbowLeftToPH.copy(); //first need to make a copy.
    pHtoEndEffector.normalize(); // then normalize (length = 1)
    pHtoEndEffector.rotate(-HALF_PI); // then rotate clockwise (-90deg)
    pHtoEndEffector.mult(length_h);
   
    var endEffectorPosition = p5.Vector.add(elbowLeft,elbowLeftToPH); //calcualte three vectors starting from origin
    endEffectorPosition = p5.Vector.add(endEffectorPosition, pHtoEndEffector);
    // END SOLUTION
    
    return endEffectorPosition;
}


function FK(theta_L, theta_R){
    //CALCULATE ELBOW LOCATIONS HERE
  elbowLeft = calculateElbow(motorLeft, theta_L);
  elbowRight = calculateElbow(motorRight, theta_R);
  
  

  //CALCULATE END EFFECTOR HERE
  endEffector = calculateEndEffector();
  return endEffector;
}

// let theta_R,theta_L;

function draw() {
  background(255);
  image(img, 350,0,500/3,680/3);
  image(img2, 500, -50, 1200/3,1700/3)
  //draw motors
  var leftMotorDrawingLocation = world2pixel(motorLeft);
  ellipse(leftMotorDrawingLocation.x, leftMotorDrawingLocation.y, motorDrawDiameter, motorDrawDiameter);
  var rightMotorDrawingLocation = world2pixel(motorRight);
  ellipse(rightMotorDrawingLocation.x, rightMotorDrawingLocation.y, motorDrawDiameter, motorDrawDiameter);


  //draw first linkages
  let epsilon;
//   do{
    for(let i=0; i < 100; i++){
        let delta = 0.005;
    let endEffector = FK(theta_L, theta_R);
    epsilon = createVector(mouseX, mouseY).sub(world2pixel(endEffector));
    if(epsilon.x > 0){theta_L+=delta; theta_R+=delta;}
    else {theta_L-=delta; theta_R-=delta};

    if(epsilon.y > 0){theta_L+=delta; theta_R-=delta;}
    else {theta_L-=delta; theta_R+=delta};
    }
    //DRAW END EFFECTOR HERE
    var drawEE = world2pixel(endEffector);
//   }while(epsilon.mag()>10);

//DRAW END EFFECTORS HERE
    var leftElbowDrawingLocation = world2pixel(elbowLeft);
    var rightElbowDrawingLocation = world2pixel(elbowRight);
    line(leftMotorDrawingLocation.x, leftMotorDrawingLocation.y,
    leftElbowDrawingLocation.x, leftElbowDrawingLocation.y);
    line(rightMotorDrawingLocation.x, rightMotorDrawingLocation.y,
    rightElbowDrawingLocation.x, rightElbowDrawingLocation.y);

  line(leftElbowDrawingLocation.x, leftElbowDrawingLocation.y, drawEE.x, drawEE.y);
  line(rightElbowDrawingLocation.x, rightElbowDrawingLocation.y, drawEE.x, drawEE.y);
  ellipse(drawEE.x, drawEE.y, 5, 5);
  
  text(theta_L + "("+int(theta_L*180/PI)+" deg)",10, angleSliderY+30);
  text(theta_R + "("+int(theta_R*180/PI)+" deg)",angleSliderXRight, angleSliderY+30);
  
}

//maps a vector of world coordinates to drawing coordinates
function world2pixel(worldVector) {
  var drawVector = createVector(0, 0);
  drawVector.add(worldVector);
  drawVector.mult(world2pixelscale);
  drawVector.y = -drawVector.y;
  drawVector.add(worldOriginInPixels);
  return drawVector;
}