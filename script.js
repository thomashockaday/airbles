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

  update(ctx) {
    this.velocity.y += GRAVITY;
    this.y += this.velocity.y;

    if (this.y + this.radius > canvas.height - 100) {
      this.y = canvas.height - 100 - this.radius;
      this.velocity.y = 0;
    }

    this.draw(ctx);
  }

  draw(ctx) {
    ctx.fillStyle = this.colour;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}

const ball = new Ball(100, canvas.height - 200);

function animate() {
  step++;
  animationFrame = requestAnimationFrame(animate);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Sky
  ctx.fillStyle = "#7ed6df";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Course
  ctx.fillStyle = "#6ab04c";
  ctx.beginPath();
  ctx.strokeStyle = "black";
  ctx.lineWidth = 5;
  ctx.moveTo(0, canvas.height - 100);
  ctx.arcTo(
    canvas.width,
    canvas.height - 100,
    canvas.width,
    canvas.height - 120,
    canvas.width / 3
  );
  ctx.lineTo(canvas.width, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.lineTo(0, canvas.height - 100);
  ctx.fill();

  ball.update(ctx);
}

animate();
