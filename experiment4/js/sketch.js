"use strict";

function p3_preload() {}

function p3_setup() {}

let worldSeed;
let fishies = [];
let clicks = {};

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth () { return 32; }
function p3_tileHeight() { return 16; }

let [tw, th] = [32, 16];

function p3_tileClicked(i, j) {
  clicks[[i, j]] = 1 + (clicks[[i, j]] | 0);
  let [scrX, scrY] = worldToScreen(
    [i, j],
    [camera_offset.x, camera_offset.y]
  );
  scrX = -scrX;
  fishies.push({
    x:    scrX,
    y:    scrY,
    vx:   random(-1, 1),
    vy:   random(-6, -3),
    size: random(12, 20),
    age:  0
  });
}

function p3_drawBefore() {}

function p3_drawTile(i, j) {
  noStroke();

  const scale = 0.08;
  const dx    = i * scale + worldSeed * 1e-5;
  const dy    = j * scale + worldSeed * 2e-5;
  let depth   = noise(dx, dy);  // [0..1]

  const sandThreshold = 0.2;
  if (depth < sandThreshold) {
    fill(194, 178, 128, 200);
  } else {
    let t = (depth - sandThreshold) / (1 - sandThreshold);
    let shallow = color(135, 206, 235, 200);
    let deep    = color(  0,   0,  139, 200);
    fill( lerpColor(shallow, deep, t) );
  }

  push();
    beginShape();
      vertex(-tw, 0);
      vertex(  0, th);
      vertex( tw, 0);
      vertex(  0, -th);
    endShape(CLOSE);

    let n = clicks[[i, j]] | 0;
    if (n % 2 == 1) {
      fill(0, 0, 0, 32);
      ellipse(0, 0, 10, 5);
      translate(0, -10);
      fill(255,255,100,128);
      ellipse(0, 0, 10,10);
    }
  pop();
}

function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0,255,0,128);
  beginShape();
    vertex(-tw, 0);
    vertex(  0, th);
    vertex( tw, 0);
    vertex(  0, -th);
  endShape(CLOSE);
  noStroke();
  fill(0);
  text(`tile [${i},${j}]`, 0,0);
}

function p3_drawAfter() {
  noStroke();
  const gravity = 0.2;
  let alive = [];
  for (let f of fishies) {
    f.age++;
    if (f.age < 60) {
      f.vy += gravity;
      f.x  += f.vx;
      f.y  += f.vy;
      push();
        translate(f.x, f.y);
        rotate(atan2(f.vy, f.vx));
        fill(255,127,0);
        ellipse(0,0,f.size,f.size*0.6);
        triangle(
          -f.size/2, 0,
          -f.size*0.8, -f.size*0.3,
          -f.size*0.8,  f.size*0.3
        );
      pop();
      alive.push(f);
    }
  }
  fishies = alive;
}