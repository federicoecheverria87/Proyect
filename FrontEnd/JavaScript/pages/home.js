import {
  clearSession,
  getUserData,
  setUserData,
  isLoggedIn,
  isAdmin,
} from "../components/session.js";
import {
  redirectToIndex,
  redirectToEditProduct,
  redirectToProductDetail,
} from "../components/navigation.js";
import { getCategories as apiGetCategories } from "../api/categories.js";
import {
  getProducts as apiGetProducts,
  deleteProduct as apiDeleteProduct,
} from "../api/products.js";
import { mostrarToast } from "../components/toast.js";
import { getMyUser } from "../api/users.js";
import * as api from "../api/api.js";

let categoriesList;
let productList;
let searchProducts;
let filterCategory;

const modalDelete = document.getElementById("modalDelete");
//Initialize a new Bootstrap modal instance
const myModal = new bootstrap.Modal(modalDelete);
let IdToDelete = null;

document.addEventListener("DOMContentLoaded", () => {
  if (!isLoggedIn()) {
    redirectToIndex();
    return;
  }
  
  if (isAdmin()) {
    document.getElementById("adminDropdown").classList.remove("d-none");
  }

  document.getElementById("logout").addEventListener("click", (event) => {
    event.preventDefault();
    clearSession();
    redirectToIndex();
  });

  document
    .getElementById("btnDelete")
    .addEventListener("click", deleteSelectedProduct);

  searchProducts = document.getElementById("search-products");

  filterCategory = document.getElementById("filter-category");
  searchProducts.addEventListener("input", filterProducts);
  filterCategory.addEventListener("change", filterProducts);

  loadProfileIdentity();
  loadProducts();
});

async function loadProfileIdentity() {
  const nameElement = document.getElementById("profile-name");
  const avatarElement = document.getElementById("profile-avatar");
  avatarElement.addEventListener(
    "error",
    () => {
      avatarElement.src = "../Assets/logo.ico";
    },
    { once: true },
  );
  let user = getUserData();

  if (!user.name) {
    try {
      user = await getMyUser();
      setUserData(user);
    } catch (error) {
      console.error("No se pudo cargar el perfil del usuario:", error);
      return;
    }
  }

  nameElement.textContent = user.name || "";
  if (user.photo) {
    avatarElement.src = api.uploadURL + encodeURIComponent(user.photo);
  }
}

async function loadProducts() {
  await loadLists();
  //Load table
  loadProductsCatalog();
}

async function loadLists() {
  categoriesList = await apiGetCategories();
  productList = await apiGetProducts();
  loadFilterCategories(categoriesList);
}

function loadProductsCatalog() {
  const continerProducts = document.getElementById("product-list");
  continerProducts.innerHTML = "";

  if (productList.length === 0) {
    const message = document.createElement("p");
    message.className = "col-12 text-center text-tertiary-color";
    message.textContent = "No se encontraron productos.";
    continerProducts.append(message);
    return;
  } else {
    productList.forEach((product) => {
      const tarjeta = createCard(product);

      continerProducts.append(tarjeta);
    });
  }
}

function filterProducts() {
  const searchText = searchProducts.value.trim().toLowerCase();
  const selectedCategory = filterCategory.value;
  const filteredProducts = productList.filter((product) => {
    const searchableText =
      `${product.name || ""} ${product.description || ""}`.toLowerCase();
    const matchesSearch = searchableText.includes(searchText);
    const matchesCategory =
      selectedCategory === "" ||
      String(product.categoryId) === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const containerProducts = document.getElementById("product-list");
  containerProducts.innerHTML = "";

  if (filteredProducts.length === 0) {
    const message = document.createElement("p");
    message.className = "col-12 text-center text-tertiary-color";
    message.textContent = "No se encontraron productos.";
    containerProducts.append(message);
    return;
  }

  filteredProducts.forEach((product) => {
    containerProducts.append(createCard(product));
  });
}

function getCategoryName(id) {
  const category = categoriesList.find(function (cat) {
    return cat.id === id;
  });

  if (category) {
    return category.name;
  }

  return "Sin categoría";
}

function createCard(product) {
  const nombreCategoria = getCategoryName(product.categoryId);
  const image = product.image
    ? api.uploadURL + product.image
    : "https://placehold.co/600x400?text=Sin+imagen";
  const columna = document.createElement("div");

  columna.className = "col-12 col-sm-6 col-lg-4";

  columna.innerHTML = `
    <div class="card h-100 product-card">
        <img src="${image}"
          class="card-img-top imagen-producto" alt="${product.name}">

        <div class="card-body d-flex flex-column">

            <h3 class="card-title h5">
                ${product.name}
            </h3>

            <p class="text-muted">Categoría: ${nombreCategoria}</p>

            <p class="card-text">
                ${product.description}
            </p>
            <p class="fw-bold">
                $${product.price}
            </p>

            <p>${product.stock > 0 ? `Stock: ${product.stock}` : "Sin stock"}</p>

            <button class="btn btn-primary mt-auto boton-producto bg-primary-color mb-2">
                Ver producto <i class="fas fa-eye"></i>
            </button>
            ${
              isAdmin()
                ? `
              <button class="btn btn-primary bg-secondary-color mb-2" onclick="editSelectedProduct(${product.id})">Editar <i class="fas fa-edit"></i></button>
              <button class="btn btn-danger bg-tertiary-color mb-2" onclick="showModalDelete(${product.id})">Borrar <i class="fas fa-trash"></i></button>
            `
                : ""
            }
        </div>
    </div>
`;

  const boton = columna.querySelector(".boton-producto");

  boton.addEventListener("click", () => redirectToProductDetail(product.id));
  return columna;
}

function editSelectedProduct(id) {
  redirectToEditProduct(id);
}

function showModalDelete(id) {
  IdToDelete = id;
  let textId = document.getElementById("deleteId");
  textId.innerHTML = IdToDelete;

  //Show the modal
  myModal.show();
}

async function deleteSelectedProduct() {
  if (IdToDelete) {
    const result = await apiDeleteProduct(IdToDelete);
    myModal.hide();

    if (result.ok) {
      mostrarToast("Producto eliminado", "success");
      loadProductList();
    } else {
      mostrarToast("Ocurrio algun error", "error");
    }
  }
}

// Search & Filter
function loadFilterCategories(categories) {
  categories.forEach(function (category) {
    const opcion = document.createElement("option");

    opcion.value = category.id;

    opcion.textContent = category.name;

    filterCategory.append(opcion);
  });
}

// Expose to global so inline onclick in HTML can call them when loaded as module
window.showModalDelete = showModalDelete;
window.editSelectedProduct = editSelectedProduct;
