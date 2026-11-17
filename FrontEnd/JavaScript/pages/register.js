import * as usersApi from "../api/users.js";
import { redirectToLogin } from "../components/navigation.js";
import { mostrarToast } from "../components/toast.js";

const form = document.getElementById("form-register");
const submitButton = document.getElementById("submit-register");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");

passwordInput.addEventListener("input", validatePasswordConfirmation);
confirmPasswordInput.addEventListener("input", validatePasswordConfirmation);
form.addEventListener("submit", registerUser);

function validatePasswordConfirmation() {
  const passwordsMatch = passwordInput.value === confirmPasswordInput.value;
  confirmPasswordInput.setCustomValidity(
    passwordsMatch ? "" : "Las contraseñas no coinciden.",
  );
}

async function registerUser(event) {
  event.preventDefault();
  form.classList.add("was-validated");
  validatePasswordConfirmation();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  submitButton.disabled = true;

  const result = await usersApi.register(new FormData(form));

  if (!result.ok) {
    mostrarToast(result.mensaje, "error");
    submitButton.disabled = false;
    return;
  }

  mostrarToast(result.data.mensaje || "Cuenta creada correctamente.", "success");
  redirectToLogin();
}
