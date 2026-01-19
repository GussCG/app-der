import { createContext, useContext, useState } from "react";
import { useEditor } from "./EditorContext";

const EditorModeContext = createContext(null);

export function EditorModeProvider({ children }) {
  const [mode, setMode] = useState("er");
  const { setSelectedElementIds } = useEditor();

  const handleSetMode = (newMode) => {
    if (newMode !== mode) {
      setSelectedElementIds([]);
      setMode(newMode);
    }
  };

  const value = {
    mode,
    setMode: handleSetMode,
    isRelational: mode === "relational",
    isER: mode === "er",
    isSQL: mode === "sql",
  };

  return (
    <EditorModeContext.Provider value={value}>
      {children}
    </EditorModeContext.Provider>
  );
}

export function useEditorMode() {
  const ctx = useContext(EditorModeContext);
  if (!ctx) {
    throw new Error("useEditorMode must be used within an EditorModeProvider");
  }
  return ctx;
}
