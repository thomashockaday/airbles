class Wall extends Body {
  constructor(x1, y1, x2, y2) {
    super();
    this.components = [new Line(x1, y1, x2, y2)];
    this.position = new Vector((x1 + x2) / 2, (y1 + y2) / 2);
  }
}
