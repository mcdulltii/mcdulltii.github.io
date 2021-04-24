let size;
let mode;

let col1, col2;

function setup() {
  colorMode(HSB, 1.0);
  createCanvas(windowWidth, windowHeight);
  stroke(2);
  size = 50;
  col1 = color(1, 0, 0);
  col2 = color(random(.1,.8), random(0,1), .8);

  noLoop();
}

function draw() {
  let hex_width = size * 2;
  let hex_height = sqrt(3)/2 * hex_width;
  let horiz = hex_width * 3/4;
  let vert = hex_height;
  let max_row = ceil(width/horiz);
  let max_col = ceil(height/vert);
  let diagonal_percent = 0;
  
  for (let i = 0; i <= max_row; i++) {
    for (let j = 0; j <= max_col; j++) {
      let x = i*horiz;
      let y = ((i%2) * (.5*vert)) + (j*vert);

      diagonal_percent = norm(-x-y, 0, -width-height);
      let randconst = 0.024184911511513408; // random(0, 1)
      let hex_col = lerpColor(col1, col2, constrain(diagonal_percent + randconst, 0, 1));
      fill(hex_col);
      stroke(hex_col);
      polygon(x, y, size, 6);
    }
  }
}

function polygon(x, y, radius, npoints) {
  let angle = TWO_PI / npoints;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}