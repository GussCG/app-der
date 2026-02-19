import { toPng } from "html-to-image";
import { getNodesBounds, getViewportForBounds } from "reactflow";

// Modal de atajos de teclado
export const openKeyboardShortcutsModal = (setIsShortcutsModalOpen) => {
  setIsShortcutsModalOpen(true);
};

// Ajustar vista al contenido del diagrama
export const fitToScreen = (fitViewInstance) => {
  if (typeof fitViewInstance === "function") {
    fitViewInstance({ padding: 0.1, duration: 300 });
  } else {
    alert("Función de ajuste de vista no disponible");
  }
};

// Funcion de Exportar diagrama como imagen PNG
function downloadImage(dataUrl, fileName) {
  const a = document.createElement("a");
  a.setAttribute("download", `${fileName}.png`);
  a.setAttribute("href", dataUrl);
  a.click();
}

export const exportDiagramAsPng = async (nodes, edges, diagramName) => {
  const viewport = document.querySelector(".react-flow__viewport");
  const allDefs = document.querySelectorAll("svg defs");

  if (!viewport || nodes.length === 0) return;

  const style = document.createElement("style");
  style.innerHTML = `
    .er__entity.selected,
    .er__relation.selected,
    .note__node.selected {
      outline: none !important;
      animation: none !important;
    }

    .er__delete-btn {
      display: none !important;
    }

    .react-flow__selection {
      display: none !important;
    }
  `;
  document.head.appendChild(style);

  const bounds = getNodesBounds(nodes);
  const padding = 200;

  const width = bounds.width + padding * 2;
  const height = bounds.height + padding * 2;

  const transform = {
    x: -bounds.x + padding,
    y: -bounds.y + padding,
  };

  try {
    const dataUrl = await toPng(viewport, {
      backgroundColor: "#00000000",
      width,
      height,
      pixelRatio: 2,
      onCreateForeignObject: (node) => {
        const svg = node.querySelector("svg");
        if (svg) {
          allDefs.forEach((defs) => {
            svg.appendChild(defs.cloneNode(true));
          });
        }
      },
      style: {
        width: `${width}px`,
        height: `${height}px`,
        transform: `translate(${transform.x}px, ${transform.y}px)`,
      },
    });

    downloadImage(dataUrl, diagramName || "diagrama");
  } catch (err) {
    console.error("Error al exportar:", err);
  } finally {
    document.head.removeChild(style);
  }
};

export const openAppTour = () => alert("Abrir tour");
export const openAboutModal = () => alert("Abrir modal 'Acerca de'");
