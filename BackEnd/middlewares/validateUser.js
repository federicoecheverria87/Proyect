function validateUser(req, res, next) {
    const { email, name, password } = req.body;
    const photo = req.file ? req.file.filename : null;
    const isUpdate = Boolean(req.params && req.params.id) || req.path === "/my";

    if (!email || email.trim() === "") {
        return res.status(400).json({
            error: "El correo electrónico es obligatorio"
        });
    }

    if (!name || name.trim() === "") {
        return res.status(400).json({
            error: "El nombre es obligatorio"
        });
    }

    if (!isUpdate && (!photo || photo.trim() === "")) {
        return res.status(400).json({
            error: "La foto es obligatoria"
        });
    }

    if (!isUpdate && (!password || password.trim() === "")) {
        return res.status(400).json({
            error: "La contraseña es obligatoria"
        });
    }

    if (isUpdate && password !== undefined && password.trim() === "") {
        return res.status(400).json({
            error: "La contraseña no puede estar vacía"
        });
    }

    next();
}


function validateRole(req, res, next) {
    const { role } = req.body;

    if (!role || !["Admin", "User"].includes(role)) {
        return res.status(400).json({
            error: "El rol debe ser Admin o User"
        });
    }

    next();
}

function validateId(req, res, next) {
  const { id } = req.params;

  if (!id ) {
    return res.status(400).json({
      error: "El ID es inválido",
    });
  }
  const numericId = Number(id);

  if (!Number.isSafeInteger(numericId) || numericId <= 0) {
    return res.status(400).json({
      mensaje: "El ID debe ser un número entero positivo",
    });
  }

  next();
}

module.exports = { 
    validateUser,
    validateRole, 
    validateId 
};