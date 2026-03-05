import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icons from "../Others/IconProvider.jsx";
import AIMessage from "./AIMessage.jsx";
import AILoader from "./AILoader.jsx";
import ConfirmModal from "../Modals/ConfirmModal.jsx";
import { useEditor } from "../../context/EditorContext.jsx";

const { IoClose, FaArrowDown, TbWand, TbWandOff } = Icons;

const PANEL_WIDTH = 300;
const PANEL_HEIGHT = 450;

function AIChatPanel({ open, onClose }) {
  const { askAI, aiMessages, setAiMessages, isDirty } = useEditor();

  const [thinking, setThinking] = useState(false);
  const [input, setInput] = useState("");
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const panelRef = useRef(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 100);
  };

  useEffect(() => {
    if (open) scrollToBottom();
  }, [aiMessages, thinking, open]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isFarFromBottom = scrollHeight - scrollTop - clientHeight > 100;
    setShowScrollBtn(isFarFromBottom);
  };

  const textareaRef = useRef(null);

  async function sendMessage() {
    if (thinking || !input.trim()) return;

    const text = input;
    setAiMessages((msgs) => [...msgs, { role: "user", text }]);
    setInput("");
    setThinking(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "32px"; // Vuelve a su altura mínima inicial
    }

    try {
      const response = await askAI(text);

      setAiMessages((msgs) => [
        ...msgs,
        {
          role: "ai",
          text: response.message,
        },
      ]);
    } catch (error) {
      setAiMessages((msgs) => [
        ...msgs,
        {
          role: "ai",
          text: "Ocurrió un error al comunicarse con la IA. Intenta de nuevo.",
        },
      ]);
    } finally {
      setThinking(false);
    }
  }

  function handleChange(e) {
    setInput(e.target.value);
    e.target.style.height = "auto";
    const nextHeight = Math.min(e.target.scrollHeight, 120);
    e.target.style.height = `${nextHeight}px`;
  }

  if (!open) return null;

  return (
    <motion.div
      className={`ai__panel`}
      ref={panelRef}
      initial={{
        opacity: 0,
        scale: 0.5,
        width: 40,
        height: 40,
        transformOrigin: "top right",
      }}
      animate={{
        opacity: 1,
        scale: 1,
        width: PANEL_WIDTH,
        height: PANEL_HEIGHT,
      }}
      exit={{
        opacity: 0,
        scale: 0.5,
        width: 40,
        height: 40,
        transformOrigin: "top right",
      }}
      style={{ opacity: 0, scale: 0.5, width: 40, height: 40 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 25,
      }}
    >
      <motion.div
        className="ai__panel-content-wrapper"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { delay: 0.4 },
        }}
        exit={{ opacity: 0 }}
      >
        <header className="ai__header">
          <h2>AppDER-IA</h2>
          <button className="ai__close-button" onClick={onClose}>
            <IoClose />
          </button>
        </header>

        <div
          className="ai__messages"
          ref={containerRef}
          onScroll={handleScroll}
        >
          {aiMessages.map((msg, i) => (
            <AIMessage key={i} {...msg} />
          ))}
          {thinking && <AILoader />}

          <div ref={messagesEndRef} />
        </div>

        <AnimatePresence>
          {showScrollBtn && (
            <motion.button
              className="ai__scroll-button"
              onClick={scrollToBottom}
              initial={{ opacity: 0, y: 10, x: "50%" }}
              animate={{ opacity: 1, y: 0, x: "50%" }}
              exit={{ opacity: 0, y: 10, x: "50%" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <FaArrowDown />
            </motion.button>
          )}
        </AnimatePresence>

        <div className="ai__input">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            disabled={thinking}
            placeholder={
              thinking ? "Espera un momento..." : "Escribe tu mensaje..."
            }
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                if (thinking) return;
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button
            className={"ai__chat-button"}
            onClick={() => {
              const action = () => sendMessage();
              if (isDirty) {
                setConfirmNew({ show: true, action });
              } else {
                action();
              }
            }}
            disabled={thinking}
          >
            {thinking ? <TbWandOff /> : <TbWand />}
          </button>
        </div>

        <footer className="ai__footer-warning">
          <p>
            Recuerda que esta IA es una herramienta de apoyo y puede cometer
            errores. Verifica siempre la información proporcionada.
          </p>
        </footer>
      </motion.div>
    </motion.div>
  );
}

export default AIChatPanel;
