import * as api from "./api.js";

function getAuthorizationHeader() {
  const token = sessionStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

async function getResponseData(response) {
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(
      data.error || data.mensaje || "No se pudo completar la operación.",
    );
    error.status = response.status;
    error.code = data.codigo;
    throw error;
  }

  return data;
}

export async function getUsers() {
  const response = await fetch(api.usersURL, {
    headers: getAuthorizationHeader(),
  });
  return getResponseData(response);
}

export async function getMyUser() {
  const response = await fetch(`${api.usersURL}/my`, {
    headers: getAuthorizationHeader(),
  });
  return getResponseData(response);
}

export async function updateMyUser(formData) {
  const response = await fetch(`${api.usersURL}/my`, {
    method: "PUT",
    headers: getAuthorizationHeader(),
    body: formData,
  });
  return getResponseData(response);
}

export async function updateUser(id, formData) {
  const response = await fetch(`${api.usersURL}/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: getAuthorizationHeader(),
    body: formData,
  });
  return getResponseData(response);
}

export async function deleteUser(id) {
  const response = await fetch(`${api.usersURL}/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: getAuthorizationHeader(),
  });
  return getResponseData(response);
}

export async function register(formData) {
  try {
    const response = await fetch(`${api.usersURL}/register`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        mensaje: data.error || data.mensaje || "No se pudo crear la cuenta.",
      };
    }

    return { ok: true, data };
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    return {
      ok: false,
      mensaje: "Error de conexión con el servidor.",
    };
  }
}

export default {
  getUsers,
  getMyUser,
  updateMyUser,
  updateUser,
  deleteUser,
  register,
};