const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 700;

let step = 0;
let animationFrame;

const GRAVITY = 0.2;

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

class Course {
  constructor(points) {
    this.points = points;

    this.colour = "#6ab04c";
  }

  draw(ctx) {
    ctx.fillStyle = this.colour;
    ctx.beginPath();

    ctx.moveTo(this.points[0].x, this.points[0].y);

    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
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
    x: canvas.width - 80,
    y: canvas.height - 100,
  },
  {
    x: canvas.width,
    y: canvas.height - 80,
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

const ball = new Ball(100, canvas.height - 200);
const course = new Course(points);

function animate() {
  step++;
  animationFrame = requestAnimationFrame(animate);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Sky
  ctx.fillStyle = "#7ed6df";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ball.update();
  ball.checkBoundaryCollision(canvas);

  if (ball.y + ball.radius > canvas.height - 100) {
    ball.y = canvas.height - 100 - ball.radius;
    ball.velocity.y = 0;
    ball.velocity.x = 0;
  }

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
