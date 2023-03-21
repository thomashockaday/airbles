class Circle {
  constructor(x, y, radius) {
    this.vertex = [];
    this.position = new Vector(x, y);
    this.radius = radius;
    this.colour = "#EA2027";
  }

  draw(ctx) {
    ctx.fillStyle = this.colour;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }
}
