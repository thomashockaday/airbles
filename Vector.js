class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(v) {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  subtract(v) {
    return new Vector(this.x - v.x, this.y - v.y);
  }

  magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  multiply(n) {
    return new Vector(this.x * n, this.y * n);
  }

  unit() {
    if (this.magnitude() === 0) {
      return new Vector(0, 0);
    }

    return new Vector(this.x / this.magnitude(), this.y / this.magnitude());
  }

  static dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
  }
}
