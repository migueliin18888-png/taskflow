import { setupAuthView, getStoredUser, logout } from "./auth";
import { setupBoard } from "./kanban";
import { User } from "./types";

const authView = document.getElementById("authView") as HTMLElement;
const boardView = document.getElementById("boardView") as HTMLElement;
const userBar = document.getElementById("userBar") as HTMLElement;
const userNameLabel = document.getElementById("userNameLabel") as HTMLElement;
const logoutBtn = document.getElementById("logoutBtn") as HTMLButtonElement;

function showBoard(user: User): void {
  authView.classList.add("hidden");
  boardView.classList.remove("hidden");
  userBar.classList.remove("hidden");
  userNameLabel.textContent = `👋 Hola, ${user.name}`;
  setupBoard();
}

function showAuth(): void {
  authView.classList.remove("hidden");
  boardView.classList.add("hidden");
  userBar.classList.add("hidden");
}

logoutBtn.addEventListener("click", () => {
  logout();
  showAuth();
});

setupAuthView((user) => showBoard(user));

// Si ya existe una sesión guardada (token + usuario), entra directo al tablero.
const storedUser = getStoredUser();
if (storedUser) {
  showBoard(storedUser);
} else {
  showAuth();
}
