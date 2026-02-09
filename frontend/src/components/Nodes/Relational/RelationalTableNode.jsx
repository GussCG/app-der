import Icons from "../../Others/IconProvider";
import { Handle, Position } from "reactflow";
import { colorToBgNode } from "../../../utils/colorToBgNode";
import { useTheme } from "../../../context/ThemeContext";

const { FaKey } = Icons;

function RelationalTableNode({ id, data, selected }) {
  const { theme } = useTheme();

  const headerStyle = {
    backgroundColor: colorToBgNode(data.color, 0.2),
    color: theme === "dark" ? "#fff" : "#000",
  };

  const containerStyle = {
    backgroundColor:
      colorToBgNode(data.color, 0.1) || "rgba(255, 255, 255, 0.8)",
    border: selected
      ? `2px dashed var(--node-selected-border)`
      : `2px solid ${data.color || "#323c4c"}`,
    color: theme === "dark" ? "#fff" : "#000",
    transition: "all 0.2s ease-in-out",
    animation: selected ? "element-pulse 1.5s infinite" : "none",
  };

  function formatColumnType(col) {
    switch (col.type) {
      case "varchar":
        return `VARCHAR(${col.length || 255})`;

      case "char":
        return `CHAR(${col.length || 1})`;

      case "decimal":
        return `DECIMAL(${col.precision || 10}, ${col.scale || 2})`;

      case "numeric":
        return `NUMERIC(${col.precision || 10}, ${col.scale || 2})`;

      default:
        return col.type.toUpperCase();
    }
  }

  const handles = [
    { pos: Position.Left, id: "left" },
    { pos: Position.Right, id: "right" },
    { pos: Position.Top, id: "top" },
    { pos: Position.Bottom, id: "bottom" },
  ];

  return (
    <div
      className={`relational-table ${selected ? "selected" : ""}`}
      style={containerStyle}
    >
      {handles.map(({ pos, id }) => (
        <div key={id}>
          <Handle
            type="source"
            position={pos}
            id={id}
            style={{ visibility: "hidden" }}
          />
          <Handle
            type="target"
            position={pos}
            id={`${id}-target`}
            style={{ visibility: "hidden" }}
          />
        </div>
      ))}

      <div className="header" style={headerStyle}>
        <h3>{data.name}</h3>
      </div>

      <div className="body">
        {data.columns.map((col, index) => (
          <div
            key={index}
            className="column"
            style={{
              borderBottom:
                index !== data.columns.length - 1
                  ? `1px dashed ${colorToBgNode(data.color, 0.35)}`
                  : "none",
            }}
          >
            <span className="icon">
              {col.isPk ? (
                <FaKey style={{ color: "#f1c40f" }} />
              ) : col.isFk ? (
                <FaKey style={{ color: "#95a5a6" }} />
              ) : null}
            </span>
            <span className="name">{col.name}</span>
            <span className="type">{formatColumnType(col)}</span>

            <div className="extras">
              {col.isNotNull && (
                <span
                  style={{
                    backgroundColor: colorToBgNode(data.color, 0.35),
                  }}
                >
                  NOT NULL
                </span>
              )}
              {col.isUnique && (
                <span
                  style={{
                    backgroundColor: colorToBgNode(data.color, 0.35),
                  }}
                >
                  UNIQUE
                </span>
              )}
              {col.isAutoIncrement && (
                <span
                  style={{
                    backgroundColor: colorToBgNode(data.color, 0.35),
                  }}
                >
                  AUTO_INCREMENT
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RelationalTableNode;
