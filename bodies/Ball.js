class Ball extends Body {
  constructor(x, y) {
    super();
    this.position = new Vector(x, y);

    this.elasticity = 1;
    this.velocity = new Vector(0, 0);
    this.acceleration = new Vector(0, 0);
    this.speed = 1;
    this.radius = 10;
    this.colour = "#EA2027";
  }

  update() {
    this.acceleration = this.acceleration.add(new Vector(0, GRAVITY));
    this.acceleration = this.acceleration.unit().multiply(this.speed);
    this.velocity = this.velocity.add(this.acceleration);
    this.velocity = this.velocity.multiply(1 - SURFACE_FRICTION);
    this.position = this.position.add(this.velocity);
  }

  draw(ctx) {
    ctx.fillStyle = this.colour;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}
