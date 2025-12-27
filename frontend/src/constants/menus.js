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
  PiQuestionBold,
  HiOutlineTableCells,
  GrInspect,
  TbTools,
} = Icons;

const MENUS = {
  archivo: [
    { icon: LuFileText, label: "Nuevo diagrama", command: "Ctrl+N" },
    { icon: LuFileInput, label: "Abrir ...", command: "Ctrl+O" },
    { icon: MdOutlineSave, label: "Guardar", divider: true, command: "Ctrl+S" },
  ],
  editar: [
    { icon: BiUndo, label: "Deshacer", command: "Ctrl+Z" },
    { icon: BiRedo, label: "Rehacer", command: "Ctrl+Y" },
    {
      icon: RiDeleteBin6Line,
      label: "Eliminar selección",
      command: "Supr",
      divider: true,
    },
    {
      icon: IoDuplicateOutline,
      label: "Duplicar elemento",
      divider: true,
      command: "Ctrl+D",
    },
    {
      icon: MdOutlineCleaningServices,
      label: "Limpiar lienzo",
      command: "Ctrl+L",
    },
  ],
  ver: [
    {
      icon: RiExpandDiagonalLine,
      label: "Ajustar pantalla",
      command: "Ctrl+A",
    },
    {
      icon: IoMdGrid,
      label: "Ocultar cuadrícula",
      divider: true,
      command: "Ctrl+G",
    },
  ],
  ventana: [
    {
      icon: TbTools,
      label: "Abrir herramientas",
      divider: true,
      command: "Ctrl+T",
    },
  ],
  ayuda: [
    { icon: PiQuestionBold, label: "¿Cómo usar?" },
    { icon: FaRegKeyboard, label: "Atajos de teclado", command: "Ctrl+/" },
    { icon: LuInfo, label: "Acerca de", divider: true },
  ],
};

export { MENUS };
