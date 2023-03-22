class Rectangle {
  constructor(x1, y1, x2, y2, width) {
    this.vertex = [];
    this.vertex[0] = new Vector(x1, y1);
    this.vertex[1] = new Vector(x2, y2);
    this.direction = this.vertex[1].subtract(this.vertex[0]).unit();
    this.originalDirection = this.direction;
    this.length = this.vertex[1].subtract(this.vertex[0]).magnitude();
    this.width = width;
    this.vertex[2] = this.vertex[1].add(
      this.direction.normal().multiply(this.width)
    );
    this.vertex[3] = this.vertex[2].add(
      this.direction.normal().multiply(-this.length)
    );
    this.position = this.vertex[0]
      .add(this.direction.multiply(this.length / 2))
      .add(this.direction.normal().multiply(this.width / 2));
    this.angle = 0;
    this.rotationMatrix = new Matrix(2, 2);
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.vertex[0].x, this.vertex[0].y);
    ctx.lineTo(this.vertex[1].x, this.vertex[1].y);
    ctx.lineTo(this.vertex[2].x, this.vertex[2].y);
    ctx.lineTo(this.vertex[3].x, this.vertex[3].y);
    ctx.lineTo(this.vertex[0].x, this.vertex[0].y);
    ctx.fill();
    ctx.closePath();
  }

  getVertices(angle) {
    this.rotationMatrix.rotMx22(angle);
    this.direction = this.rotationMatrix.multiplyVec(this.originalDirection);
    this.vertex[0] = this.position
      .add(this.direction.multiply(-this.length / 2))
      .add(this.direction.normal().multiply(this.width / 2));
    this.vertex[1] = this.position
      .add(this.direction.multiply(-this.length / 2))
      .add(this.direction.normal().multiply(-this.width / 2));
    this.vertex[2] = this.position
      .add(this.direction.multiply(this.length / 2))
      .add(this.direction.normal().multiply(-this.width / 2));
    this.vertex[3] = this.position
      .add(this.direction.multiply(this.length / 2))
      .add(this.direction.normal().multiply(this.width / 2));
  }
}
