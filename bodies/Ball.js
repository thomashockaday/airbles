class Ball extends Body {
  constructor(x, y, radius, mass) {
    super();
    this.components = [new Circle(x, y, radius)];
    this.position = new Vector(x, y);
    this.mass = mass;
    if (this.mass === 0) {
      this.inverseMass = 0;
    } else {
      this.inverseMass = 1 / this.mass;
    }
    this.friction = 0.04;
  }

  setPosition(x, y) {
    this.position.set(x, y);
    this.components[0].position = this.position;
  }

  update() {
    super.update();
    this.setPosition(
      this.position.add(this.velocity).x,
      this.position.add(this.velocity).y
    );
  }
}
