const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 700;

let step = 0;
let animationFrame;

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
}

animate();
