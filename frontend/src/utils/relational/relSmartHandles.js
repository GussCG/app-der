import { Position } from "reactflow";

function getNodeCenter(node) {
  const width = 200;
  const height = 100;

  return {
    x: node.position.x + width / 2,
    y: node.position.y + height / 2,
  };
}

export function getSmartHandles(sourceNode, targetNode) {
  const sourceCenter = getNodeCenter(sourceNode);
  const targetCenter = getNodeCenter(targetNode);

  const dx = targetCenter.x - sourceCenter.x;
  const dy = targetCenter.y - sourceCenter.y;

  if (sourceNode.id === targetNode.id) {
    return {
      sourceHandle: "right",
      targetHandle: "top-target",
    };
  }

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) {
      return {
        sourceHandle: "right",
        targetHandle: "left-target",
      };
    } else {
      return {
        sourceHandle: "left",
        targetHandle: "right-target",
      };
    }
  } else {
    if (dy > 0) {
      return {
        sourceHandle: "bottom",
        targetHandle: "top-target",
      };
    } else {
      return {
        sourceHandle: "top",
        targetHandle: "bottom-target",
      };
    }
  }
}
