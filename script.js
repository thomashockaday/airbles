const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 700;

let step = 0;

const GRAVITY = 0.8;

let COLLISIONS = [];

const goal = new Box(625, 1250, 575, 1250, 50);
goal.colour = "#f39c12";

const ball = new Ball(100, canvas.height - 300, 10, 5);
ball.maxSpeed = 40;
ball.elasticity = 4;
ball.colour = "#EA2027";

const COURSE_BODIES = [
  new Box(0, 500, 500, 500, 500),
  new Box(700, 300, 1200, 300, 500),
  new Box(350, 1200, 575, 1200, 225),
  new Box(625, 1200, 850, 1200, 225),
  new Box(350, 1250, 850, 1250, 500),
  ball,
  // goal,
];

const course = new Course(COURSE_BODIES);

function animate() {
  step++;
  requestAnimationFrame(animate);

  COLLISIONS = [];

  course.bodies.forEach((body) => {
    body.update();
  });

  course.bodies.forEach((body, index) => {
    for (
      let bodyPair = index + 1;
      bodyPair < course.bodies.length;
      bodyPair++
    ) {
      if (
        (body.mass !== 0 || course.bodies[bodyPair].mass !== 0) &&
        collide(body, course.bodies[bodyPair])
      ) {
        let bestSat = collide(body, course.bodies[bodyPair]);
        COLLISIONS.push(
          new CollisionData(
            body,
            course.bodies[bodyPair],
            bestSat.axis,
            bestSat.pen,
            bestSat.vertex
          )
        );
      }
    }
  });

  let bestSat = collide(ball, goal);
  if (bestSat) {
    console.log("goal!");
    ball.maxSpeed = 10;
    ball.acceleration.set(0, 0);
  }

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
  // Camera effect
  // ctx.translate(-(ball.position.x - 200), 0);
  course.draw(ctx);

  ctx.restore();

  if (drawing) {
    ctx.strokeStyle = "#ecf0f1";
    ctx.fillStyle = "#ecf0f1";
    ctx.beginPath();
    ctx.moveTo(startPosition.x, startPosition.y);
    ctx.lineTo(endPosition.x, endPosition.y);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.moveTo(endPosition.x, endPosition.y);
    ctx.arc(endPosition.x, endPosition.y, 10, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }
}

requestAnimationFrame(animate);

let drawing = false;
let startPosition = null;
let endPosition = null;

function handleMousedown(event) {
  drawing = true;
  startPosition = new Vector(event.layerX, event.layerY);
  endPosition = startPosition;
}

function handleMouseup(event) {
  drawing = false;
  const newVelocity = startPosition.subtract(endPosition);
  ball.velocity = newVelocity;
  ball.acceleration = new Vector(0, 0);
}

function handleMousemove(event) {
  if (drawing) {
    endPosition = new Vector(event.layerX, event.layerY);
  }
}

canvas.addEventListener("mousedown", handleMousedown);
canvas.addEventListener("touchstart", handleMousedown);

canvas.addEventListener("mouseup", handleMouseup);
canvas.addEventListener("touchend", handleMouseup);
canvas.addEventListener("touchcancel", handleMouseup);

canvas.addEventListener("mousemove", handleMousemove);
canvas.addEventListener("touchmove", handleMousemove);
