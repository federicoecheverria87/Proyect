function validateProduct(req, res, next) {
  const { name, description, price, stock, categoryId } = req.body;
  const image = req.file ? req.file.filename : null;
  
  if (!name || name.trim() === "") {
    return res.status(400).json({
      error: "El nombre es obligatorio",
    });
  }
  if (!description || description.trim() === "") {
    return res.status(400).json({
      error: "La descripción es obligatoria",
    });
  }
  if (!price || isNaN(price) || price <= 0) {
    return res.status(400).json({
      error: "El precio es obligatorio y debe ser un número positivo",
    });
  }
  if (req.method === "POST" && !image) {
    return res.status(400).json({
      error: "La imagen es obligatoria",
    });
  }
  if (stock === undefined || stock === null || stock === "" || !Number.isFinite(Number(stock)) || Number(stock) < 0) {
    return res.status(400).json({
      error: "El stock es obligatorio y debe ser un número no negativo",
    });
  }
  if (!categoryId || !Number.isSafeInteger(Number(categoryId)) || Number(categoryId) <= 0) {
    return res.status(400).json({
      error: "La categoría es obligatoria",
    });
  }

  next();
}

function validateId(req, res, next) {
  const { id } = req.params;

  if (id == null || id.trim() === "") {
    return res.status(400).json({
      error: "El ID es invalido",
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
  validateProduct,
  validateId,
};
