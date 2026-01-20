import { createElement, useEffect, useMemo, useState } from "react";
import Icons from "../Others/IconProvider.jsx";
import BarraDesplegable from "./BarraDesplegable.jsx";
import ValidationStatus from "./ValidationStatus.jsx";
import ConfirmModal from "../Modals/ConfirmModal.jsx";

import { useEditorMode } from "../../context/EditorModeContext.jsx";
import KeyboardShortcutsModal from "../Modals/KeyboardShortcutsModal.jsx";
import { useKeyboard } from "../../context/KeyboardContext.jsx";

import { AnimatePresence } from "framer-motion";

import {
  fitToScreen,
  exportDiagramAsPng,
  openAppTour,
  openAboutModal,
} from "../../utils/diagramActions.js";

import { useEditor } from "../../context/EditorContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useReactFlow } from "reactflow";
import { downloadSQL, relationalTOSQL } from "../../utils/relationalToSQL.js";
import { derToRelational } from "../../utils/derToRelational.js";

const { FiDatabase, TbSql, LuTable2, LiaProjectDiagramSolid } = Icons;

function BarraNav() {
  const { mode, setMode } = useEditorMode();
  const { toggleTheme } = useTheme();
  const { fitView, getNodes, getEdges } = useReactFlow();
  const {
    diagram,
    diagramName,
    setDiagramName,
    undo,
    redo,
    isDirty,
    setIsDirty,
    selectedElementIds,
    setSelectedElementIds,
    setDiagram,
    bgVariant,
    setBgVariant,
    saveDiagram,
    createNewDiagram,
    openDiagram,
    deleteElementsDiagram,
    duplicateSelectedElements,
    validationState,
    validateCurrentDiagram,
    validationProgress,
  } = useEditor();

  const [confirmValidation, setConfirmValidation] = useState({
    show: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const [onlyDesignMode, setOnlyDesignMode] = useState({ show: false });

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

  const [menuActivo, setMenuActivo] = useState(null);
  const [confirmNew, setConfirmNew] = useState({
    show: false,
    action: null,
  });

  const { isShortcutsModalOpen, setIsShortcutsModalOpen } = useKeyboard();

  const menuActions = useMemo(
    () => ({
      "Nuevo diagrama": () => {
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
      "Abrir ...": () => {
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
      "Guardar diagrama": () =>
        executeValidation(() => saveDiagram(), "guardar"),
      "Exportar imagen": () =>
        executeValidation(() => {
          const nodes = getNodes();
          const edges = getEdges();

          exportDiagramAsPng(nodes, edges, diagramName);
        }, "exportar imagen"),
      Deshacer: () => mode === "er" && undo(),
      Rehacer: () => mode === "er" && redo(),
      Eliminar: () => {
        if (mode === "er" && selectedElementIds.length > 0) {
          deleteElementsDiagram(selectedElementIds);
          setSelectedElementIds([]);
        }
      },
      "Duplicar elemento": () => {
        if (mode === "er") {
          duplicateSelectedElements();
        }
      },
      "Limpiar lienzo": () => {
        createNewDiagram();
        setMode("er");
      },
      "Ajustar pantalla": () => fitToScreen(fitView),
      "Ocultar cuadrícula": () =>
        setBgVariant(bgVariant === null ? "dots" : null),
      "Abrir herramientas": () => alert("Abrir herramientas seleccionado"),
      "¿Cómo usar?": () => alert("¿Cómo usar? seleccionado"),
      "Atajos de teclado": () => setIsShortcutsModalOpen(true),
      "Cambiar de tema": () => toggleTheme(),
      "Acerca de": () => alert("Acerca de seleccionado"),
    }),
    [
      isDirty,
      createNewDiagram,
      openDiagram,
      saveDiagram,
      undo,
      redo,
      deleteElementsDiagram,
      selectedElementIds,
      setSelectedElementIds,
      duplicateSelectedElements,
      fitToScreen,
      bgVariant,
      setBgVariant,
      setIsShortcutsModalOpen,
      validationState,
    ],
  );

  const handleMenuSelect = (label) => {
    setMenuActivo(null);

    const designOnlyActions = [
      "Deshacer",
      "Rehacer",
      "Eliminar",
      "Duplicar elemento",
      "Limpiar lienzo",
    ];

    if (mode === "relational" && designOnlyActions.includes(label)) {
      setOnlyDesignMode({ show: true });
      return;
    }

    const action = menuActions[label];
    if (action) action();
  };

  const handleExportSQL = () => {
    const { nodes, edges } = derToRelational(diagram);

    const sqlScript = relationalTOSQL(nodes, edges);

    const fileName = `${diagramName.replace(/\s+/g, "_")}_schema.sql`;
    downloadSQL(sqlScript, fileName);
  };

  return (
    <>
      <header className="barra__nav">
        <div className="nav__menu">
          {mode === "er" && (
            <>
              <LiaProjectDiagramSolid className="nav__header_icon" />
            </>
          )}
          {mode === "relational" && (
            <>
              <LuTable2 className="nav__header_icon" />
            </>
          )}
          <input
            type="text"
            className="nav__filename"
            value={`${diagramName}${isDirty ? "*" : ""}`}
            onChange={(e) => {
              setDiagramName(e.target.value.replace(/\*$/, ""));
              setIsDirty(true);
            }}
          />
          <nav className="nav__tabs">
            {["archivo", "editar", "ver", "ayuda"].map((tipo) => (
              <div
                key={tipo}
                className="nav__tab"
                onMouseEnter={() => setMenuActivo(tipo)}
                onMouseLeave={() => setMenuActivo(null)}
              >
                <p>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</p>
                {menuActivo === tipo && (
                  <BarraDesplegable tipo={tipo} onSelect={handleMenuSelect} />
                )}
              </div>
            ))}
          </nav>
        </div>
        <div className="nav__actions">
          {mode === "er" && (
            <>
              <ValidationStatus
                state={validationState}
                onValidate={validateCurrentDiagram}
                disabled={
                  (diagram.entities.length === 0 &&
                    diagram.relations.length === 0) ||
                  validationState === "validating"
                }
                progress={validationProgress}
              />
              <button
                className="nav__button"
                onClick={() =>
                  executeValidation(
                    () => setMode("relational"),
                    "cambiar a relacional",
                  )
                }
              >
                <FiDatabase />
                Ver en Relacional
              </button>
            </>
          )}

          {mode === "relational" && (
            <>
              <button
                className="nav__button"
                onClick={() => {
                  setMode("er");
                }}
              >
                <FiDatabase />
                Regresar a ER
              </button>
              <button
                className="nav__button secondary"
                onClick={handleExportSQL}
              >
                <FiDatabase />
                Exportar SQL
              </button>
            </>
          )}
        </div>
      </header>

      <AnimatePresence>
        {isShortcutsModalOpen && (
          <KeyboardShortcutsModal
            onClose={() => setIsShortcutsModalOpen(false)}
          />
        )}

        {confirmNew.show && (
          <ConfirmModal
            title="¿Crear nuevo diagrama?"
            message="Se perderán los cambios no guardados. ¿Deseas continuar?"
            onClose={() => setConfirmNew({ show: false, action: null })}
            onConfirm={() => {
              confirmNew.action();
              setConfirmNew({ show: false, action: null });
            }}
          />
        )}

        {confirmValidation.show && (
          <ConfirmModal
            title={confirmValidation.title}
            message={confirmValidation.message}
            confirmText="Validar"
            cancelText="Cancelar"
            onClose={() => setConfirmValidation({ show: false })}
            onConfirm={async () => {
              const isValid = await validateCurrentDiagram();

              if (isValid) {
                confirmValidation.onConfirm();
              }
              setConfirmValidation({ show: false });
            }}
          />
        )}

        {onlyDesignMode.show && (
          <ConfirmModal
            title="Modo no disponible"
            message="Esta acción solo está disponible en el modo de diseño ER. Cambia al modo ER para usar esta función."
            onClose={() => setOnlyDesignMode({ show: false })}
            confirmText="Entendido"
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default BarraNav;
