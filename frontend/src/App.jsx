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
import WebFont from "webfontloader";

WebFont.load({
  google: {
    families: [
      "Roboto:400,700",
      "Poppins:400,700",
      "Montserrat:400,700",
      "Lato:400,700",
      "Open Sans:400,700",
      "Raleway:400,700",
      "Source Sans Pro:400,700",
      "Oswald:400,700",
      "Merriweather:400,700",
    ],
  },
});

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
