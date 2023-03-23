const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 700;

let step = 0;

const GRAVITY = 0.8;

let COLLISIONS = [];

const boundaryWalls = [
  new Wall(0, 0, canvas.width, 0),
  new Wall(canvas.width, 0, canvas.width, canvas.height),
  new Wall(canvas.width, canvas.height, 0, canvas.height),
  new Wall(0, canvas.height, 0, 0),
];

const goal = new Box(625, 1200, 575, 1200, 50);

const COURSE_BODIES = [
  new Box(0, 500, 500, 500, 500),
  new Box(700, 300, 1200, 300, 500),
  new Box(350, 1200, 850, 1200, 500),
];

const ball = new Ball(100, canvas.height - 300, 10, 5);
ball.maxSpeed = 40;
ball.elasticity = 4;
const course = new Course(COURSE_BODIES);

function animate() {
  step++;
  requestAnimationFrame(animate);

  COLLISIONS = [];

  course.bodies.forEach((body) => {
    body.update();
  });

  ball.update();
  goal.update();

  course.bodies.forEach((body) => {
    let bestSat = collide(ball, body);

    if (bestSat) {
      COLLISIONS.push(
        new CollisionData(ball, body, bestSat.axis, bestSat.pen, bestSat.vertex)
      );
    }
  });

  let bestSat = collide(ball, goal);
  if (bestSat) {
    console.log("goal!");
  }

  // boundaryWalls.forEach((wall) => {
  //   let bestSat = collide(ball, wall);

  //   if (bestSat) {
  //     COLLISIONS.push(
  //       new CollisionData(ball, wall, bestSat.axis, bestSat.pen, bestSat.vertex)
  //     );
  //   }
  // });

  COLLISIONS.forEach((collision) => {
    collision.penetrationResolution();
    collision.collisionResolution();
  });

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Sky
  ctx.fillStyle = "#7ed6df";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.scale(0.5, 0.5);
  ctx.translate(-(ball.position.x - 200), 0);
  course.draw(ctx);
  ball.draw(ctx);
  ctx.fillStyle = "yellow";
  goal.draw(ctx);
  ctx.restore();

  if (drawing) {
    ctx.beginPath();
    ctx.moveTo(startPosition.x, startPosition.y);
    ctx.lineTo(endPosition.x, endPosition.y);
    ctx.arc(endPosition.x, endPosition.y, 10, 0, 2 * Math.PI);
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.closePath();
  }
}

requestAnimationFrame(animate);

// canvas.addEventListener("click", (event) => {
//   ball.position.x = event.layerX;
//   ball.position.y = event.layerY;
//   ball.velocity = new Vector(20, -2);
//   ball.acceleration = new Vector(0, 0);
// });

let drawing = false;
let startPosition = null;
let endPosition = null;

canvas.addEventListener("mousedown", (event) => {
  drawing = true;
  startPosition = new Vector(event.layerX, event.layerY);
  endPosition = startPosition;
});

canvas.addEventListener("mouseup", (event) => {
  drawing = false;
  const newVelocity = startPosition.subtract(endPosition);
  ball.velocity = newVelocity;
  ball.acceleration = new Vector(0, 0);
});

canvas.addEventListener("mousemove", (event) => {
  if (drawing) {
    endPosition = new Vector(event.layerX, event.layerY);
  }
});
