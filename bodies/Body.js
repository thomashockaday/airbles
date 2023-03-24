class Body {
  constructor(x, y) {
    this.components = [];
    this.position = new Vector(x, y);
    this.mass = 0;
    this.inverseMass = 0;
    this.inertia = 0;
    this.inverseInertia = 0;
    this.elasticity = 1;

    this.friction = 0;
    this.angularFriction = 0;
    this.maxSpeed = 0;

    this.velocity = new Vector(0, 0);
    this.acceleration = new Vector(0, 0);
    this.keyForce = 1;
    this.angKeyForce = 0.1;
    this.angle = 0;
    this.angularVelocity = 0;
    this.player = false;
  }

  update() {
    this.acceleration = this.acceleration.unit().multiply(this.keyForce);
    if (this.mass > 0) {
      this.acceleration = this.acceleration.add(new Vector(0, GRAVITY));
    }
    this.velocity = this.velocity.add(this.acceleration);
    this.velocity = this.velocity.multiply(1 - this.friction);
    if (this.velocity.magnitude() > this.maxSpeed && this.maxSpeed !== 0) {
      this.velocity = this.velocity.unit().multiply(this.maxSpeed);
    }
    this.angularVelocity *= 1 - this.angularFriction;
  }

  draw(ctx) {
    if (this.colour) {
      ctx.fillStyle = this.colour;
    }

    this.components.forEach((component) => {
      component.draw(ctx);
    });
  }
}
