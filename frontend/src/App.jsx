import "./styles/App.scss";
import { useEffect, useState } from "react";
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 1090);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  });

  if (isMobile) {
    return (
      <div className="mobile__block">
        <h1> Dispositivo no compatible</h1>
        <p>
          Esta aplicación está optimizada para computadoras y tablets. Por favor
          accede desde una pantalla más grande.
        </p>
      </div>
    );
  }

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
