class Body {
  constructor(x1, y1, x2, y2) {
    this.components = [];
    this.start = new Vector(x1, y1);
    this.end = new Vector(x2, y2);
  }

  draw(ctx) {
    this.components.forEach((component) => {
      component.draw(ctx);
    });
  }
}
