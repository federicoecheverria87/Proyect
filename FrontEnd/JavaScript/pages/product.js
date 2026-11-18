import * as api from "../api/api.js";
import { getCategories } from "../api/categories.js";
import {
  getProductById,
  saveProduct as apiSaveProduct,
} from "../api/products.js";
import { clearSession } from "../components/session.js";
import { redirectToHome, redirectToIndex } from "../components/navigation.js";
import { mostrarToast } from "../components/toast.js";

const form = document.getElementById("form-product");
const title = document.getElementById("form-title");
const submitButton = document.getElementById("submit-product");
const imageInput = document.getElementById("image");
const imagePreview = document.getElementById("image-preview");
const imageHelp = document.getElementById("image-help");
const productId = new URLSearchParams(window.location.search).get("id");
let currentImage = "";

document.addEventListener("DOMContentLoaded", () => {
  if (!isLoggedIn()) {
    redirectToIndex();
    return;
  }

  document.getElementById("logout").addEventListener("click", (event) => {
    event.preventDefault();
    clearSession();
    redirectToIndex();
  });

  form.addEventListener("submit", saveProduct);
  imageInput.addEventListener("change", previewSelectedImage);

  initializeForm();
});

async function initializeForm() {
  if (!sessionStorage.getItem("token")) {
    //TODO Validate admin role too
    mostrarToast("Iniciá sesión para continuar.", "error");
    window.setTimeout(redirectToIndex, 1000);
    return;
  }

  try {
    const categories = await getCategories();
    populateCategories(categories);

    if (productId) {
      await loadProduct(productId);
    }
  } catch (error) {
    console.error("No se pudo cargar el formulario del producto:", error);
    mostrarToast(error.message || "No se pudo cargar el formulario.", "error");
    submitButton.disabled = true;
  }
}

async function cleanProductForm() {
  if (form) {
    form.reset();
  }
  if (productId) {
    await loadProduct(productId);
  }
}

function populateCategories(categories) {
  if (!Array.isArray(categories)) {
    throw new Error("La respuesta de categorías no tiene el formato esperado.");
  }

  const select = document.getElementById("categoryId");
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    select.append(option);
  });

  if (categories.length === 0) {
    throw new Error(
      "No hay categorías activas. Creá una categoría antes de cargar un producto.",
    );
  }
}

async function loadProduct(id) {
  if (!/^\d+$/.test(id) || Number(id) <= 0) {
    throw new Error("El identificador del producto no es válido.");
  }

  const product = await getProductById(id);

  if (!product) {
    redirectToHome();
  }

  title.textContent = "Editar producto";
  submitButton.textContent = "Guardar cambios";
  imageHelp.textContent =
    "Dejá el campo vacío para conservar la imagen actual.";

  document.getElementById("name").value = product.name ?? "";
  document.getElementById("description").value = product.description ?? "";
  document.getElementById("price").value = product.price ?? "";
  document.getElementById("stock").value = product.stock ?? "";
  document.getElementById("categoryId").value = product.categoryId ?? "";

  currentImage = product.image || "";
  if (currentImage) {
    imagePreview.src = getImageUrl(currentImage);
    imagePreview.classList.remove("d-none");
  }
}

function getImageUrl(image) {
  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  return `${api.uploadURL}${encodeURIComponent(image)}`;
}

function previewSelectedImage() {
  const [file] = imageInput.files;
  if (!file) {
    imagePreview.src = currentImage ? getImageUrl(currentImage) : "";
    imagePreview.classList.toggle("d-none", !currentImage);
    return;
  }

  imagePreview.src = URL.createObjectURL(file);
  imagePreview.classList.remove("d-none");
}

async function saveProduct(event) {
  event.preventDefault();
  form.classList.add("was-validated");

  const price = Number(document.getElementById("price").value);
  const stock = Number(document.getElementById("stock").value);

  if (
    !form.checkValidity() ||
    !Number.isFinite(price) ||
    price <= 0 ||
    !Number.isSafeInteger(stock) ||
    stock < 0 ||
    (!productId && imageInput.files.length === 0)
  ) {
    if (!productId && imageInput.files.length === 0) {
      imageInput.setCustomValidity("Seleccioná una imagen para el producto.");
      form.reportValidity();
      imageInput.setCustomValidity("");
    } else {
      form.reportValidity();
    }
    return;
  }

  const formData = new FormData(form);
  if (imageInput.files.length === 0) {
    formData.delete("image");
  }

  submitButton.disabled = true;

  try {
    const result = await apiSaveProduct(formData, productId);

    if (result === null || result === undefined) {
      submitButton.disabled = false;
      return;
    }

    mostrarToast(
      result.mensaje || "Producto guardado correctamente!",
      "success",
    );
    redirectToHome();
  } catch (error) {
    console.error("No se pudo guardar el producto:", error);
    mostrarToast(
      error.message || "Error de conexión con el servidor.",
      "error",
    );
    submitButton.disabled = false;
  }
}
