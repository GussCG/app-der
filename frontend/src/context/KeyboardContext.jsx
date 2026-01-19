import { createContext, useContext, useEffect, useState } from "react";
import { useTool } from "./ToolContext";
import { useEditor } from "./EditorContext";
import { useEditorMode } from "./EditorModeContext";
import { useTheme } from "./ThemeContext";
import { useReactFlow } from "reactflow";
import {
  openKeyboardShortcutsModal,
  fitToScreen,
  exportDiagramAsPng,
  openAppTour,
  openAboutModal,
} from "../utils/diagramActions";

import { HotKeys } from "react-hotkeys";

const KeyboardContext = createContext();

export function KeyboardProvider({ children, flowRef }) {
  const { setActiveTool } = useTool();
  const { toggleTheme } = useTheme();
  const { mode, setMode } = useEditorMode();
  const { fitView, getEdges, getNodes } = useReactFlow();
  const {
    selectedElementIds,
    setSelectedElementIds,
    diagram,
    setDiagram,
    bgVariant,
    setBgVariant,
    saveDiagram,
    createNewDiagram,
    openDiagram,
    undo,
    redo,
    deleteElementsDiagram,
    duplicateSelectedElements,
  } = useEditor();
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  const keyMap = {
    SELECT_TOOL: "v",
    PAN_TOOL: "m",
    ENTITY_TOOL: "e",
    RELATION_TOOL: "r",
    DELETE_ELEMENT: "del",
    NEW_DIAGRAM: "ctrl+n",
    OPEN_DIAGRAM: "ctrl+o",
    SAVE_DIAGRAM: "ctrl+s",
    EXPORT_PNG: "ctrl+e",
    UNDO: "ctrl+z",
    REDO: "ctrl+y",
    DUPLICATE_ELEMENT: "ctrl+d",
    CLEAR_CANVAS: "ctrl+l",
    FIT_TO_SCREEN: "ctrl+a",
    TOGGLE_GRID: "ctrl+g",
    OPEN_SHORTCUTS_MODAL: "ctrl+/",
    CHANGE_THEME: "ctrl+j",
  };

  const handlers = {
    SELECT_TOOL: () => setActiveTool("select"),
    PAN_TOOL: () => setActiveTool("pan"),
    ENTITY_TOOL: () => mode === "er" && setActiveTool("entity"),
    RELATION_TOOL: () => mode === "er" && setActiveTool("relation"),
    DELETE_ELEMENT: () => {
      if (mode === "er" && selectedElementIds.length > 0) {
        deleteElementsDiagram(selectedElementIds);
        setSelectedElementIds([]);
      }
    },
    NEW_DIAGRAM: () => {
      const action = () => {
        createNewDiagram();
        setMode("er");
      };

      if (isDirty) {
        setConfirmNew({ show: true, action });
      } else {
        action();
      }
    },
    OPEN_DIAGRAM: () => {
      const action = () => {
        openDiagram();
        setMode("er");
      };

      if (isDirty) {
        setConfirmNew({ show: true, action });
      } else {
        action();
      }
    },
    SAVE_DIAGRAM: () => saveDiagram(),
    EXPORT_IMAGE: () => {
      const nodes = getNodes();
      const edges = getEdges();

      if (nodes.length === 0) return;

      exportDiagramAsPng(nodes, edges, diagram?.name || "diagrama");
    },
    UNDO: () => mode === "er" && undo(),
    REDO: () => mode === "er" && redo(),
    DUPLICATE_ELEMENT: () => {
      if (mode === "er") {
        duplicateSelectedElements();
      }
    },
    CLEAR_CANVAS: () => {
      createNewDiagram();
      setMode("er");
    },
    FIT_TO_SCREEN: () => fitToScreen(fitView),
    ZOOM_IN: () => flowRef.current?.zoomIn(),
    ZOOM_OUT: () => flowRef.current?.zoomOut(),
    TOGGLE_GRID: () => setBgVariant(bgVariant === null ? "dots" : null),
    OPEN_SHORTCUTS_MODAL: () =>
      openKeyboardShortcutsModal(setIsShortcutsModalOpen),
    CHANGE_THEME: () => {
      toggleTheme();
    },
  };

  return (
    <KeyboardContext.Provider
      value={{ isShortcutsModalOpen, setIsShortcutsModalOpen }}
    >
      <HotKeys keyMap={keyMap} handlers={handlers} allowChanges={true}>
        {children}
      </HotKeys>
    </KeyboardContext.Provider>
  );
}

export const useKeyboard = () => useContext(KeyboardContext);
