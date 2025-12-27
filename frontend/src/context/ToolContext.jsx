import { createContext, useContext, useState } from "react";

const ToolContext = createContext(null);

export function ToolProvider({ children }) {
  const [activeTool, setActiveTool] = useState("select");

  return (
    <ToolContext.Provider value={{ activeTool, setActiveTool }}>
      {children}
    </ToolContext.Provider>
  );
}

export function useTool() {
  const ctx = useContext(ToolContext);
  if (!ctx) {
    throw new Error("useTool must be used within a ToolProvider");
  }
  return ctx;
}
