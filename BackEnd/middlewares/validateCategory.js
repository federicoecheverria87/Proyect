function validateName(req, res, next) {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({
      error: "El nombre de la categoría es obligatorio",
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
  validateName: validateName,
  validateId: validateId,
};
