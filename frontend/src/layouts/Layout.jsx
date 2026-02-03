import { useEditorMode } from "../context/EditorModeContext";
import RelationalLayout from "./RelationalLayout.jsx";
import ERLayout from "./ERLayout.jsx";

export default function Layout() {
  const { mode } = useEditorMode();

  switch (mode) {
    case "relational":
      return <RelationalLayout />;
    case "er":
      return <ERLayout />;
    default:
      return <RelationalLayout />;
  }
}
