// sketch.js - Evolutionary Impressions
// Author: Alexander Halim
// Date: 5/2/25

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
function getInspirations() {
  return [
    {
      name: "Hanging bridge black and white stark contrast", 
      assetUrl: "https://cdn.glitch.global/a1e95732-b5c1-4143-8725-af9754c4bd74/hanging-bridge-black-and-white-stark-contrast-matthias-hauser.jpg?v=1746153188883",
      credit: "Hanging bridge black and white stark contrast, Matthias Hauser"
    },
    {
      name: "No Sun Bird High Contrast", 
      assetUrl: "https://cdn.glitch.global/a1e95732-b5c1-4143-8725-af9754c4bd74/3365374279_599e3077ff_b.jpg?v=1746154280324",
      credit: "No Sun Bird High Contrast, Sue Thompson, 2009"
    },
    {
      name: "Guardian of The Cove", 
      assetUrl: "https://cdn.glitch.global/a1e95732-b5c1-4143-8725-af9754c4bd74/MG_0012322-2-6-2018-resize.jpg?v=1746154220640",
      credit: "Guardian of The Cove, Michelle Giorla, 2018"
    },
    {
      name: "Sun Spotlight", 
      assetUrl: "https://cdn.glitch.global/a1e95732-b5c1-4143-8725-af9754c4bd74/december19_01_small.jpg?v=1746154636480",
      credit: "Sun Spotlight, Laura Thistle, 2020"
    },
  ];
}

function chooseShape(brightness) {
   if (brightness > 220) {
     return "circle";
   } else if (brightness > 120) {
     return "rect";
   } else {
     return "triangle";
   }
}
function initDesign(inspiration) {
  resizeCanvas(inspiration.image.width / 4, inspiration.image.height / 4);
  
  let design = {
    bg: 128,
    fg: []
  };

  for (let i = 0; i < 500; i++) {
    let x = random(width);
    let y = random(height);
    let c = inspiration.image.get(int(x * 4), int(y * 4));
    let brightness = (c[0] + c[1] + c[2]) / 3;
    let shapeType;
    
    if  (brightness > 60) {
      design.fg.push({
        x: x,
        y: y,
        w: random(1, 3),
        h: random(1, 3),
        fill: color(c),
        shape: chooseShape(brightness)
      });
    }
  }

  return design;
}

function renderDesign(design, inspiration) {
  background(design.bg);
  noStroke();
  
  for (let item of design.fg) {
    fill(item.fill.levels[0], item.fill.levels[1], item.fill.levels[2], 100);
    if (item.shape === "circle") {
      ellipse(item.x, item.y, item.w, item.h);
    } else if (item.shape === "rect") {
      rect(item.x, item.y, item.w, item.h)
    } else if (item.shape === "triangle") {
      triangle(item.x, item.y, item.x + item.w / 2, item.y - item.h, item.x + item.w, item.y);
    }
    //let c = circle.fill.levels;
    //fill(c[0], c[1], c[2], 100);
    
    //ellipse(circle.x, circle.y, circle.w, circle.h);
  }
}

function mutateDesign(design, inspiration, rate) {
  design.bg = mut(design.bg, 0, 255, rate);

  for (let circle of design.fg) {
    let c = circle.fill.levels;
    let brightness = (c[0] + c[1] + c[2]) / 3;
    let mutatedGray = mut(brightness, 0, 255, rate);
    circle.fill = color(mutatedGray);
    circle.x = mut(circle.x, 0, width, rate);
    circle.y = mut(circle.y, 0, height, rate);
    circle.w = mut(circle.w, 10, 60, rate);
    circle.h = mut(circle.h, 10, 60, rate);
  }
}

function mut(num, min, max, rate) {
  return constrain(randomGaussian(num, (rate * (max - min)) / 10), min, max);
}