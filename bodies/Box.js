class Box extends Body {
  constructor(x1, y1, x2, y2, width) {
    super();
    this.components = [new Rectangle(x1, y1, x2, y2, width)];
    this.position = this.components[0].position;
    if (this.mass === 0) {
      this.inverseMass = 0;
    } else {
      this.inverseMass = 1 / this.mass;
    }
    this.inertia =
      (this.mass *
        (this.components[0].width ** 2 + this.components[0].length ** 2)) /
      12;
    if (this.inertia === 0) {
      this.inverseInertia = 0;
    } else {
      this.inverseInertia = 1 / this.inertia;
    }
  }

  setPosition(x, y) {
    this.position.set(x, y);
    this.components[0].position = this.position;
    this.components[0].getVertices(this.angle + this.angularVelocity);
    this.angle += this.angularVelocity;
  }

  update() {
    super.update();
    this.setPosition(
      this.position.add(this.velocity).x,
      this.position.add(this.velocity).y
    );
  }
}
