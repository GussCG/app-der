import "./styles/App.scss";
import { EditorModeProvider } from "./context/EditorModeContext.jsx";
import Layout from "./layouts/Layout.jsx";
import { ToolProvider } from "./context/ToolContext.jsx";

function App() {
  return (
    <EditorModeProvider>
      <ToolProvider>
        <Layout />
      </ToolProvider>
    </EditorModeProvider>
  );
}

export default App;
