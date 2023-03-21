const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 700;

let step = 0;

const GRAVITY = 0.2;

let COLLISIONS = [];

const boundaryWalls = [
  new Wall(0, 0, canvas.width, 0),
  new Wall(canvas.width, 0, canvas.width, canvas.height),
  new Wall(canvas.width, canvas.height, 0, canvas.height),
  new Wall(0, canvas.height, 0, 0),
];

const COURSE_BODIES = [
  new Wall(0, 600, 500, 600),
  // new Wall(50, 600, 100, 590),
  // new Wall(100, 590, 150, 570),
  // new Wall(150, 570, 200, 540),
  // new Wall(200, 540, 250, 500),
  // new Wall(250, 500, 300, 450),
  // new Wall(300, 450, 350, 390),
  // new Wall(350, 390, 400, 320),
  // new Wall(400, 320, 450, 240),
  // new Wall(450, 240, 500, 150),
  // new Wall(500, 150, 550, 50),
  // new Wall(550, 50, 600, 0),
];

const ball = new Ball(100, canvas.height - 200, 10, 5);
ball.maxSpeed = 10;
const course = new Course(COURSE_BODIES);

function animate() {
  step++;
  requestAnimationFrame(animate);

  COLLISIONS = [];

  ball.update();

  course.bodies.forEach((body) => {
    let bestSat = collide(ball, body);

    if (bestSat) {
      COLLISIONS.push(
        new CollisionData(ball, body, bestSat.axis, bestSat.pen, bestSat.vertex)
      );
    }
  });

  boundaryWalls.forEach((wall) => {
    let bestSat = collide(ball, wall);

    if (bestSat) {
      COLLISIONS.push(
        new CollisionData(ball, wall, bestSat.axis, bestSat.pen, bestSat.vertex)
      );
    }
  });

  COLLISIONS.forEach((collision) => {
    collision.penetrationResolution();
    collision.collisionResolution();
  });

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Sky
  ctx.fillStyle = "#7ed6df";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  course.draw(ctx);
  ball.draw(ctx);
}

requestAnimationFrame(animate);

canvas.addEventListener("click", (event) => {
  ball.position.x = event.layerX;
  ball.position.y = event.layerY;
  ball.velocity = new Vector(2, -2);
  ball.acceleration = new Vector(0, 0);
});
