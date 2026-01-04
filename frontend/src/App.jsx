import "./styles/App.scss";
import { EditorModeProvider } from "./context/EditorModeContext.jsx";
import Layout from "./layouts/Layout.jsx";
import { ToolProvider } from "./context/ToolContext.jsx";
import { EditorProvider } from "./context/EditorContext.jsx";

function App() {
  return (
    <EditorModeProvider>
      <ToolProvider>
        <EditorProvider>
          <Layout />
        </EditorProvider>
      </ToolProvider>
    </EditorModeProvider>
  );
}

export default App;
