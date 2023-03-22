function collide(o1, o2) {
  let bestSat = {
    pen: null,
    axis: null,
    vertex: null,
  };

  for (let o1comp = 0; o1comp < o1.components.length; o1comp++) {
    for (let o2comp = 0; o2comp < o2.components.length; o2comp++) {
      if (sat(o1.components[o1comp], o2.components[o2comp]).pen > bestSat.pen) {
        bestSat = sat(o1.components[o1comp], o2.components[o2comp]);
      }
    }
  }

  if (bestSat.pen !== null) {
    return bestSat;
  }

  return false;
}

function sat(o1, o2) {
  let minOverlap = null;
  let smallestAxis = null;
  let vertexObj = null;

  let axes = findAxes(o1, o2);
  let proj1 = 0;
  let proj2 = 0;
  let firstShapeAxes = getShapeAxes(o1);

  for (let i = 0; i < axes.length; i++) {
    proj1 = projShapeOntoAxis(axes[i], o1);
    proj2 = projShapeOntoAxis(axes[i], o2);
    let overlap =
      Math.min(proj1.max, proj2.max) - Math.max(proj1.min, proj2.min);

    if (overlap < 0) {
      return false;
    }

    if (
      (proj1.max > proj2.max && proj1.min < proj2.min) ||
      (proj1.max < proj2.max && proj1.min > proj2.min)
    ) {
      let mins = Math.abs(proj1.min - proj2.min);
      let maxs = Math.abs(proj1.max - proj2.max);

      if (mins < maxs) {
        overlap += mins;
      } else {
        overlap += maxs;
        axes[i] = axes[i].multiply(-1);
      }
    }

    if (overlap < minOverlap || minOverlap === null) {
      minOverlap = overlap;
      smallestAxis = axes[i];

      if (i < firstShapeAxes) {
        vertexObj = o2;

        if (proj1.max > proj2.max) {
          smallestAxis = axes[i].multiply(-1);
        }
      } else {
        vertexObj = o1;

        if (proj1.max < proj2.max) {
          smallestAxis = axes[i].multiply(-1);
        }
      }
    }
  }

  let contactVertex = projShapeOntoAxis(smallestAxis, vertexObj).collVertex;

  if (vertexObj === o2) {
    smallestAxis = smallestAxis.multiply(-1);
  }

  return {
    pen: minOverlap,
    axis: smallestAxis,
    vertex: contactVertex,
  };
}

function projShapeOntoAxis(axis, o) {
  setBallVerticesAlongAxis(o, axis);
  let min = Vector.dot(axis, o.vertex[0]);
  let max = min;
  let collVertex = o.vertex[0];

  for (let i = 0; i < o.vertex.length; i++) {
    let p = Vector.dot(axis, o.vertex[i]);

    if (p < min) {
      min = p;
      collVertex = o.vertex[i];
    }

    if (p > max) {
      max = p;
    }
  }

  return {
    min: min,
    max: max,
    collVertex: collVertex,
  };
}

function findAxes(o1, o2) {
  let axes = [];

  if (o1 instanceof Circle && o2 instanceof Circle) {
    if (o2.position.subtract(o1.position).magnitude() > 0) {
      axes.push(o2.position.subtract(o1.position).unit());
    } else {
      axes.push(new Vector(Math.random(), Math.random()).unit());
    }

    return axes;
  }

  if (o1 instanceof Circle) {
    axes.push(
      closestVertexToPoint(o2, o1.position).subtract(o1.position).unit()
    );
  }

  if (o1 instanceof Line) {
    axes.push(o1.direction.normal());
  }

  if (o1 instanceof Rectangle) {
    axes.push(o1.direction.normal());
    axes.push(o1.direction);
  }

  if (o2 instanceof Circle) {
    axes.push(
      closestVertexToPoint(o1, o2.position).subtract(o2.position).unit()
    );
  }

  if (o2 instanceof Line) {
    axes.push(o2.direction.normal());
  }

  if (o2 instanceof Rectangle) {
    axes.push(o2.direction.normal());
    axes.push(o2.direction);
  }

  return axes;
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

function getShapeAxes(o) {
  if (o instanceof Circle || o instanceof Line) {
    return 1;
  }

  if (o instanceof Rectangle) {
    return 2;
  }
}

function setBallVerticesAlongAxis(o, axis) {
  if (o instanceof Circle) {
    o.vertex[0] = o.position.add(axis.unit().multiply(-o.radius));
    o.vertex[1] = o.position.add(axis.unit().multiply(o.radius));
  }
}
