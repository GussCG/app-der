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
  FaMoon,
  MdSunny,
  FaImage,
  TbSql,
} = Icons;

const MENUS = {
  archivo: [
    {
      icon: LuFileText,
      label: "Nuevo diagrama",
    },
    { icon: LuFileInput, label: "Abrir ...", divider: true },
    // { icon: TbSql, label: "Importar SQL", command: "Ctrl+I", },
    { icon: MdOutlineSave, label: "Guardar diagrama" },
    { icon: FaImage, label: "Exportar imagen" },
  ],
  editar: [
    { icon: BiUndo, label: "Deshacer", command: "Ctrl+Z" },
    { icon: BiRedo, label: "Rehacer", command: "Ctrl+Y" },
    {
      icon: RiDeleteBin6Line,
      label: "Eliminar",
      command: "Supr | Del",
      divider: true,
    },
    {
      icon: IoDuplicateOutline,
      label: "Duplicar elemento",
      command: "Ctrl+D",
    },
    {
      icon: MdOutlineCleaningServices,
      label: "Limpiar lienzo",
    },
  ],
  ver: [
    {
      icon: RiExpandDiagonalLine,
      label: "Ajustar pantalla",
      command: "Ctrl+A",
      divider: true,
    },
    {
      icon: IoMdGrid,
      label: "Ocultar cuadrícula",

      command: "Ctrl+G",
    },
    {
      icon: FaMoon,
      label: "Cambiar de tema",
      command: "Ctrl+J",
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
