import { apiRequest, setToken, clearToken } from "./api";
import { AuthResponse, User } from "./types";
import { setFormMessage, validateRequired, showToast } from "./ui";

const USER_KEY = "taskflow_user";

export function getStoredUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as User) : null;
}

function storeSession(auth: AuthResponse): void {
  setToken(auth.token);
  localStorage.setItem(USER_KEY, JSON.stringify(auth.user));
}

export function logout(): void {
  clearToken();
  localStorage.removeItem(USER_KEY);
}

/**
 * Configura los formularios de login/registro, sus tabs y su validación.
 * onAuthSuccess se ejecuta cuando el usuario inicia sesión correctamente.
 */
export function setupAuthView(onAuthSuccess: (user: User) => void): void {
  const tabs = document.querySelectorAll<HTMLButtonElement>(".auth-tab");
  const loginForm = document.getElementById("loginForm") as HTMLFormElement;
  const registerForm = document.getElementById(
    "registerForm"
  ) as HTMLFormElement;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const target = tab.dataset.tab;
      loginForm.classList.toggle("hidden", target !== "login");
      registerForm.classList.toggle("hidden", target !== "register");
    });
  });

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const isValid = validateRequired(loginForm, [
      { id: "loginEmail", label: "El correo" },
      { id: "loginPassword", label: "La contraseña", minLength: 6 },
    ]);
    if (!isValid) return;

    const email = (document.getElementById("loginEmail") as HTMLInputElement)
      .value.trim();
    const password = (
      document.getElementById("loginPassword") as HTMLInputElement
    ).value;

    try {
      const auth = await apiRequest<AuthResponse>("/auth/login", {
        method: "POST",
        body: { email, password },
        auth: false,
      });
      storeSession(auth);
      setFormMessage("loginMessage", "", "success");
      onAuthSuccess(auth.user);
    } catch (error) {
      setFormMessage(
        "loginMessage",
        error instanceof Error ? error.message : "Error al iniciar sesión.",
        "error"
      );
    }
  });

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const isValid = validateRequired(registerForm, [
      { id: "registerName", label: "El nombre" },
      { id: "registerEmail", label: "El correo" },
      { id: "registerPassword", label: "La contraseña", minLength: 6 },
    ]);
    if (!isValid) return;

    const name = (document.getElementById("registerName") as HTMLInputElement)
      .value.trim();
    const email = (
      document.getElementById("registerEmail") as HTMLInputElement
    ).value.trim();
    const password = (
      document.getElementById("registerPassword") as HTMLInputElement
    ).value;

    try {
      const auth = await apiRequest<AuthResponse>("/auth/register", {
        method: "POST",
        body: { name, email, password },
        auth: false,
      });
      storeSession(auth);
      showToast("Cuenta creada exitosamente. ¡Bienvenido/a!", "success");
      onAuthSuccess(auth.user);
    } catch (error) {
      setFormMessage(
        "registerMessage",
        error instanceof Error ? error.message : "Error al registrarse.",
        "error"
      );
    }
  });
}
