// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;
let seed = 0;
// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

class MyClass {
    constructor(param1, param2) {
        this.property1 = param1;
        this.property2 = param2;
    }

    myMethod() {
        // code to run when method is called
    }
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  // create an instance of the class
  myInstance = new MyClass("VALUE1", "VALUE2");

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();

  // reimagine button
$("#reimagine").click(function () {
  seed++;
});
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  randomSeed(seed);
	background(10, 10, 30);
  
  let starCount = 150;
  for (let i = 0; i < starCount; i++)
    {
      let x = random(width);
      let y = random(height);
      
      let starSize = random(1, 3);
      let nPoints = int(random(5, 8));
      let twinkle = map(sin(frameCount * 0.1 + i), -1, 1, 0.8, 1.2);
      
      push();
      translate(x, y);
      scale(starSize * twinkle);
      
      let r = random(200, 255);
      let g = random(200, 255);
      let b = random(200, 255);
      fill(r, g, b, 230);
      

      noStroke();
      drawStar(0, 0, 0.5, 1, nPoints);
      pop();
    }
  
  let pWidth = random(90, 100);
  let pHeight = random(50, 75);
  let pRadius = random(15, 25);
  
  drawPlanet(pWidth, pHeight, pRadius);
  
  function drawPlanet(x, y, radius) {
    push();
    translate(x, y);
    
    noStroke();
    fill(100, 150, 200);
    ellipse(0, 0, radius * 2, radius * 2);
    
    let numCraters = int(random(3,7));
    
    for (let i = 0; i < numCraters; i++)
      {
        let a = random(TWO_PI);
        let r = random(radius * 0.2, radius * 0.7);
        // credit: https://stackoverflow.com/questions/55965095/simplest-way-to-convert-polar-coordinates-to-cartesian-points
        let cx = cos(a) * r;
        let cy = sin(a) * r;
        
        let craterSize = random(radius * 0.1, radius * 0.3);
        fill(80, 130, 180, random(150, 230));
        ellipse(cx, cy, craterSize, craterSize);
      }
    pop();
  }
  
  // credit: https://stackoverflow.com/questions/55856419/how-to-draw-a-star-in-p5-js
  function drawStar(x, y, radius_1, radius_2, nPoints) {
    let angle = TWO_PI / nPoints;
    let halfAngle = angle / 2.0;
    beginShape();
    
    for (let i = 0; i < TWO_PI; i += angle)
      {
        let sx = cos(i) * radius_2;
        let sy = sin(i) * radius_2;
        vertex(sx, sy);
        
        sx = cos(i + halfAngle) * radius_1;
        sy = sin(i + halfAngle) * radius_1;
        vertex(sx, sy);
      }
    
    endShape(CLOSE);
  }
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}