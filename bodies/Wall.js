class Wall extends Body {
  constructor(x1, y1, x2, y2) {
    super();
    this.start = new Vector(x1, y1);
    this.end = new Vector(x2, y2);
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.start.x, this.start.y);
    ctx.lineTo(this.end.x, this.end.y);
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();
  }

  unit() {
    return this.end.subtract(this.start).unit();
  }
}