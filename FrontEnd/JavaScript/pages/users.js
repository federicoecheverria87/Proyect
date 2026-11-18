import * as api from "../api/api.js";
import * as usersApi from "../api/users.js";
import { clearSession } from "../components/session.js";
import { redirectToHome, redirectToIndex } from "../components/navigation.js";
import { mostrarToast } from "../components/toast.js";

const usersTableBody = document.getElementById("users-list");
const emptyMessage = document.getElementById("empty-users");
const editForm = document.getElementById("form-edit-user");
const editButton = document.getElementById("save-user");
const editError = document.getElementById("edit-user-error");
const editModal = new bootstrap.Modal(document.getElementById("editUserModal"));
const deleteModal = new bootstrap.Modal(document.getElementById("deleteUserModal"));
let selectedUserId = null;

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

document.getElementById("confirm-delete-user").addEventListener("click", deleteSelectedUser);
editForm.addEventListener("submit", saveUser);
document.getElementById("edit-email").addEventListener("input", clearEditError);

if (!sessionStorage.getItem("token")) {
  mostrarToast("Iniciá sesión para continuar.", "error");
  window.setTimeout(redirectToIndex, 1000);
} else if (sessionStorage.getItem("rol")?.toLowerCase() !== "admin") {
  mostrarToast("No tenés permisos para administrar usuarios.", "error");
  window.setTimeout(redirectToHome, 1000);
} else {
  loadUsers();
}

async function loadUsers() {
  usersTableBody.replaceChildren();
  emptyMessage.textContent = "Cargando usuarios...";
  emptyMessage.classList.remove("d-none");

  try {
    const response = await usersApi.getUsers();
    if (!Array.isArray(response)) {
      throw new Error("La respuesta de usuarios no tiene el formato esperado.");
    }

    const users = response.map(normalizeUser);
    emptyMessage.classList.toggle("d-none", users.length > 0);
    emptyMessage.textContent = "No hay usuarios activos.";
    users.forEach(renderUser);
  } catch (error) {
    console.error("No se pudieron cargar los usuarios:", error);
    emptyMessage.textContent = "No se pudo cargar el listado de usuarios.";
    mostrarToast(error.message || "No se pudieron cargar los usuarios.", "error");
  }
}

function normalizeUser(user) {
  const fields = Object.fromEntries(
    Object.entries(user).map(([key, value]) => [key.toLowerCase(), value]),
  );

  return {
    id: fields.id ?? "",
    name: fields.name ?? "",
    email: fields.email ?? "",
    role: fields.role ?? "",
  };
}

function renderUser(user) {
  const row = document.createElement("tr");

  const idCell = document.createElement("td");
  idCell.textContent = user.id || "—";

  const nameCell = document.createElement("td");
  nameCell.textContent = user.name || "—";

  const emailCell = document.createElement("td");
  emailCell.textContent = user.email || "—";

  const roleCell = document.createElement("td");
  roleCell.textContent = user.role || "—";

  const actionsCell = document.createElement("td");
  actionsCell.className = "text-nowrap";

  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.className = "btn btn-sm btn-primary me-2";
  editButton.textContent = "Modificar";
  editButton.addEventListener("click", () => openEditModal(user));

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "btn btn-sm btn-danger";
  deleteButton.textContent = "Eliminar";
  deleteButton.addEventListener("click", () => openDeleteModal(user));

  actionsCell.append(editButton, deleteButton);
  row.append(idCell, nameCell, emailCell, roleCell, actionsCell);
  usersTableBody.append(row);
}

function openEditModal(user) {
  selectedUserId = user.id;
  clearEditError();
  document.getElementById("edit-name").value = user.name || "";
  document.getElementById("edit-email").value = user.email || "";
  document.getElementById("edit-role").value = user.role || "User";
  document.getElementById("edit-password").value = "";
  document.getElementById("edit-photo").value = "";
  editForm.classList.remove("was-validated");
  editModal.show();
}

function clearEditError() {
  editError.textContent = "";
  editError.classList.add("d-none");
}

function showEditError(message) {
  editError.textContent = message;
  editError.classList.remove("d-none");
  editError.scrollIntoView({ block: "nearest" });
}

function openDeleteModal(user) {
  selectedUserId = user.id;
  document.getElementById("delete-user-name").textContent =
    `${user.name} (${user.email})`;
  deleteModal.show();
}

async function saveUser(event) {
  event.preventDefault();
  editForm.classList.add("was-validated");
  if (!editForm.checkValidity()) {
    editForm.reportValidity();
    return;
  }

  editButton.disabled = true;
  const formData = new FormData(editForm);
  if (!formData.get("password")) {
    formData.delete("password");
  }
  if (!document.getElementById("edit-photo").files.length) {
    formData.delete("photo");
  }

  try {
    const result = await usersApi.updateUser(selectedUserId, formData);
    editModal.hide();
    mostrarToast(result.mensaje || "Usuario actualizado correctamente.", "success");
    await loadUsers();
  } catch (error) {
    console.error("No se pudo actualizar el usuario:", error);
    const message =
      error.code === "EMAIL_ALREADY_EXISTS" || error.status === 409
        ? "Ese correo electrónico ya está registrado. Elegí otro para este usuario."
        : error.message || "No se pudo actualizar el usuario.";
    showEditError(message);
  } finally {
    editButton.disabled = false;
  }
}

async function deleteSelectedUser() {
  const confirmButton = document.getElementById("confirm-delete-user");
  confirmButton.disabled = true;

  try {
    const result = await usersApi.deleteUser(selectedUserId);
    deleteModal.hide();
    mostrarToast(result.mensaje || "Usuario eliminado correctamente.", "success");
    await loadUsers();
  } catch (error) {
    console.error("No se pudo eliminar el usuario:", error);
    mostrarToast(error.message || "No se pudo eliminar el usuario.", "error");
  } finally {
    confirmButton.disabled = false;
  }
}