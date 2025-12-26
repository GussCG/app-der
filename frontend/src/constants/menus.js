import Icons from "../components/Others/IconProvider.jsx";

const {
  LuFileText,
  LuFileInput,
  MdOutlineSave,
  BiUndo,
  BiRedo,
  RiDeleteBin6Line,
  IoDuplicateOutline,
  MdOutlineCleaningServices,
  RiExpandDiagonalLine,
  IoMdGrid,
  FaRegKeyboard,
  LuInfo,
} = Icons;

const MENUS = {
  archivo: [
    { icon: LuFileText, label: "Nuevo diagrama" },
    { icon: LuFileInput, label: "Abrir ..." },
    { icon: MdOutlineSave, label: "Guardar", divider: true },
  ],
  editar: [
    { icon: BiUndo, label: "Deshacer" },
    { icon: BiRedo, label: "Rehacer" },
    { icon: RiDeleteBin6Line, label: "Eliminar selección" },
    { icon: IoDuplicateOutline, label: "Duplicar elemento", divider: true },
    { icon: MdOutlineCleaningServices, label: "Limpiar lienzo" },
  ],
  ver: [
    { icon: RiExpandDiagonalLine, label: "Ajustar pantalla" },
    { icon: IoMdGrid, label: "Ocultar cuadrícula", divider: true },
  ],
  ayuda: [
    { icon: FaRegKeyboard, label: "Atajos de teclado" },
    { icon: LuInfo, label: "Acerca de", divider: true },
  ],
};

export { MENUS };
