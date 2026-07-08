// Funciones utilitarias de interfaz: mensajes de error por campo,
// mensajes de formulario y notificaciones tipo "toast".

export function setFieldError(inputId: string, message: string): void {
  const errorEl = document.querySelector<HTMLSpanElement>(
    `[data-error-for="${inputId}"]`
  );
  if (errorEl) errorEl.textContent = message;
}

export function clearFieldErrors(formEl: HTMLFormElement): void {
  formEl
    .querySelectorAll<HTMLSpanElement>(".field-error")
    .forEach((el) => (el.textContent = ""));
}

export function setFormMessage(
  messageId: string,
  message: string,
  type: "error" | "success" = "error"
): void {
  const el = document.getElementById(messageId);
  if (!el) return;
  el.textContent = message;
  el.className = `form-message ${type}`;
}

export function showToast(
  message: string,
  type: "error" | "success" = "success"
): void {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.remove("hidden");
  window.setTimeout(() => toast.classList.add("hidden"), 3000);
}

// Validación básica en el cliente. Retorna true si el formulario es válido.
export function validateRequired(
  formEl: HTMLFormElement,
  fields: { id: string; label: string; minLength?: number }[]
): boolean {
  let isValid = true;
  clearFieldErrors(formEl);

  for (const field of fields) {
    const input = document.getElementById(field.id) as
      | HTMLInputElement
      | HTMLTextAreaElement
      | null;
    if (!input) continue;

    const value = input.value.trim();

    if (!value) {
      setFieldError(field.id, `${field.label} es obligatorio.`);
      isValid = false;
      continue;
    }

    if (field.minLength && value.length < field.minLength) {
      setFieldError(
        field.id,
        `${field.label} debe tener al menos ${field.minLength} caracteres.`
      );
      isValid = false;
    }
  }

  return isValid;
}
