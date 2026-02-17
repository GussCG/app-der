import { useState, useEffect } from "react";
import { useEditor } from "../../../context/EditorContext.jsx";
import { Compact } from "@uiw/react-color";
import { hsvaToRgbaString, rgbaToHsva } from "@uiw/color-convert";
import { Colorful } from "@uiw/react-color";
import { AnimatePresence, motion } from "framer-motion";
import Icons from "../../Others/IconProvider.jsx";

const {
  CiTextAlignCenter,
  CiTextAlignJustify,
  CiTextAlignLeft,
  CiTextAlignRight,
  PiTextBBold,
  PiTextItalicBold,
  IoClose,
  FaLink,
  FaLock,
} = Icons;

function NoteInspector() {
  const { selectedElement, updateElement } = useEditor();
  if (!selectedElement) return null;

  const { text, style = {} } = selectedElement.data;

  const [separateRadius, setSeparateRadius] = useState(() => {
    const {
      borderTopLeftRadius,
      borderTopRightRadius,
      borderBottomLeftRadius,
      borderBottomRightRadius,
    } = style;
    return (
      new Set([
        borderTopLeftRadius,
        borderTopRightRadius,
        borderBottomLeftRadius,
        borderBottomRightRadius,
      ]).size > 1
    );
  });
  const [separatePadding, setSeparatePadding] = useState(() => {
    const { paddingTop, paddingRight, paddingBottom, paddingLeft } = style;
    return (
      new Set([paddingTop, paddingRight, paddingBottom, paddingLeft]).size > 1
    );
  });

  const updateStyle = (updates) => {
    if (!selectedElement) return;

    updateElement({
      id: selectedElement.id,
      kind: "note",
      data: {
        ...selectedElement.data,
        style: {
          ...selectedElement.data.style,
          ...updates,
        },
      },
    });
  };

  const updateText = (value) => {
    if (!selectedElement) return;
    updateElement({
      id: selectedElement.id,
      kind: "note",
      data: {
        ...selectedElement.data,
        text: value,
      },
    });
  };

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorHsva, setColorHsva] = useState({ h: 0, s: 0, v: 0, a: 1 });
  const [showBGColorPicker, setShowBGColorPicker] = useState(false);
  const [bgColorHsva, setBGColorHsva] = useState({ h: 0, s: 0, v: 0, a: 1 });
  const [showBorderColorPicker, setShowBorderColorPicker] = useState(false);
  const [borderColorHsva, setBorderColorHsva] = useState({
    h: 0,
    s: 0,
    v: 0,
    a: 1,
  });

  useEffect(() => {
    if (selectedElement) {
      setColorHsva(rgbaToHsva(style.color || "rgba(0,0,0,1)"));
      setBGColorHsva(
        rgbaToHsva(style.backgroundColor || "rgba(255,255,136,1)"),
      );
      setBorderColorHsva(rgbaToHsva(style.borderColor || "rgba(0,0,0,1)"));
    }
  }, [selectedElement.id]);

  const handleColorChange = (newColor, type) => {
    const hsva = newColor.hsva;
    const rgbaString = hsvaToRgbaString(hsva);

    if (type === "text") {
      setColorHsva(hsva);
      updateStyle({ color: rgbaString });
    } else if (type === "background") {
      setBGColorHsva(hsva);
      updateStyle({ backgroundColor: rgbaString });
    } else if (type === "border") {
      setBorderColorHsva(hsva);
      updateStyle({ borderColor: rgbaString });
    }
  };

  const [borderWidthInput, setBorderWidthInput] = useState(
    style.borderWidth ?? "",
  );

  useEffect(() => {
    setBorderWidthInput(style.borderWidth ?? "");
  }, [selectedElement.id]);

  return (
    <motion.div className="properties__container note">
      <div className="properties__item">
        <div className="item input--text">
          <label>Contenido</label>
          <textarea
            value={text}
            onChange={(e) => updateText(e.target.value)}
            rows={4}
            style={{
              width: "100%",
              backgroundColor: "var(--properties-input-bg-color)",
              border: "1px solid transparent",
              borderRadius: "5px",
              color: "var(--properties-input-color)",
              padding: "8px",
              fontFamily: "inherit",
              resize: "none",
            }}
          />
        </div>
      </div>

      <div className="properties__item divider">
        <div className="item input--select">
          <label>Fuente</label>
          <select
            value={style.fontFamily}
            onChange={(e) => updateStyle({ fontFamily: e.target.value })}
          >
            <option value="Arial">Arial</option>
            <option value="Verdana">Verdana</option>
            <option value="Georgia">Georgia</option>
            <option value="Courier New">Courier</option>
            <option value="Times New Roman">Times</option>
          </select>
        </div>

        <div className="item input--text">
          <label>Tamaño (px)</label>
          <input
            type="number"
            min={8}
            max={72}
            value={style.fontSize || 14}
            onChange={(e) => updateStyle({ fontSize: Number(e.target.value) })}
          />
        </div>

        <div className="font-style-row">
          <button
            className={`style-button ${style.fontWeight >= 600 ? "active" : ""}`}
            onClick={() =>
              updateStyle({ fontWeight: style.fontWeight >= 600 ? 400 : 700 })
            }
          >
            <PiTextBBold />
          </button>

          <button
            className={`style-button ${style.fontStyle === "italic" ? "active" : ""}`}
            onClick={() =>
              updateStyle({
                fontStyle: style.fontStyle === "italic" ? "normal" : "italic",
              })
            }
          >
            <PiTextItalicBold />
          </button>

          <button
            className={`style-button ${style.textAlign === "left" ? "active" : ""}`}
            onClick={() => updateStyle({ textAlign: "left" })}
          >
            <CiTextAlignLeft />
          </button>

          <button
            className={`style-button ${style.textAlign === "center" ? "active" : ""}`}
            onClick={() => updateStyle({ textAlign: "center" })}
          >
            <CiTextAlignCenter />
          </button>

          <button
            className={`style-button ${style.textAlign === "right" ? "active" : ""}`}
            onClick={() => updateStyle({ textAlign: "right" })}
          >
            <CiTextAlignRight />
          </button>

          <button
            className={`style-button ${style.textAlign === "justify" ? "active" : ""}`}
            onClick={() => updateStyle({ textAlign: "justify" })}
          >
            <CiTextAlignJustify />
          </button>
        </div>
      </div>

      <div className="properties__item color divider note-color">
        <div className="color-row flex-row">
          <label htmlFor="text-color">Color de texto</label>

          <div className="color-picker-wrapper">
            <button
              className="color-swatch"
              onClick={() => setShowColorPicker(!showColorPicker)}
              style={{ backgroundColor: hsvaToRgbaString(colorHsva) }}
            />

            <AnimatePresence>
              {showColorPicker && (
                <motion.div
                  className="color-picker-popover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Colorful
                    color={colorHsva}
                    onChange={(color) => handleColorChange(color, "text")}
                    disableAlpha={false}
                  />
                  <button
                    className="color-picker-close"
                    onClick={() => setShowColorPicker(false)}
                  >
                    <IoClose />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="color-row flex-row">
          <label htmlFor="bg-color">Color de fondo</label>

          <div className="color-picker-wrapper">
            <button
              className="color-swatch"
              onClick={() => setShowBGColorPicker(!showBGColorPicker)}
              style={{
                backgroundColor: hsvaToRgbaString(bgColorHsva),
              }}
            />

            <AnimatePresence>
              {showBGColorPicker && (
                <motion.div
                  className="color-picker-popover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Colorful
                    color={bgColorHsva}
                    onChange={(color) => handleColorChange(color, "background")}
                    disableAlpha={false}
                  />
                  <button
                    className="color-picker-close"
                    onClick={() => setShowBGColorPicker(false)}
                  >
                    <IoClose />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="properties__item color divider note-border">
        <div className="item input--text">
          <label>Ancho del borde</label>
          <input
            type="text"
            inputMode="numeric"
            value={borderWidthInput}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "") {
                setBorderWidthInput("");
                updateStyle({ borderWidth: 0 });
                return;
              }

              if (/^\d+$/.test(val)) {
                const num = Number(val);

                if (num <= 10) {
                  setBorderWidthInput(val);
                  updateStyle({ borderWidth: num });
                }
              }
            }}
          />
        </div>

        <div className="color-row flex-row">
          <label htmlFor="border-color">Color del borde</label>

          <div className="color-picker-wrapper">
            <button
              className="color-swatch"
              onClick={() => setShowBorderColorPicker((v) => !v)}
              style={{
                backgroundColor: hsvaToRgbaString(borderColorHsva),
              }}
            />

            <AnimatePresence>
              {showBorderColorPicker && (
                <motion.div
                  className="color-picker-popover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Colorful
                    color={borderColorHsva}
                    onChange={(color) => handleColorChange(color, "border")}
                    disableAlpha={false}
                  />
                  <button
                    className="color-picker-close"
                    onClick={() => setShowBorderColorPicker(false)}
                  >
                    <IoClose />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="properties__item divider">
        <label>Radio de bordes</label>

        <div className="radius-visual-container">
          <div
            className="radius-box"
            style={{
              borderTopLeftRadius: `${style.borderTopLeftRadius || style.borderRadius || 0}px`,
              borderTopRightRadius: `${style.borderTopRightRadius || style.borderRadius || 0}px`,
              borderBottomLeftRadius: `${style.borderBottomLeftRadius || style.borderRadius || 0}px`,
              borderBottomRightRadius: `${style.borderBottomRightRadius || style.borderRadius || 0}px`,
            }}
          >
            <input
              className="r-input tl"
              type="number"
              placeholder="TL"
              value={
                separateRadius
                  ? style.borderTopLeftRadius || 0
                  : style.borderRadius || 0
              }
              onChange={(e) => {
                const val = Number(e.target.value);
                separateRadius
                  ? updateStyle({ borderTopLeftRadius: val })
                  : updateStyle({
                      borderRadius: val,
                      borderTopLeftRadius: val,
                      borderTopRightRadius: val,
                      borderBottomLeftRadius: val,
                      borderBottomRightRadius: val,
                    });
              }}
            />
            {/* Esquina Superior Derecha */}
            <input
              className="r-input tr"
              type="number"
              placeholder="TR"
              disabled={!separateRadius}
              value={
                separateRadius
                  ? style.borderTopRightRadius || 0
                  : style.borderRadius || 0
              }
              onChange={(e) =>
                updateStyle({ borderTopRightRadius: Number(e.target.value) })
              }
            />
            {/* Icono de enlace en el centro */}
            <div
              className="radius-center"
              onClick={() => setSeparateRadius(!separateRadius)}
            >
              {separateRadius ? <FaLock /> : <FaLink />}
            </div>
            {/* Esquina Inferior Izquierda */}
            <input
              className="r-input bl"
              type="number"
              placeholder="BL"
              disabled={!separateRadius}
              value={
                separateRadius
                  ? style.borderBottomLeftRadius || 0
                  : style.borderRadius || 0
              }
              onChange={(e) =>
                updateStyle({
                  borderBottomLeftRadius: Number(e.target.value),
                })
              }
            />
            {/* Esquina Inferior Derecha */}
            <input
              className="r-input br"
              type="number"
              placeholder="BR"
              disabled={!separateRadius}
              value={
                separateRadius
                  ? style.borderBottomRightRadius || 0
                  : style.borderRadius || 0
              }
              onChange={(e) =>
                updateStyle({
                  borderBottomRightRadius: Number(e.target.value),
                })
              }
            />
          </div>
        </div>
      </div>

      <div className="properties__item">
        <label>Padding</label>
        <div className="padding-visual-container">
          <div className="padding-box">
            {/* Input Arriba */}
            <input
              className="p-input top"
              type="number"
              value={style.paddingTop || 0}
              onChange={(e) => {
                const val = Number(e.target.value);
                separatePadding
                  ? updateStyle({ paddingTop: val })
                  : updateStyle({
                      paddingTop: val,
                      paddingRight: val,
                      paddingBottom: val,
                      paddingLeft: val,
                    });
              }}
            />
            {/* Input Derecha */}
            <input
              className="p-input right"
              type="number"
              disabled={!separatePadding}
              value={style.paddingRight || 0}
              onChange={(e) =>
                updateStyle({ paddingRight: Number(e.target.value) })
              }
            />
            {/* Centro / Switch */}
            <div
              className="padding-center"
              onClick={() => setSeparatePadding(!separatePadding)}
            >
              {separatePadding ? <FaLink /> : <FaLock />}
            </div>
            {/* Input Izquierda */}
            <input
              className="p-input left"
              type="number"
              disabled={!separatePadding}
              value={style.paddingLeft || 0}
              onChange={(e) =>
                updateStyle({ paddingLeft: Number(e.target.value) })
              }
            />
            {/* Input Abajo */}
            <input
              className="p-input bottom"
              type="number"
              disabled={!separatePadding}
              value={style.paddingBottom || 0}
              onChange={(e) =>
                updateStyle({ paddingBottom: Number(e.target.value) })
              }
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default NoteInspector;
