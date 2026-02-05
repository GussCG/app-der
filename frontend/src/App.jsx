import "./styles/App.scss";
import { EditorModeProvider } from "./context/EditorModeContext.jsx";
import Layout from "./layouts/Layout.jsx";
import { ToolProvider } from "./context/ToolContext.jsx";
import { EditorProvider } from "./context/EditorContext.jsx";
import { KeyboardProvider } from "./context/KeyboardContext.jsx";
import LimitModal from "./components/Modals/LimitModal.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { ReactFlowProvider } from "reactflow";
import { TourProvider } from "./context/TourContext.jsx";

function App() {
  return (
    <ThemeProvider>
      <ReactFlowProvider>
        <EditorProvider>
          <EditorModeProvider>
            <TourProvider>
              <ToolProvider>
                <KeyboardProvider>
                  <Layout />
                </KeyboardProvider>
              </ToolProvider>
            </TourProvider>
          </EditorModeProvider>
        </EditorProvider>
      </ReactFlowProvider>
    </ThemeProvider>
  );
}

export default App;
