export function mostrarToast(mensaje, tipo) {
  const toast = document.getElementById("toast");
  toast.classList.remove("show", tipo);
  toast.textContent = mensaje;
  void toast.offsetWidth;
  toast.classList.add("toast", tipo, "show");

  setTimeout(() => {
    toast.classList.remove("show", "success", "error");
  }, 3000);
}