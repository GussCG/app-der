import { memo } from "react";
import { useEditor } from "../../../context/EditorContext";
import { useEditorMode } from "../../../context/EditorModeContext";
import ERDeleteNodeButton from "../ER/ERDeleteNodeButton";

function NoteNode({ id, data, selected }) {
  const { style = {}, text } = data;
  const { deleteElementsDiagram } = useEditor();
  const { mode } = useEditorMode();

  // Valores por defecto para evitar undefined
  const defaultStyle = {
    paddingTop: 8,
    paddingRight: 8,
    paddingBottom: 8,
    paddingLeft: 8,
    backgroundColor: "rgba(255,255,136,1)",
    color: "rgba(0,0,0,1)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,1)",
    borderStyle: "solid",
    fontSize: 14,
    borderRadius: 8,
  };

  const getRadius = (pos) =>
    style[pos] ?? style.borderRadius ?? defaultStyle.borderRadius;
  const getPadding = (pos) => style[pos] ?? defaultStyle[pos];

  return (
    <div className={`note__node ${selected ? "selected" : ""}`}>
      <div
        style={{
          width: "100%",
          height: "auto",
          minHeight: 40,
          paddingTop: getPadding("paddingTop"),
          paddingRight: getPadding("paddingRight"),
          paddingBottom: getPadding("paddingBottom"),
          paddingLeft: getPadding("paddingLeft"),
          backgroundColor:
            style.backgroundColor ?? defaultStyle.backgroundColor,
          borderTopLeftRadius: getRadius("borderTopLeftRadius"),
          borderTopRightRadius: getRadius("borderTopRightRadius"),
          borderBottomLeftRadius: getRadius("borderBottomLeftRadius"),
          borderBottomRightRadius: getRadius("borderBottomRightRadius"),
          fontFamily: style.fontFamily ?? "Arial",
          fontSize: style.fontSize ?? 14,
          fontWeight: style.fontWeight ?? "normal",
          color: style.color ?? "#000000",
          borderWidth: style.borderWidth ?? 1,
          borderColor: style.borderColor ?? "#000000",
          borderStyle: style.borderStyle ?? "solid",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          textAlign: style.textAlign ?? "left",
          fontStyle: style.fontStyle ?? "normal",
        }}
      >
        {text}
      </div>
      {selected && (
        <ERDeleteNodeButton onDelete={() => deleteElementsDiagram([id])} />
      )}
    </div>
  );
}

export default memo(NoteNode);
