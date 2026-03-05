import { createContext, useContext, useState } from "react";
import { useTool } from "./ToolContext";
import { useEditor } from "./EditorContext";
import { useEditorMode } from "./EditorModeContext";
import { useTheme } from "./ThemeContext";
import { useReactFlow } from "reactflow";
import {
  openKeyboardShortcutsModal,
  fitToScreen,
} from "../utils/diagramActions";

import { HotKeys } from "react-hotkeys";

const KeyboardContext = createContext();

export function KeyboardProvider({ children, flowRef }) {
  const { setActiveTool } = useTool();
  const { toggleTheme } = useTheme();
  const { mode } = useEditorMode();
  const { fitView } = useReactFlow();
  const {
    diagram,
    undo,
    redo,
    canUndo,
    canRedo,
    selectedElementIds,
    setSelectedElementIds,
    bgVariant,
    setBgVariant,
    deleteElementsDiagram,
    duplicateSelectedElements,
    validationState,
  } = useEditor();
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  const executeValidation = (action, nameAction) => {
    const isEmpty =
      diagram.entities.length === 0 && diagram.relations.length === 0;

    if (isEmpty || validationState === "valid") {
      action();
    } else {
      setConfirmValidation({
        show: true,
        title: `¿Continuar con ${nameAction}?`,
        message: `Para ${nameAction} es necesario validar el diagrama. ¿Deseas validar y continuar?`,
        onConfirm: action,
      });
    }
  };

  const keyMap = {
    SELECT_TOOL: "v",
    PAN_TOOL: "m",
    ENTITY_TOOL: "e",
    RELATION_TOOL: "r",
    TEXT_TOOL: "t",
    DELETE_ELEMENT: "del",
    UNDO: "ctrl+z",
    REDO: "ctrl+y",
    DUPLICATE_ELEMENT: "ctrl+d",
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
    TEXT_TOOL: () => setActiveTool("note"),
    DELETE_ELEMENT: () => {
      if (mode === "er" && selectedElementIds.length > 0) {
        deleteElementsDiagram(selectedElementIds);
        setSelectedElementIds([]);
      }
    },
    UNDO: () => mode === "er" && canUndo && undo(),
    REDO: () => mode === "er" && canRedo && redo(),
    DUPLICATE_ELEMENT: () => {
      if (mode === "er") {
        duplicateSelectedElements();
      }
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
