import React, { useEffect, useMemo } from "react";
import { Handle, Position, useUpdateNodeInternals } from "reactflow";
import { colorToBgNode } from "../../../utils/colorToBgNode";
import {
  getEntityLayout,
  getAttributePosition,
  getAttributeWidth,
} from "../../../utils/er/entityLayout";
import { getLineRectToEllipse } from "../../../utils/er/geometry";
import { useTheme } from "../../../context/ThemeContext";
import ERAttributeNode from "./ERAttributeNode";
import ERDeleteNodeButton from "./ERDeleteNodeButton";
import { useEditor } from "../../../context/EditorContext";

export default function EREntityNode({ id, data, selected }) {
  const { name, attributes } = data;
  const { theme } = useTheme();
  const { deleteElementsDiagram } = useEditor();
  const updateNodeInternals = useUpdateNodeInternals();

  const layout = getEntityLayout(name, attributes);
  const { ENTITY_W, ENTITY_H, ATTR_H } = layout;
  const PADDING = 40;

  const bounds = useMemo(() => {
    let minX = -ENTITY_W / 2;
    let minY = -ENTITY_H / 2;
    let maxX = ENTITY_W / 2;
    let maxY = ENTITY_H / 2;

    // IMPORTANTE: Usa el mismo factor que usas abajo en el return
    const factor = attributes.length > 6 ? 1.6 : 1.3;

    attributes.forEach((attr, i) => {
      const raw = getAttributePosition(i, layout, 0, 0);
      const x = raw.x * factor;
      const y = raw.y * factor;

      const w = getAttributeWidth(attr);
      const rx = w / 2;
      const ry = ATTR_H / 2;

      minX = Math.min(minX, x - rx - 30);
      maxX = Math.max(maxX, x + rx + 30);
      minY = Math.min(minY, y - ry - 30);
      maxY = Math.max(maxY, y + ry + 30);

      if (attr.kind === "composite" && attr.children?.length) {
        // El radio de explosión ahora es dinámico basado en la cantidad de hijos
        const explosionRadius = 80 + attr.children.length * 10;
        minX = Math.min(minX, x - explosionRadius);
        maxX = Math.max(maxX, x + explosionRadius);
        minY = Math.min(minY, y - explosionRadius);
        maxY = Math.max(maxY, y + explosionRadius);
      }
    });

    return { minX, minY, maxX, maxY };
  }, [attributes, layout, ENTITY_W, ENTITY_H, ATTR_H]);

  const svgWidth = bounds.maxX - bounds.minX + PADDING * 2;
  const svgHeight = bounds.maxY - bounds.minY + PADDING * 2;

  const centerX = -bounds.minX + PADDING;
  const centerY = -bounds.minY + PADDING;

  useEffect(() => {
    updateNodeInternals(id);
  }, [svgWidth, svgHeight, updateNodeInternals, id]);

  const getHandleStyle = (pos) => {
    let top = centerY;
    let left = centerX;

    if (pos === "top") top -= ENTITY_H / 2;
    if (pos === "bottom") top += ENTITY_H / 2;
    if (pos === "left") left -= ENTITY_W / 2;
    if (pos === "right") left += ENTITY_W / 2;

    return {
      top: `${top}px`,
      left: `${left}px`,
      opacity: 100,
      position: "absolute",
      width: "2px",
      height: "2px",
      transform: "translate(-50%, -50%)",
      pointerEvents: "none",
      zIndex: 1000,
      backgroundColor: data.color || "#0f1419",
    };
  };

  return (
    <div className={`er__entity${selected ? " selected" : ""}`}>
      {["top", "right", "bottom", "left"].map((pos) => (
        <React.Fragment key={pos}>
          <Handle
            type="source"
            position={Position[pos.toUpperCase()]}
            id={pos}
            style={getHandleStyle(pos)}
          />
          <Handle
            type="target"
            position={Position[pos.toUpperCase()]}
            id={pos}
            style={getHandleStyle(pos)}
          />
        </React.Fragment>
      ))}

      <svg width={svgWidth} height={svgHeight} style={{ overflow: "visible" }}>
        {/* Conexiones primero */}
        {attributes.map((attr, i) => {
          const raw = getAttributePosition(i, layout, 0, 0);

          const factor = attributes.length > 6 ? 1.6 : 1.3;
          const x = raw.x * factor + centerX;
          const y = raw.y * factor + centerY;

          const w = getAttributeWidth(attr);

          let offset = 1.5;
          if (attr.kind === "multivalued") {
            offset = 7.5;
          }

          const { x1, y1, x2, y2 } = getLineRectToEllipse(
            { x: centerX, y: centerY },
            { width: ENTITY_W, height: ENTITY_H },
            { x, y },
            {
              rx: w / 2 + offset,
              ry: ATTR_H / 2 + offset,
            },
          );

          return (
            <line
              key={`line-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={data.color || "#0f1419"}
              strokeWidth="1.5"
            />
          );
        })}

        {/* Entidad Central*/}
        <rect
          x={centerX - ENTITY_W / 2}
          y={centerY - ENTITY_H / 2}
          width={ENTITY_W}
          height={ENTITY_H}
          rx="8"
          fill={colorToBgNode(data.color) || "#0f1419"}
          stroke={data.color || "#0f1419"}
          strokeWidth="1.5"
        />

        {data.weak && (
          <rect
            x={centerX - ENTITY_W / 2 + 4}
            y={centerY - ENTITY_H / 2 + 4}
            width={ENTITY_W - 8}
            height={ENTITY_H - 8}
            rx="6"
            fill="transparent"
            stroke={data.color || "#0f1419"}
            strokeWidth="1"
          />
        )}

        <text
          x={centerX}
          y={centerY}
          dominantBaseline="middle"
          textAnchor="middle"
          fontWeight="500"
          fill={theme === "dark" ? "#ffffff" : "#000000"}
          fontSize="14"
          style={{ textTransform: "uppercase" }}
        >
          {name}
        </text>

        {/* === ATRIBUTOS === */}
        {attributes.map((attr, i) => {
          const raw = getAttributePosition(i, layout, 0, 0);

          // Mantenemos el factor de expansión coherente (1.6 si hay muchos, 1.3 si hay pocos)
          const factor = attributes.length > 6 ? 1.6 : 1.3;
          const x = raw.x * factor + centerX;
          const y = raw.y * factor + centerY;

          return (
            <ERAttributeNode
              key={attr.id}
              attr={attr}
              position={{ x, y }}
              parentCenter={{ cx: centerX, cy: centerY }} // <--- PASAMOS EL CENTRO AQUÍ
              attrHeight={ATTR_H}
              color={data.color}
              theme={theme}
            />
          );
        })}
      </svg>

      {selected && (
        <ERDeleteNodeButton onDelete={() => deleteElementsDiagram([id])} />
      )}
    </div>
  );
}
