export const ER_NAME_REGEX =
  /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ][A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9_ ]{1,49}$/;

export const FILE_NAME_REGEX =
  /^[A-Za-z0-9][A-Za-z0-9_-]{0,48}(\.[a-zA-Z0-9]{1,5})?$/;

export function validateERName(value) {
  const v = value.trim();

  if (!v) return "El nombre no puede estar vacío";

  if (/^\d/.test(v)) {
    return "El nombre no puede comenzar con un número";
  }

  if (v.length < 2) {
    return "Debe tener al menos 2 caracteres";
  }

  if (v.length > 50) {
    return "Máximo 50 caracteres";
  }

  if (!ER_NAME_REGEX.test(v)) {
    return "Solo letras, números, espacios y _";
  }

  return null;
}
