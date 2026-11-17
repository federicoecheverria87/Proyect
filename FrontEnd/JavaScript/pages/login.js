import {
  validateLoginForm,
  cleanLoginForm,
} from "../components/actionsLoginForm.js";
import * as authenticate from "../api/authenticate.js";
import { redirectToHome } from "../components/navigation.js";
import { setDataToken } from "../components/session.js";
import { mostrarToast } from "../components/toast.js";

document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("form-login");

  formulario.addEventListener("submit", (event) => loginUser(event));
});

async function loginUser(event) {
  event.preventDefault();

  if (validateLoginForm()) {
    const result = await authenticate.login();

    cleanLoginForm();
    if (!result.ok) {
      mostrarToast(result.mensaje || "Hubo un error al iniciar sesión", "error");
      return;
    }

    setDataToken(result.data.token, result.data.usuario.role, result.data.usuario);
    mostrarToast(result.data.mensaje || "Login exitoso", "success");
    redirectToHome();
  } else {
    mostrarToast("Por favor, revisar los datos ingresados.", "error");
  }
}
