import React from "react";
import { colorToBgNode } from "../../../utils/colorToBgNode";

function ERAttributeNode({
  attr,
  position,
  attrHeight,
  color,
  theme,
  parentCenter,
}) {
  const { x, y } = position;
  const { cx: pCX, cy: pCY } = parentCenter;

  const calculateRx = (name = "") => {
    const textWidth = name.length * 4.5 + 20;
    return Math.max(textWidth, 40);
  };

  const rx = calculateRx(attr.name);
  const ry = attrHeight / 2;

  const stroke = color || "#0f1419";
  const fill = colorToBgNode(color) || "#1a1a1a";
  const textFill = theme === "dark" ? "#fff" : "#000";

  const renderComposite = () => {
    const children = attr.children || [];
    const numChildren = children.length;
    if (numChildren === 0) return null;

    const angleToOutside = Math.atan2(y - pCY, x - pCX);
    const DISTANCE = 85 + numChildren * 6;
    const sweep = Math.PI * 1.1;
    const startAngle = angleToOutside - sweep / 2;
    const angleStep = numChildren > 1 ? sweep / (numChildren - 1) : 0;

    const borderOffset = attr.kind === "multivalued" ? 6 : 0;

    return children.map((child, i) => {
      const angle =
        numChildren === 1 ? angleToOutside : startAngle + i * angleStep;

      const childCx = x + Math.cos(angle) * DISTANCE;
      const childCy = y + Math.sin(angle) * DISTANCE;
      const childRx = calculateRx(child.name) * 0.8;
      const childRy = ry * 0.8;

      return (
        <g key={child.id}>
          <line
            x1={x + Math.cos(angle) * (rx + borderOffset)}
            y1={y + Math.sin(angle) * (ry + borderOffset)}
            x2={childCx - Math.cos(angle) * childRx}
            y2={childCy - Math.sin(angle) * childRy}
            stroke={stroke}
            strokeWidth="1"
          />
          <ellipse
            cx={childCx}
            cy={childCy}
            rx={childRx}
            ry={childRy}
            fill={fill}
            stroke={stroke}
            strokeWidth="1"
          />
          <text
            x={childCx}
            y={childCy + 3}
            fontSize="9"
            textAnchor="middle"
            fontWeight={200}
            fill={textFill}
            style={{ pointerEvents: "none" }}
          >
            {child.name}
          </text>
        </g>
      );
    });
  };

  return (
    <g>
      {attr.kind === "composite" && renderComposite()}
      {attr.kind === "multivalued" && (
        <ellipse
          cx={x}
          cy={y}
          rx={rx + 6}
          ry={ry + 6}
          fill="none"
          stroke={stroke}
          strokeWidth="1.5"
        />
      )}
      <ellipse
        cx={x}
        cy={y}
        rx={rx}
        ry={ry}
        fill={fill}
        stroke={stroke}
        strokeWidth="1.5"
        strokeDasharray={attr.kind === "derived" ? "5 3" : "none"}
      />
      <text
        x={x}
        y={y + 4}
        fontSize="11"
        textAnchor="middle"
        fill={textFill}
        style={{
          textDecoration: attr.pk || attr.partial ? "underline" : "none",
          textDecorationStyle: attr.partial ? "dashed" : "solid",
          fontWeight: attr.pk ? "bold" : "400",
          pointerEvents: "none",
        }}
      >
        {attr.name}
      </text>
    </g>
  );
}

export default ERAttributeNode;
