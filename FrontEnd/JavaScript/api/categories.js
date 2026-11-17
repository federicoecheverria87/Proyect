import * as api from "./api.js";

function getAuthorizationHeader() {
  const token = sessionStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

async function getResponseData(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || data.mensaje || "No se pudo completar la operación.",
    );
  }

  return data;
}

export async function getCategories() {
  const response = await fetch(api.categoriesURL, {
    headers: getAuthorizationHeader(),
  });
  return getResponseData(response);
}

export async function saveCategory(id, name) {
  const response = await fetch(
    id ? `${api.categoriesURL}/${encodeURIComponent(id)}` : api.categoriesURL,
    {
      method: id ? "PUT" : "POST",
      headers: {
        ...getAuthorizationHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    },
  );
  return getResponseData(response);
}

export async function deleteCategory(id) {
  const response = await fetch(
    `${api.categoriesURL}/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: getAuthorizationHeader(),
    },
  );
  return getResponseData(response);
}

export default {
  getCategories,
  saveCategory,
  deleteCategory,
};
