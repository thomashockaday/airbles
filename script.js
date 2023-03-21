const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 700;

let step = 0;

const GRAVITY = 0.2;
const SURFACE_FRICTION = 0.05;

const boundaryWalls = [
  new Wall(0, 0, canvas.width, 0),
  new Wall(canvas.width, 0, canvas.width, canvas.height),
  new Wall(canvas.width, canvas.height, 0, canvas.height),
  new Wall(0, canvas.height, 0, 0),
];

const BODIES = [
  new Wall(0, 600, 50, 600),
  new Wall(50, 600, 100, 590),
  new Wall(100, 590, 150, 570),
  new Wall(150, 570, 200, 540),
  new Wall(200, 540, 250, 500),
  new Wall(250, 500, 300, 450),
  new Wall(300, 450, 350, 390),
  new Wall(350, 390, 400, 320),
  new Wall(400, 320, 450, 240),
  new Wall(450, 240, 500, 150),
  new Wall(500, 150, 550, 50),
  new Wall(550, 50, 600, 0),
];

const ball = new Ball(100, canvas.height - 200);
const course = new Course(BODIES);

function animate() {
  step++;
  requestAnimationFrame(animate);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Sky
  ctx.fillStyle = "#7ed6df";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ball.update();

  course.bodies.forEach((body) => {
    if (collDetBw(ball, body)) {
      penResBw(ball, body);
      collResBw(ball, body);
    }
  });

  boundaryWalls.forEach((wall) => {
    if (collDetBw(ball, wall)) {
      penResBw(ball, wall);
      collResBw(ball, wall);
    }
  });

  course.draw(ctx);
  ball.draw(ctx);
}

requestAnimationFrame(animate);

canvas.addEventListener("click", (event) => {
  ball.position.x = event.layerX - ball.radius;
  ball.position.y = event.layerY - ball.radius;
  ball.velocity = new Vector(0, 0);
  ball.acceleration = new Vector(2, -2);
});
