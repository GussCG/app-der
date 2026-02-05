import Icons from "../../components/Others/IconProvider.jsx";

const { FaCircleCheck } = Icons;

function ValidationStatus({ state, onValidate, disabled, progress }) {
  if (state === "validating") {
    return (
      <div
        className="nav__validation_progress"
        style={{ "--progress": `${progress}%` }}
        data-tour="validate-diagram-button"
      >
        <p>Validando... {progress}%</p>
      </div>
    );
  }

  if (state === "invalid") {
    return (
      <div
        className="nav__validation_progress invalid"
        data-tour="validate-diagram-button"
      >
        <p>Inválido</p>
      </div>
    );
  }

  if (state === "valid") {
    return (
      <div
        className="nav__validation_progress valid"
        data-tour="validate-diagram-button"
      >
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
      data-tour="validate-diagram-button"
    >
      Validar Diagrama
    </button>
  );
}

export default ValidationStatus;
