class Course {
  constructor(bodies) {
    this.bodies = bodies;

    this.colour = "#6ab04c";
  }

  draw(ctx) {
    ctx.fillStyle = this.colour;

    this.bodies.forEach((body) => {
      body.draw(ctx);
    });
  }
}
