import { mostrarToast } from "./toast.js";

export function getValuesLoginForm() {

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    

    return {
        email: email,
        password: password
    }
}

export function validateLoginForm() {

    let { email, password } = getValuesLoginForm();

    // VALIDATONS
    if (!email || email === "") {
        mostrarToast("El correo electrónico es obligatorio", "error");
        return;
    }

    if (!password || password === "") {
        mostrarToast("La contraseña es obligatoria", "error");
        return;
    }

    // ALL OK
    return true;
}


export function cleanLoginForm() {
    let addForm = document.getElementById("form-login");
    if(addForm){
        addForm.reset();
    }
}