function closestPointBw(ball, wall) {
  let ballToWallStart = wall.start.subtract(ball.position);
  if (Vector.dot(wall.unit(), ballToWallStart) > 0) {
    return wall.start;
  }

  let wallEndToBall = ball.position.subtract(wall.end);
  if (Vector.dot(wall.unit(), wallEndToBall) > 0) {
    return wall.end;
  }

  let closestDist = Vector.dot(wall.unit(), ballToWallStart);
  let closestVect = wall.unit().multiply(closestDist);
  return wall.start.subtract(closestVect);
}

function penResBw(ball, wall) {
  let penVect = ball.position.subtract(closestPointBw(ball, wall));
  ball.position = ball.position.add(
    penVect.unit().multiply(10 - penVect.magnitude())
  );
}

function collResBw(ball, wall) {
  let normal = ball.position.subtract(closestPointBw(ball, wall)).unit();
  let sepVel = Vector.dot(ball.velocity, normal);
  let newSepVel = -sepVel * ball.elasticity;
  let vsepDiff = sepVel - newSepVel;
  ball.velocity = ball.velocity.add(normal.multiply(-vsepDiff));
}

function sat(o1, o2) {
  const axes1 = [];
  const axes2 = [];

  axes1.push(
    closestVertexToPoint(o2, o1.position).subtract(o1.position).unit()
  );
  axes2.push(o2.direction.normal());

  let proj1 = 0;
  let proj2 = 0;

  for (let i = 0; i < axes1.length; i++) {
    proj1 = projShapeOntoAxis(axes1[i], o1);
    proj2 = projShapeOntoAxis(axes1[i], o2);
    let overlap =
      Math.min(proj1.max, proj2.max) - Math.max(proj1.min, proj2.min);

    if (overlap < 0) {
      return false;
    }
  }

  for (let i = 0; i < axes2.length; i++) {
    proj1 = projShapeOntoAxis(axes2[i], o1);
    proj2 = projShapeOntoAxis(axes2[i], o2);
    overlap = Math.min(proj1.max, proj2.max) - Math.max(proj1.min, proj2.min);

    if (overlap < 0) {
      return false;
    }
  }

  return true;
}

function projShapeOntoAxis(axis, o) {
  setBallVerticesAlongAxis(o, axis);
  let min = Vector.dot(axis, o.vertex[0]);
  let max = min;

  for (let i = 0; i < o.vertex.length; i++) {
    let p = Vector.dot(axis, o.vertex[i]);

    if (p < min) {
      min = p;
    }

    if (p > max) {
      max = p;
    }
  }

  return {
    min: min,
    max: max,
  };
}

function closestVertexToPoint(o, point) {
  let closestVertex = null;
  let minDist = null;

  for (let i = 0; i < o.vertex.length; i++) {
    if (point.subtract(o.vertex[i]).magnitude() < minDist || minDist === null) {
      closestVertex = o.vertex[i];
      minDist = point.subtract(o.vertex[i]).magnitude();
    }
  }

  return closestVertex;
}

function setBallVerticesAlongAxis(o, axis) {
  if (o instanceof Circle) {
    o.vertex[0] = o.position.add(axis.unit().multiply(-o.radius));
    o.vertex[1] = o.position.add(axis.unit().multiply(o.radius));
  }
}
