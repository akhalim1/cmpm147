// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
let seed = 0;
let canvasContainer;
let tilesetImage;
let grid;
let tileSize = 16;
let numCols, numRows;

function reseed() {
  seed = (seed | 0) + 89;
  randomSeed(seed);
  noiseSeed(seed);
  $(`#seedLabel`).text("seed " + seed);
  grid = generateGrid(numCols, numRows);
}

function preload() {
  tilesetImage = loadImage("https://cdn.glitch.global/25101045-29e2-407a-894c-e0243cd8c7c6/tilesetP8.png?v=1611654020438");
}

function setup() {
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");

  $(window).resize(resizeScreen);
  $("#reseedButton").click(reseed);
  resizeScreen();
}

function resizeScreen() {
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  numCols = floor(width / tileSize);
  numRows = floor(height / tileSize);
  grid = generateGrid(numCols, numRows);
}

function draw() {
  drawGrid(grid);
}

// dungeon generation here
function generateGrid(numCols, numRows) {
  let grid = [];

  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      row.push("_");
    }
    grid.push(row);
  }

  function drawRoom(left, right, top, bottom) {
    for (let i = top; i <= bottom; i++) {
      for (let j = left; j <= right; j++) {
        grid[i][j] = ".";
      }
    }
  }

  function generateRoom(regionLeft, regionRight, regionTop, regionBottom) {
    const padding = 3;
    const left = floor(random(regionLeft + padding, regionRight - 8));
    const top = floor(random(regionTop + padding, regionBottom - 8));
    const width = floor(random(5, 8));
    const height = floor(random(5, 8));
    const right = min(left + width, numCols - 2);
    const bottom = min(top + height, numRows - 2);

    drawRoom(left, right, top, bottom);

    return {
      centerX: floor((left + right) / 2),
      centerY: floor((top + bottom) / 2)
    };
  }

  function drawTunnel(from, to) {
    let x1 = from.centerX;
    let y1 = from.centerY;
    let x2 = to.centerX;
    let y2 = to.centerY;

    for (let x = min(x1, x2); x <= max(x1, x2); x++) {
      for (let dy = -1; dy <= 1; dy++) {
        grid[y1 + dy][x] = ".";
      }
    }

    for (let y = min(y1, y2); y <= max(y1, y2); y++) {
      for (let dx = -1; dx <= 1; dx++) {
        grid[y][x2 + dx] = ".";
      }
    }
  }

  const rooms = [
    generateRoom(1, numCols / 3, 1, numRows - 2),
    generateRoom(numCols / 3, 2 * numCols / 3, 1, numRows - 2),
    generateRoom(2 * numCols / 3, numCols - 2, 1, numRows - 2)
  ];

  drawTunnel(rooms[0], rooms[1]);
  drawTunnel(rooms[1], rooms[2]);

  const chestRoom = random(rooms);
  grid[chestRoom.centerY][chestRoom.centerX] = "C";

  return grid;
}

// drawcontext logic here

function drawGrid(grid) {
  background(128);

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      let cell = grid[i][j];

      if (cell === "_") {
        placeTile(i, j, floor(random(4)), 3); 
      } else if (cell === ".") {
        drawContext(grid, i, j, ".", 0, 21); 
      } else if (cell === "C") {
        let flicker = floor((frameCount / 30) % 2);
        drawContext(grid, i, j, "C", 1 + flicker, 28); 
      }
    }
  }
}

function placeTile(i, j, ti, tj) {
  image(
    tilesetImage,
    j * tileSize, i * tileSize,
    tileSize, tileSize,
    ti * 8, tj * 8,
    8, 8
  );
}

function gridCheck(grid, i, j, target) {
  return (
    i >= 0 &&
    j >= 0 &&
    i < grid.length &&
    j < grid[0].length &&
    grid[i][j] === target
  );
}

function gridCode(grid, i, j, target) {
  let north = gridCheck(grid, i - 1, j, target) ? 1 : 0;
  let south = gridCheck(grid, i + 1, j, target) ? 1 : 0;
  let east = gridCheck(grid, i, j + 1, target) ? 1 : 0;
  let west = gridCheck(grid, i, j - 1, target) ? 1 : 0;
  return (north << 0) + (south << 1) + (east << 2) + (west << 3);
}

function drawContext(grid, i, j, target, dti, dtj) {
  const code = gridCode(grid, i, j, target);
  const offset = lookup[code];
  if (offset) {
    const [tiOffset, tjOffset] = offset;
    placeTile(i, j, dti + tiOffset, dtj + tjOffset);
  } else {
    placeTile(i, j, dti, dtj);
  }
}

const lookup = [
  [1, 1], [0, 0], [0, 1], [1, 0],
  [1, 1], [5, 2], [5, 0], [5, 1],
  [2, 1], [7, 2], [7, 0], [7, 1],
  [3, 1], [6, 2], [6, 0], [0, 1]
];