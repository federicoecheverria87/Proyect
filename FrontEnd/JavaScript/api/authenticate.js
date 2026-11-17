import * as api from "./api.js";
import * as actionsLoginForm from "../components/actionsLoginForm.js";

//==================================================
// POST - LOGIN//
//==================================================
export async function login() {
  const { email, password } = actionsLoginForm.getValuesLoginForm();

  const credentials = {
    email,
    password
  };

  try {
    const respuesta = await fetch(api.loginURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(credentials)
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
      return {
        ok: false,
        mensaje: data.mensaje || data.error || "Datos incorrectos"
      };
    }

    return { ok: true, data };

  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return {
      ok: false,
      mensaje: "Error de conexión con el servidor"
    };
  }
}

export default {
  login,
};