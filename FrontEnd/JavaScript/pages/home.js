import { clearSession, getUserData, setUserData, isAdmin } from "../components/session.js";
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
const modalDelete = document.getElementById("modalDelete");
//Initialize a new Bootstrap modal instance
const myModal = new bootstrap.Modal(modalDelete);
let IdToDelete = null;

document.addEventListener("DOMContentLoaded", () => {

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

  loadProfileIdentity();
  loadProducts();
});

async function loadProfileIdentity() {
  const nameElement = document.getElementById("profile-name");
  const avatarElement = document.getElementById("profile-avatar");
  avatarElement.addEventListener("error", () => {
    avatarElement.src = "../Assets/logo.ico";
  }, { once: true });
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
}

function loadProductsCatalog() {
  const continerProducts = document.getElementById("product-list");
  continerProducts.innerHTML = "";

  productList.forEach((product) => {
    const tarjeta = createCard(product);

    continerProducts.append(tarjeta);
  });
}

function getCategoryName(id) {
  const categoria = categoriesList.find(function (categoria) {
    return categoria.id === id;
  });

  if (categoria) {
    return categoria.nombre;
  }

  return "Sin categoría";
}

function createCard(product) {
  const nombreCategoria = getCategoryName(product.categoryId);
  const image = product.image? api.uploadURL + product.image : "https://placehold.co/600x400?text=Sin+imagen";
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
            ${isAdmin() ? `
              <button class="btn btn-primary bg-secondary-color mb-2" onclick="editSelectedProduct(${product.id})">Editar <i class="fas fa-edit"></i></button>
              <button class="btn btn-danger bg-tertiary-color mb-2" onclick="showModalDelete(${product.id})">Borrar <i class="fas fa-trash"></i></button>
            ` : ''}
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


// Expose to global so inline onclick in HTML can call them when loaded as module
window.showModalDelete = showModalDelete;
window.editSelectedProduct = editSelectedProduct;
