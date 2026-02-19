import { useMemo, useState, useRef } from "react";
import Icons from "../Others/IconProvider.jsx";
import BarraDesplegable from "./BarraDesplegable.jsx";
import ValidationStatus from "./ValidationStatus.jsx";
import ConfirmModal from "../Modals/ConfirmModal.jsx";
import ExportModal from "../Modals/ExportModal.jsx";

import { useEditorMode } from "../../context/EditorModeContext.jsx";
import KeyboardShortcutsModal from "../Modals/KeyboardShortcutsModal.jsx";
import { useKeyboard } from "../../context/KeyboardContext.jsx";
import { useTour } from "../../context/TourContext.jsx";

import { AnimatePresence } from "framer-motion";

import { fitToScreen, exportDiagramAsPng } from "../../utils/diagramActions.js";

import { useEditor } from "../../context/EditorContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useReactFlow } from "reactflow";
import { downloadSQL, relationalTOSQL } from "../../utils/relationalToSQL.js";
import { derToRelational } from "../../utils/derToRelational.js";
import { sqlToRelational } from "../../utils/sqlToRelational.js";
import AboutUsModal from "../Modals/AboutUsModal.jsx";
import DiagramNameInput from "../Others/DiagramNameInput.jsx";

const { TbSql, FaTable, FaProjectDiagram } = Icons;

function BarraNav() {
  const { mode, setMode } = useEditorMode();
  const { toggleTheme } = useTheme();
  const { startTutorial } = useTour();
  const { fitView, getNodes, getEdges } = useReactFlow();
  const {
    diagram,
    diagramName,
    setDiagramName,
    undo,
    redo,
    canUndo,
    canRedo,
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
    relationalPositions,
    relationalOverrides,
    importRelationalData,
    setImportedRelationalData,
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

  const [confirmTutorial, setConfirmTutorial] = useState({
    show: false,
    action: null,
  });

  const [confirmOpenDiagram, setConfirmOpenDiagram] = useState({
    show: false,
    action: null,
  });

  const { isShortcutsModalOpen, setIsShortcutsModalOpen } = useKeyboard();
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const [exportState, setExportState] = useState({
    show: false,
    progress: 0,
    status: "idle",
  });

  const menuActions = useMemo(
    () => ({
      "Nuevo diagrama": () => {
        const action = () => {
          createNewDiagram();
          setMode("er");
          setImportedRelationalData(null);
        };

        if (isDirty) {
          setConfirmNew({ show: true, action });
        } else {
          action();
        }
      },
      "Abrir ...": () => {
        const action = async () => {
          openDiagram();
          setMode("er");
          setImportedRelationalData(null);
        };

        if (isDirty) {
          setConfirmOpenDiagram({ show: true, action });
        } else {
          action();
        }
      },
      // "Importar SQL": () => handleImportSQL(),
      "Guardar diagrama": () =>
        executeValidation(() => saveDiagram(), "guardar"),
      "Exportar imagen": () =>
        executeValidation(async () => {
          setSelectedElementIds([]);

          setExportState({ show: true, progress: 0, status: "generating" });

          const fakeInterval = setInterval(() => {
            setExportState((prev) => ({
              ...prev,
              progress: Math.min(prev.progress + 5, 90),
            }));
          }, 100);

          await exportDiagramAsPng(getNodes(), getEdges(), diagramName);

          clearInterval(fakeInterval);

          setExportState({ show: true, progress: 100, status: "done" });
        }, "exportar imagen"),
      Deshacer: () => mode === "er" && canUndo && undo(),
      Rehacer: () => mode === "er" && canRedo && redo(),
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
        const action = () => {
          createNewDiagram();
          setMode("er");
          setImportedRelationalData(null);
        };

        if (isDirty) {
          setConfirmNew({ show: true, action });
        } else {
          action();
        }
      },
      "Ajustar pantalla": () => fitToScreen(fitView),
      "Ocultar cuadrícula": () =>
        setBgVariant(bgVariant === null ? "dots" : null),
      "¿Cómo usar?": () => {
        const action = () => {
          startTutorial();
        };

        if (isDirty) {
          setConfirmTutorial({ show: true, action });
        } else {
          action();
        }
      },
      "Atajos de teclado": () => setIsShortcutsModalOpen(true),
      "Cambiar de tema": () => toggleTheme(),
      "Acerca de": () => setIsAboutModalOpen(true),
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
      isAboutModalOpen,
      setIsAboutModalOpen,
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
    const { nodes, edges } = derToRelational(
      diagram,
      relationalPositions,
      relationalOverrides,
    );

    const sqlScript = relationalTOSQL(nodes, edges);

    const fileName = `${diagramName.replace(/\s+/g, "_")}_schema.sql`;
    downloadSQL(sqlScript, fileName);
  };

  const fileInputRef = useRef(null);
  const handleImportSQL = () => {
    const action = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    };

    if (isDirty) {
      setConfirmNew({ show: true, action });
    } else {
      action();
    }
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      try {
        const { nodes, edges } = sqlToRelational(content);

        if (nodes.length === 0) {
          alert("No se encontraron tablas en el archivo SQL.");
          return;
        }

        importRelationalData(nodes, edges);
        setIsDirty(true);

        setMode("relational");

        setTimeout(() => fitToScreen(fitView), 100);
        alert("Importación exitosa.");
      } catch (error) {
        alert("Error al importar el archivo SQL: " + error.message);
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  return (
    <>
      <header className="barra__nav" data-tour="navigation-bar">
        <div className="nav__menu">
          {mode === "er" && (
            <>
              <FaProjectDiagram
                className="nav__header_icon"
                title="Modo Entidad-Relación"
              />
            </>
          )}
          {mode === "relational" && (
            <>
              <FaTable className="nav__header_icon" title="Modo Relacional" />
            </>
          )}
          <DiagramNameInput
            diagramName={diagramName}
            setDiagramName={setDiagramName}
            isDirty={isDirty}
            setIsDirty={setIsDirty}
            onSave={() => {
              executeValidation(() => saveDiagram(), "guardar");
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
                  <BarraDesplegable
                    tipo={tipo}
                    onSelect={handleMenuSelect}
                    canRedo={canRedo}
                    canUndo={canUndo}
                  />
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
                data-tour="switch-to-relational-mode-button"
              >
                <FaTable />
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
                data-tour="switch-to-er-mode-button"
              >
                <FaProjectDiagram />
                Regresar a E-R
              </button>
              <button
                className="nav__button secondary"
                onClick={handleExportSQL}
                data-tour="export-sql-button"
              >
                <TbSql />
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

        {confirmOpenDiagram.show && (
          <ConfirmModal
            title="¿Quieres abrir un diagrama?"
            message="Se perderán los cambios no guardados. ¿Deseas continuar?"
            onClose={() => setConfirmOpenDiagram({ show: false, action: null })}
            onConfirm={() => {
              confirmOpenDiagram.action();
              setConfirmOpenDiagram({ show: false, action: null });
            }}
          />
        )}

        {confirmTutorial.show && (
          <ConfirmModal
            title="¿Quieres abrir el tutorial?"
            message="Se perderán los cambios no guardados. ¿Deseas continuar?"
            onClose={() => setConfirmTutorial({ show: false, action: null })}
            onConfirm={() => {
              confirmTutorial.action();
              setConfirmTutorial({ show: false, action: null });
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

        {isAboutModalOpen && (
          <AboutUsModal onClose={() => setIsAboutModalOpen(false)} />
        )}

        {exportState.show && (
          <ExportModal
            progress={exportState.progress}
            status={exportState.status}
            onClose={() =>
              setExportState({ show: false, progress: 0, status: "idle" })
            }
          />
        )}
      </AnimatePresence>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={onFileChange}
        accept=".sql"
      />
    </>
  );
}

export default BarraNav;
