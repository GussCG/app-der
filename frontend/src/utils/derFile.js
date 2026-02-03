export const saveDERFile = ({
  diagram,
  diagramName,
  relationalPositions = {},
  relationalOverrides = {},
}) => {
  if (!diagram) return;

  const content = {
    version: "1.0",
    type: "DER_WORKSPACE",
    name: diagramName || "newDiagram",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    diagram,
    relationalMeta: {
      positions: relationalPositions,
      overrides: relationalOverrides,
    },
  };

  const blob = new Blob([JSON.stringify(content, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${(diagramName || "newDiagram").trim()}.der`;
  a.click();

  URL.revokeObjectURL(url);
};

export const openDERFile = ({ onLoad }) => {
  if (typeof onLoad !== "function") {
    throw new Error("onLoad must be a function");
  }

  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".der,application/json";

  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const content = JSON.parse(reader.result);

        // if (content.type !== "DER_WORKSPACE" || content.type !== "DER") {
        //   throw new Error("Invalid DER file");
        //   return;
        // }

        onLoad({
          diagram: content.diagram,
          name: content.name,
          relationalMeta: content.relationalMeta ?? {
            positions: {},
            overrides: {},
          },
        });
      } catch (err) {
        alert("Error al abrir el archivo: " + err.message);
      }
    };

    reader.readAsText(file);
  };

  input.click();
};
