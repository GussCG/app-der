// utils/er/floatingEdgeUtils.js
import { Position } from "reactflow";

function getParams(nodeA, nodeB) {
  const centerA = getNodeCenter(nodeA);
  const centerB = getNodeCenter(nodeB);

  const horizontalDiff = Math.abs(centerA.x - centerB.x);
  const verticalDiff = Math.abs(centerA.y - centerB.y);

  let position;

  if (horizontalDiff > verticalDiff) {
    position = centerA.x > centerB.x ? Position.Left : Position.Right;
  } else {
    position = centerA.y > centerB.y ? Position.Top : Position.Bottom;
  }

  const [x, y] = getIntersectionPoint(nodeA, position);
  return { x, y, position };
}

function getNodeCenter(node) {
  return {
    x: node.positionAbsolute.x + node.width / 2,
    y: node.positionAbsolute.y + node.height / 2,
  };
}

function getIntersectionPoint(node, position) {
  const { width, height } = node;
  const { x, y } = node.positionAbsolute;

  switch (position) {
    case Position.Top:
      return [x + width / 2, y];
    case Position.Bottom:
      return [x + width / 2, y + height];
    case Position.Left:
      return [x, y + height / 2];
    case Position.Right:
      return [x + width, y + height / 2];
    default:
      return [x, y];
  }
}

export function getEdgeParams(source, target) {
  const { x: sx, y: sy, position: sourcePos } = getParams(source, target);
  const { x: tx, y: ty, position: targetPos } = getParams(target, source);

  return { sx, sy, tx, ty, sourcePos, targetPos };
}
