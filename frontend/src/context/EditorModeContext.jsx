import { createContext, useContext, useState } from "react";

const EditorModeContext = createContext(null);

export function EditorModeProvider({ children }) {
  const [mode, setMode] = useState("er");

  const value = {
    mode,
    setMode,
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
