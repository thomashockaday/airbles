class CollisionData {
  constructor(o1, o2, normal, penetrationDepth, collisionPoint) {
    this.o1 = o1;
    this.o2 = o2;
    this.normal = normal;
    this.penetrationDepth = penetrationDepth;
    this.collisionPoint = collisionPoint;
  }

  penetrationResolution() {
    const penetrationResolution = this.normal.multiply(
      this.penetrationDepth / (this.o1.inverseMass + this.o2.inverseMass)
    );

    this.o1.position = this.o1.position.add(
      penetrationResolution.multiply(this.o1.inverseMass)
    );
    this.o2.position = this.o2.position.add(
      penetrationResolution.multiply(-this.o2.inverseMass)
    );
  }

  collisionResolution() {
    const collisionArm1 = this.collisionPoint.subtract(
      this.o1.components[0].position
    );
    const rotationalVelocity1 = new Vector(
      -this.o1.angularVelocity * collisionArm1.y,
      this.o1.angularVelocity * collisionArm1.x
    );
    const closingVelocity1 = this.o1.velocity.add(rotationalVelocity1);
    const collisionArm2 = this.collisionPoint.subtract(
      this.o2.components[0].position
    );
    const rotationalVelocity2 = new Vector(
      -this.o2.angularVelocity * collisionArm2.y,
      this.o2.angularVelocity * collisionArm2.x
    );
    const closingVelocity2 = this.o2.velocity.add(rotationalVelocity2);

    let impulseAugmentation1 = Vector.cross(collisionArm1, this.normal);
    impulseAugmentation1 =
      impulseAugmentation1 * this.o1.inverseInertia * impulseAugmentation1;
    let impulseAugmentation2 = Vector.cross(collisionArm2, this.normal);
    impulseAugmentation2 =
      impulseAugmentation2 * this.o2.inverseInertia * impulseAugmentation2;

    const relativeVelocity = closingVelocity1.subtract(closingVelocity2);
    const separationVelocity = Vector.dot(relativeVelocity, this.normal);
    const newSeparationVelocity =
      -separationVelocity * Math.min(this.o1.elasticity, this.o2.elasticity);
    const velocitySeparationDifference =
      newSeparationVelocity - separationVelocity;

    const impulse =
      velocitySeparationDifference /
      (this.o1.inverseMass +
        this.o2.inverseMass +
        impulseAugmentation1 +
        impulseAugmentation2);
    const impulseVec = this.normal.multiply(impulse);

    this.o1.velocity = this.o1.velocity.add(
      impulseVec.multiply(this.o1.inverseMass)
    );
    this.o2.velocity = this.o2.velocity.add(
      impulseVec.multiply(-this.o2.inverseMass)
    );

    this.o1.angularVelocity +=
      this.o1.inverseInertia * Vector.cross(collisionArm1, impulseVec);
    this.o2.angularVelocity -=
      this.o2.inverseInertia * Vector.cross(collisionArm2, impulseVec);
  }
}
