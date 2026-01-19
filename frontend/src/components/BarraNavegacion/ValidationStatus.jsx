import Icons from "../../components/Others/IconProvider.jsx";

const { FaCircleCheck } = Icons;

function ValidationStatus({ state, onValidate, disabled, progress }) {
  if (state === "validating") {
    return (
      <div
        className="nav__validation_progress"
        style={{ "--progress": `${progress}%` }} // Pasamos el progreso al CSS
      >
        <p>Validando... {progress}%</p>
      </div>
    );
  }

  if (state === "invalid") {
    return (
      <div className="nav__validation_progress invalid">
        <p>Inválido</p>
      </div>
    );
  }

  if (state === "valid") {
    return (
      <div className="nav__validation_progress valid">
        <FaCircleCheck />
        <p>Válido</p>
      </div>
    );
  }

  return (
    <button
      className="nav__button validate"
      onClick={onValidate}
      disabled={disabled}
    >
      Validar Diagrama
    </button>
  );
}

export default ValidationStatus;
