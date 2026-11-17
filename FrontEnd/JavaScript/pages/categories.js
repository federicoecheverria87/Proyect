import * as categoriesApi from "../api/categories.js";
import { clearSession } from "../components/session.js";
import { redirectToHome, redirectToIndex } from "../components/navigation.js";
import { mostrarToast } from "../components/toast.js";

const categoriesTableBody = document.getElementById("categories-list");
const emptyMessage = document.getElementById("empty-categories");
const categoryForm = document.getElementById("form-category");
const categoryNameInput = document.getElementById("category-name");
const categoryFormTitle = document.getElementById("categoryModalLabel");
const categorySubmitButton = document.getElementById("save-category");
const categoryError = document.getElementById("category-error");
const categoryModal = new bootstrap.Modal(
  document.getElementById("categoryModal"),
);
const deleteModal = new bootstrap.Modal(
  document.getElementById("deleteCategoryModal"),
);
let selectedCategoryId = null;

document.getElementById("logout").addEventListener("click", (event) => {
  event.preventDefault();
  clearSession();
  redirectToIndex();
});

document.getElementById("add-category").addEventListener("click", openCreateModal);
document.getElementById("confirm-delete-category").addEventListener("click", deleteSelectedCategory);
categoryForm.addEventListener("submit", saveSelectedCategory);
categoryNameInput.addEventListener("input", clearCategoryError);

if (!sessionStorage.getItem("token")) {
  mostrarToast("Iniciá sesión para continuar.", "error");
  window.setTimeout(redirectToIndex, 1000);
} else if (sessionStorage.getItem("rol")?.toLowerCase() !== "admin") {
  mostrarToast("No tenés permisos para administrar categorías.", "error");
  window.setTimeout(redirectToHome, 1000);
} else {
  loadCategories();
}

async function loadCategories() {
  categoriesTableBody.replaceChildren();
  emptyMessage.textContent = "Cargando categorías...";
  emptyMessage.classList.remove("d-none");

  try {
    const response = await categoriesApi.getCategories();
    if (!Array.isArray(response)) {
      throw new Error("La respuesta de categorías no tiene el formato esperado.");
    }

    const categories = response.map(normalizeCategory);
    emptyMessage.classList.toggle("d-none", categories.length > 0);
    emptyMessage.textContent = "No hay categorías activas.";
    categories.forEach(renderCategory);
  } catch (error) {
    console.error("No se pudieron cargar las categorías:", error);
    emptyMessage.textContent = "No se pudo cargar el listado de categorías.";
    mostrarToast(error.message || "No se pudieron cargar las categorías.", "error");
  }
}

function normalizeCategory(category) {
  const fields = Object.fromEntries(
    Object.entries(category).map(([key, value]) => [key.toLowerCase(), value]),
  );

  return {
    id: fields.id ?? "",
    name: fields.name ?? "",
  };
}

function renderCategory(category) {
  const row = document.createElement("tr");
  const idCell = document.createElement("td");
  idCell.textContent = category.id || "—";

  const nameCell = document.createElement("td");
  nameCell.textContent = category.name || "—";

  const actionsCell = document.createElement("td");
  actionsCell.className = "text-nowrap";

  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.className = "btn btn-sm btn-primary me-2";
  editButton.textContent = "Modificar";
  editButton.addEventListener("click", () => openEditModal(category));

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "btn btn-sm btn-danger";
  deleteButton.textContent = "Eliminar";
  deleteButton.addEventListener("click", () => openDeleteModal(category));

  actionsCell.append(editButton, deleteButton);
  row.append(idCell, nameCell, actionsCell);
  categoriesTableBody.append(row);
}

function openCreateModal() {
  selectedCategoryId = null;
  categoryForm.reset();
  categoryForm.classList.remove("was-validated");
  categoryFormTitle.textContent = "Crear categoría";
  categorySubmitButton.textContent = "Crear";
  clearCategoryError();
  categoryModal.show();
}

function openEditModal(category) {
  selectedCategoryId = category.id;
  categoryForm.reset();
  categoryForm.classList.remove("was-validated");
  categoryNameInput.value = category.name;
  categoryFormTitle.textContent = "Modificar categoría";
  categorySubmitButton.textContent = "Guardar cambios";
  clearCategoryError();
  categoryModal.show();
}

function clearCategoryError() {
  categoryError.textContent = "";
  categoryError.classList.add("d-none");
}

function showCategoryError(message) {
  categoryError.textContent = message;
  categoryError.classList.remove("d-none");
}

async function saveSelectedCategory(event) {
  event.preventDefault();
  categoryForm.classList.add("was-validated");

  if (!categoryForm.checkValidity()) {
    categoryForm.reportValidity();
    return;
  }

  categorySubmitButton.disabled = true;
  try {
    const result = await categoriesApi.saveCategory(
      selectedCategoryId,
      categoryNameInput.value.trim(),
    );
    categoryModal.hide();
    mostrarToast(
      result.mensaje || "Categoría guardada correctamente.",
      "success",
    );
    await loadCategories();
  } catch (error) {
    console.error("No se pudo guardar la categoría:", error);
    showCategoryError(error.message || "No se pudo guardar la categoría.");
  } finally {
    categorySubmitButton.disabled = false;
  }
}

function openDeleteModal(category) {
  selectedCategoryId = category.id;
  document.getElementById("delete-category-name").textContent = category.name;
  deleteModal.show();
}

async function deleteSelectedCategory() {
  const confirmButton = document.getElementById("confirm-delete-category");
  confirmButton.disabled = true;

  try {
    const result = await categoriesApi.deleteCategory(selectedCategoryId);
    deleteModal.hide();
    mostrarToast(result.mensaje || "Categoría eliminada correctamente.", "success");
    await loadCategories();
  } catch (error) {
    console.error("No se pudo eliminar la categoría:", error);
    mostrarToast(error.message || "No se pudo eliminar la categoría.", "error");
  } finally {
    confirmButton.disabled = false;
  }
}
