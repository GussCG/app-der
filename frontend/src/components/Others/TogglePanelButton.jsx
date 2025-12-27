function TogglePanelButton({
  onClick,
  icon: Icon,
  size = 18,
  title = "Esconder panel",
}) {
  return (
    <button
      className="panel__toggle_button"
      onClick={onClick}
      title={title}
      aria-label={title}
    >
      <Icon size={size} />
    </button>
  );
}

export default TogglePanelButton;
