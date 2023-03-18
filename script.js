const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 700;

let step = 0;
let animationFrame;

const GRAVITY = 0.2;
const AIR_RESISTANCE = 0.01;
const SURFACE_FRICTION = 0.08;

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.velocity = {
      x: 0,
      y: 0,
    };

    this.radius = 10;
    this.colour = "#EA2027";
  }

  update() {
    this.velocity.y += GRAVITY;

    if (this.velocity.x < 0) {
      this.velocity.x += this.grounded ? SURFACE_FRICTION : AIR_RESISTANCE;
    }

    if (this.velocity.x > 0) {
      this.velocity.x -= this.grounded ? SURFACE_FRICTION : AIR_RESISTANCE;
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }

  checkBoundaryCollision(canvas) {
    if (this.x > canvas.width - this.radius) {
      this.x = canvas.width - this.radius;
      this.velocity.x *= -1;
    } else if (this.x < this.radius) {
      this.x = this.radius;
      this.velocity.x *= -1;
    } else if (this.y > canvas.height - this.radius) {
      this.y = canvas.height - this.radius;
      this.velocity.y *= -1;
    } else if (this.y < this.radius) {
      this.y = this.radius;
      this.velocity.y *= -1;
    }
  }

  draw(ctx) {
    ctx.fillStyle = this.colour;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}

class Wall {
  constructor(x1, y1, x2, y2) {
    this.start = new Vector(x1, y1);
    this.end = new Vector(x2, y2);
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

const walls = [];
for (let i = 0; i < points.length - 1; i++) {
  walls.push(
    new Wall(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y)
  );
}

const ball = new Ball(100, canvas.height - 200);
const course = new Course(walls);

function animate() {
  step++;
  animationFrame = requestAnimationFrame(animate);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Sky
  ctx.fillStyle = "#7ed6df";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ball.update();
  ball.checkBoundaryCollision(canvas);

  course.draw(ctx);
  ball.draw(ctx);
}

animate();

canvas.addEventListener("click", (event) => {
  ball.x = event.layerX - ball.radius;
  ball.y = event.layerY - ball.radius;
  ball.velocity.y = -2;
  ball.velocity.x = 4;
});
