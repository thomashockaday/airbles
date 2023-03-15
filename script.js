const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let step = 0;
let animationFrame;

function animate() {
  step++;
  animationFrame = requestAnimationFrame(animate);
}

animate();
