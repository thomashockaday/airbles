const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 700;

let step = 0;
let animationFrame;

const GRAVITY = 0.2;
const SURFACE_FRICTION = 0.05;

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(v) {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  subtract(v) {
    return new Vector(this.x - v.x, this.y - v.y);
  }

  magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  multiply(n) {
    return new Vector(this.x * n, this.y * n);
  }

  unit() {
    if (this.magnitude() === 0) {
      return new Vector(0, 0);
    }

    return new Vector(this.x / this.magnitude(), this.y / this.magnitude());
  }

  static dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
  }
}

class Ball {
  constructor(x, y) {
    this.position = new Vector(x, y);

    this.elasticity = 1;
    this.velocity = new Vector(0, 0);
    this.acceleration = new Vector(0, 0);
    this.speed = 1;
    this.radius = 10;
    this.colour = "#EA2027";
  }

  update() {
    this.acceleration = this.acceleration.add(new Vector(0, GRAVITY));
    this.acceleration = this.acceleration.unit().multiply(this.speed);
    this.velocity = this.velocity.add(this.acceleration);
    this.velocity = this.velocity.multiply(1 - SURFACE_FRICTION);
    this.position = this.position.add(this.velocity);
  }

  draw(ctx) {
    ctx.fillStyle = this.colour;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}

class Wall {
  constructor(x1, y1, x2, y2) {
    this.start = new Vector(x1, y1);
    this.end = new Vector(x2, y2);
  }

  unit() {
    return this.end.subtract(this.start).unit();
  }
}

class Course {
  constructor(walls) {
    this.walls = walls;

    this.colour = "#6ab04c";
  }

  draw(ctx) {
    ctx.fillStyle = this.colour;
    ctx.beginPath();
    ctx.moveTo(this.walls[0].start.x, this.walls[0].start.y);

    for (let i = 1; i < this.walls.length; i++) {
      ctx.lineTo(this.walls[i].start.x, this.walls[i].start.y);
    }

    ctx.fill();
  }
}

function closestPointBw(ball, wall) {
  let ballToWallStart = wall.start.subtract(ball.position);
  if (Vector.dot(wall.unit(), ballToWallStart) > 0) {
    return wall.start;
  }

  let wallEndToBall = ball.position.subtract(wall.end);
  if (Vector.dot(wall.unit(), wallEndToBall) > 0) {
    return wall.end;
  }

  let closestDist = Vector.dot(wall.unit(), ballToWallStart);
  let closestVect = wall.unit().multiply(closestDist);
  return wall.start.subtract(closestVect);
}

function collDetBw(ball, wall) {
  let ballToClosest = closestPointBw(ball, wall).subtract(ball.position);

  if (ballToClosest.magnitude() <= ball.radius) {
    return true;
  }

  return false;
}

function penResBw(ball, wall) {
  let penVect = ball.position.subtract(closestPointBw(ball, wall));
  ball.position = ball.position.add(
    penVect.unit().multiply(ball.radius - penVect.magnitude())
  );
}

function collResBw(ball, wall) {
  let normal = ball.position.subtract(closestPointBw(ball, wall)).unit();
  let sepVel = Vector.dot(ball.velocity, normal);
  let newSepVel = -sepVel * ball.elasticity;
  let vsepDiff = sepVel - newSepVel;
  ball.velocity = ball.velocity.add(normal.multiply(-vsepDiff));
}

const points = [
  {
    x: 0,
    y: canvas.height - 100,
  },
  {
    x: canvas.width / 3,
    y: canvas.height - 50,
  },
  {
    x: canvas.width / 1.5,
    y: canvas.height - 50,
  },
  {
    x: canvas.width,
    y: canvas.height - 200,
  },
  {
    x: canvas.width,
    y: canvas.height,
  },
  {
    x: 0,
    y: canvas.height,
  },
  {
    x: 0,
    y: canvas.height - 100,
  },
];

const boundaryWalls = [
  new Wall(0, 0, canvas.width, 0),
  new Wall(canvas.width, 0, canvas.width, canvas.height),
  new Wall(canvas.width, canvas.height, 0, canvas.height),
  new Wall(0, canvas.height, 0, 0),
];

const courseWalls = [];
for (let i = 0; i < points.length - 1; i++) {
  courseWalls.push(
    new Wall(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y)
  );
}

const ball = new Ball(100, canvas.height - 200);
const course = new Course(courseWalls);

function animate() {
  step++;
  animationFrame = requestAnimationFrame(animate);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Sky
  ctx.fillStyle = "#7ed6df";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ball.update();

  course.walls.forEach((wall) => {
    if (collDetBw(ball, wall)) {
      penResBw(ball, wall);
      collResBw(ball, wall);
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

animate();

canvas.addEventListener("click", (event) => {
  ball.position.x = event.layerX - ball.radius;
  ball.position.y = event.layerY - ball.radius;
  ball.velocity = new Vector(0, 0);
  ball.acceleration = new Vector(2, -2);
});
