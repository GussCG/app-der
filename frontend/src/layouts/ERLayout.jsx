import { useState } from "react";
import BarraElementos from "../components/BarraElementos/BarraElementos";
import BarraNav from "../components/BarraNavegacion/BarraNav";
import BarraInspector from "../components/BarraInspector/BarraInspector";
import BarraHerramientas from "../components/BarraHerramientas/BarraHerramientas";

function ERLayout() {
  const [panels, setPanels] = useState({
    elementos: false,
    herramientas: false,
    inspector: true,
  });

  const [selectedElement, setSelectedElement] = useState(null);

  const togglePanel = (name) => {
    setPanels((p) => ({ ...p, [name]: !p[name] }));
  };

  const handleSelectElement = (element) => {
    setSelectedElement(element);

    setPanels((p) => ({ ...p, inspector: false }));
  };

  // Despues se usara esto para actualizar la entidad o relacion seleccionada en react-flow
  const updateElement = (updated) => {
    setSelectedElement(updated);
  };

  return (
    <div className="app__layout relational">
      <BarraElementos
        hidden={panels.elementos}
        onToggle={() => togglePanel("elementos")}
        onSelectElement={handleSelectElement}
        selectedElement={selectedElement?.id}
      />
      <BarraNav />
      <BarraInspector
        hidden={panels.inspector}
        onToggle={() => togglePanel("inspector")}
        selectedElement={selectedElement}
        updateElement={updateElement}
      />
      <BarraHerramientas />
    </div>
  );
}

export default ERLayout;
