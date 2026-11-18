import * as api from "../api/api.js";
import { getCategories } from "../api/categories.js";
import { getProductById } from "../api/products.js";
import { clearSession } from "../components/session.js";
import { redirectToHome, redirectToIndex } from "../components/navigation.js";
import { mostrarToast } from "../components/toast.js";

const productDetail = document.getElementById("product-detail");
const productId = new URLSearchParams(window.location.search).get("id");

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

  initializeDetail();
});

async function initializeDetail() {
  if (!sessionStorage.getItem("token")) {
    mostrarToast("Iniciá sesión para continuar.", "error");
    window.setTimeout(redirectToIndex, 1000);
    return;
  }

  if (!productId || !/^\d+$/.test(productId) || Number(productId) <= 0) {
    showError("El identificador del producto no es válido.");
    return;
  }

  try {
    const [product, categories] = await Promise.all([
      getProductById(productId),
      getCategories(),
    ]);

    if (!product) {
      showError("No se pudo encontrar el producto solicitado.");
      return;
    }

    const category = Array.isArray(categories)
      ? categories.find(
          (item) => Number(item.id) === Number(product.categoryId),
        )
      : null;

    renderProduct(product, category?.name || "Sin categoría");
  } catch (error) {
    console.error("No se pudo cargar el detalle del producto:", error);
    showError(error.message || "No se pudo cargar el producto.");
  }
}

function renderProduct(product, categoryName) {
  productDetail.replaceChildren();

  const imageColumn = document.createElement("div");
  imageColumn.className = "col-12 col-md-6";

  if (product.image) {
    const image = document.createElement("img");
    image.src = /^https?:\/\//i.test(product.image)
      ? product.image
      : `${api.uploadURL}${encodeURIComponent(product.image)}`;
    image.alt = product.name || "Imagen del producto";
    image.className = "img-fluid rounded w-100";
    image.style.maxHeight = "480px";
    image.style.objectFit = "contain";
    imageColumn.append(image);
  } else {
    const placeholder = document.createElement("div");
    placeholder.className =
      "d-flex align-items-center justify-content-center bg-dark rounded text-white";
    placeholder.style.minHeight = "280px";
    placeholder.textContent = "Este producto no tiene imagen.";
    imageColumn.append(placeholder);
  }

  const infoColumn = document.createElement("div");
  infoColumn.className = "col-12 col-md-6 text-white";

  const name = document.createElement("h2");
  name.className = "text-primary-color";
  name.textContent = product.name || "Producto";

  const description = document.createElement("p");
  description.className = "my-4";
  description.textContent = product.description || "Sin descripción.";

  const category = document.createElement("p");
  category.textContent = `Categoría: ${categoryName}`;

  const price = document.createElement("p");
  price.className = "fs-3 fw-bold text-tertiary-color";
  price.textContent = `$${product.price}`;

  const stock = document.createElement("p");
  stock.textContent =
    Number(product.stock) > 0
      ? `Stock disponible: ${product.stock}`
      : "Producto sin stock";

  infoColumn.append(name, description, category, price, stock);
  productDetail.append(imageColumn, infoColumn);
}

function showError(message) {
  productDetail.replaceChildren();
  const errorMessage = document.createElement("p");
  errorMessage.className = "col-12 text-center text-white";
  errorMessage.textContent = message;
  productDetail.append(errorMessage);
  mostrarToast(message, "error");
}
