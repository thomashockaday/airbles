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

function collDetBw(ball, wall) {
  let ballToClosest = closestPointBw(ball, wall).subtract(ball.position);

  if (ballToClosest.magnitude() <= ball.radius) {
    return true;
  }

  return false;
}

function penResBw(ball, wall) {
  let penVect = ball.position.subtract(closestPointBw(ball, wall));
  ball.position = ball.position.add(
    penVect.unit().multiply(ball.radius - penVect.magnitude())
  );
}

function collResBw(ball, wall) {
  let normal = ball.position.subtract(closestPointBw(ball, wall)).unit();
  let sepVel = Vector.dot(ball.velocity, normal);
  let newSepVel = -sepVel * ball.elasticity;
  let vsepDiff = sepVel - newSepVel;
  ball.velocity = ball.velocity.add(normal.multiply(-vsepDiff));
}
