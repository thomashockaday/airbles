class Ball extends Body {
  constructor(x, y, radius) {
    super();
    this.components = [new Circle(x, y, radius)];
    this.position = new Vector(x, y);
    this.colour = "#EA2027";
  }

  setPosition(x, y) {
    this.position.set(x, y);
    this.components[0].position = this.position;
  }

  update() {
    super.update();
    this.velocity = this.velocity.add(new Vector(0, GRAVITY));
    this.setPosition(
      this.position.add(this.velocity).x,
      this.position.add(this.velocity).y
    );
  }
}
