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

  const bounds = getNodesBounds(nodes);
  const padding = 100;

  const width = bounds.width + padding * 2;
  const height = bounds.height + padding * 2;

  const transform = getViewportForBounds(bounds, width, height, 0.1, 4);

  try {
    const dataUrl = await toPng(viewport, {
      backgroundColor: "#00000000",
      width,
      height,
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
        transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
      },
    });

    downloadImage(dataUrl, diagramName || "diagrama");
  } catch (err) {
    console.error("Error al exportar:", err);
  }
};

export const openAppTour = () => alert("Abrir tour");
export const openAboutModal = () => alert("Abrir modal 'Acerca de'");
