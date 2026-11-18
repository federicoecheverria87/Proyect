import * as usersApi from "../api/users.js";
import * as api from "../api/api.js";
import { clearSession, setUserData } from "../components/session.js";
import { redirectToIndex, redirectToLogin } from "../components/navigation.js";
import { mostrarToast } from "../components/toast.js";

const form = document.getElementById("form-profile");
const saveButton = document.getElementById("save-profile");
const passwordInput = document.getElementById("profile-password");
const confirmPasswordInput = document.getElementById("profile-confirm-password");
const photoInput = document.getElementById("profile-photo");
const photoPreview = document.getElementById("profile-photo-preview");
const photoMessage = document.getElementById("profile-photo-message");
const errorElement = document.getElementById("profile-error");
let previewUrl = null;
let currentPhoto = "";

document.addEventListener("DOMContentLoaded", () => {
  if (!isLoggedIn()) {
    redirectToIndex();
    return;
  }
});

document.getElementById("logout").addEventListener("click", (event) => {
  event.preventDefault();
  clearSession();
  redirectToIndex();
});

confirmPasswordInput.addEventListener("input", validatePasswordConfirmation);
passwordInput.addEventListener("input", validatePasswordConfirmation);
photoInput.addEventListener("change", previewSelectedPhoto);
form.addEventListener("submit", saveProfile);

if (!sessionStorage.getItem("token")) {
  mostrarToast("Iniciá sesión para continuar.", "error");
  window.setTimeout(redirectToLogin, 1000);
} else {
  loadProfile();
}

async function loadProfile() {
  try {
    const user = normalizeUser(await usersApi.getMyUser());
    document.getElementById("profile-name").value = user.name;
    document.getElementById("profile-email").value = user.email;
    document.getElementById("profile-role").textContent = user.role || "Sin rol";
    setUserData(user);
    setPhoto(user.photo);
  } catch (error) {
    console.error("No se pudo cargar el perfil:", error);
    mostrarToast(error.message || "No se pudo cargar el perfil.", "error");
    if (error.status === 401) {
      window.setTimeout(redirectToLogin, 1000);
    }
  }
}

function normalizeUser(user) {
  const fields = Object.fromEntries(
    Object.entries(user).map(([key, value]) => [key.toLowerCase(), value]),
  );

  return {
    name: fields.name || "",
    email: fields.email || "",
    photo: fields.photo || "",
    role: fields.role || "",
  };
}

function setPhoto(photo) {
  currentPhoto = photo || "";
  photoMessage.classList.add("d-none");
  photoPreview.onerror = null;

  if (!currentPhoto) {
    photoPreview.src = "../Assets/logo.ico";
    return;
  }

  photoPreview.onerror = () => {
    photoPreview.onerror = null;
    photoPreview.src = "../Assets/logo.ico";
    photoMessage.textContent = "La foto guardada no está disponible. Seleccioná otra imagen para reemplazarla.";
    photoMessage.classList.remove("d-none");
  };
  photoPreview.src = api.uploadURL + encodeURIComponent(currentPhoto);
}

function validatePasswordConfirmation() {
  const matches = passwordInput.value === confirmPasswordInput.value;
  confirmPasswordInput.setCustomValidity(matches ? "" : "Las contraseñas deben coincidir.");
}

function previewSelectedPhoto() {
  if (previewUrl) {
    URL.revokeObjectURL(previewUrl);
    previewUrl = null;
  }

  if (photoInput.files.length) {
    previewUrl = URL.createObjectURL(photoInput.files[0]);
    photoPreview.onerror = null;
    photoPreview.src = previewUrl;
    photoMessage.classList.add("d-none");
  } else {
    setPhoto(currentPhoto);
  }
}

async function saveProfile(event) {
  event.preventDefault();
  form.classList.add("was-validated");
  validatePasswordConfirmation();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  errorElement.textContent = "";
  errorElement.classList.add("d-none");
  saveButton.disabled = true;

  const formData = new FormData(form);
  if (!passwordInput.value) {
    formData.delete("password");
  }
  if (!photoInput.files.length) {
    formData.delete("photo");
  }

  try {
    const result = await usersApi.updateMyUser(formData);
    const user = normalizeUser(result.usuario);
    setUserData(user);
    document.getElementById("profile-role").textContent = user.role || "Sin rol";
    setPhoto(user.photo);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      previewUrl = null;
    }
    form.classList.remove("was-validated");
    passwordInput.value = "";
    confirmPasswordInput.value = "";
    photoInput.value = "";
    mostrarToast(result.mensaje || "Perfil actualizado correctamente.", "success");
  } catch (error) {
    console.error("No se pudo actualizar el perfil:", error);
    const message = error.status === 409
      ? "Ese correo electrónico ya está registrado. Elegí otro."
      : error.message || "No se pudo actualizar el perfil.";
    errorElement.textContent = message;
    errorElement.classList.remove("d-none");
  } finally {
    saveButton.disabled = false;
  }
}