import * as api from "./api.js";
import { mostrarToast } from "../components/toast.js";

//=================================
// GET - PRODUCT LIST //
//=================================
export async function getProducts() {
  try {
    const token = sessionStorage.getItem("token");
    const respuesta = await fetch(api.productsURL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await respuesta.json();

    return data;
  } catch (error) {
    mostrarToast("Error al cargar los productos", "error");
  }
}

//=================================
// GET - PRODUCT BY ID //
//=================================
export async function getProductById(id) {
  try {
    const token = sessionStorage.getItem("token");
    const respuesta = await fetch(api.productsURL + "/" + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await respuesta.json();

    if (!respuesta.ok) {
      mostrarToast(
        data.error || "Hubo un error al obtener el producto.",
        "error",
      );
      return;
    }

    return data;
  } catch (error) {
    mostrarToast("Error al obtener el turno", "error");
  }
}

//==================================================
// POST/PUT - ALTA Y MODIFICACION DE PRODUCTO
//==================================================
export async function saveProduct(formData, productId) {

  try {
    const url = productId
      ? `${api.productsURL}/${encodeURIComponent(productId)}`
      : api.productsURL;
    const response = await fetch(url, {
      method: productId ? "PUT" : "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: formData,
    });
    const result = await response.json();

    if (response.ok) {
      return result;
    }else{
      mostrarToast(result?.mensaje || "Hubo un error al guardar", "error");
      return;
    }

  } catch (error) {

    mostrarToast("Error de conexión con el servidor", "error");
  }
}

//==================================================
// DELETE - ELIMINAR TURNO LOGICO (PRODUCT)//
//==================================================
export async function deleteProduct(id) {
  try {
    const token = sessionStorage.getItem("token");
    const data = await fetch(`${api.productsURL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    mostrarToast("Error al eliminar", "error");
  }
}

export default {
  getProducts,
  getProductById,
  saveProduct,
  deleteProduct,
};
