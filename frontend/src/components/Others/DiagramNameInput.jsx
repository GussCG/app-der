import { useState, useEffect } from "react";
import ValidateInput from "./ValidateInput";
import { validateERName } from "../../constants/validators";

function DiagramNameInput({
  diagramName,
  setDiagramName,
  isDirty,
  setIsDirty,
  onSave,
  classname = "",
}) {
  const [editingValue, setEditingValue] = useState(diagramName);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    setEditingValue(diagramName);
    setHasUnsavedChanges(false);
  }, [diagramName]);

  const handleChange = (newValue) => {
    setEditingValue(newValue);
    setHasUnsavedChanges(newValue.trim() !== diagramName.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleBlur();
      if (onSave && hasUnsavedChanges) {
        onSave();
      }
    } else if (e.key === "Escape") {
      setEditingValue(diagramName);
      setHasUnsavedChanges(false);
      e.target.blur();
    }
  };

  const handleBlur = () => {
    if (hasUnsavedChanges) {
      const trimmedValue = editingValue.trim();
      if (trimmedValue !== diagramName.trim()) {
        setDiagramName(trimmedValue);
        setIsDirty(true);
      }
    }
  };

  return (
    <div
      className={`nav__filename-container ${classname}`}
      data-tour="diagram-name-input"
    >
      <ValidateInput
        id="diagram-name-input"
        value={editingValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        validator={validateERName}
        placeholder="Nombre del diagrama"
        className="nav__filename"
        normalize={(value) => value.trimStart()}
      />

      {isDirty && (
        <span
          className="nav__unsaved-indicator"
          title="Hay cambios sin guardar"
        >
          *
        </span>
      )}
    </div>
  );
}

export default DiagramNameInput;
