class Line {
  constructor(x1, y1, x2, y2) {
    this.vertex = [new Vector(x1, y1), new Vector(x2, y2)];
    this.direction = this.vertex[1].subtract(this.vertex[0]).unit();
    this.magnitude = this.vertex[1].subtract(this.vertex[0]).magnitude();
    this.position = new Vector(
      (this.vertex[0].x + this.vertex[1].x) / 2,
      (this.vertex[0].y + this.vertex[1].y) / 2
    );
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.vertex[0].x, this.vertex[0].y);
    ctx.lineTo(this.vertex[1].x, this.vertex[1].y);
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();
  }
}
