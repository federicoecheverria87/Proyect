const productModel = require("../models/productModel");

const getAll = async (req, res) => {
  try {
    const products = await productModel.getAll();

    res.status(200).json(products);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al obtener los productos",
    });
  }
};

const getById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const producto = await productModel.getById(id);
    if (!producto) {
      return res.status(404).json({
        mensaje: "No existe producto con ese ID",
      });
    }
    res.status(200).json(producto);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error en el servidor",
    });
  }
};

const create = async (req, res) => {
  try {
    const { name, description, price, stock, categoryId } = req.body;
    const image = req.file ? req.file.filename : null;

    const exists = await productModel.alreadyExists(name, categoryId);
    if (exists) {
      return res.status(400).json({
        error: "El producto ya existe",
      });
    }

    const newProduct = await productModel.create({
      name,
      description,
      image,
      price: Number(price),
      stock: Number(stock),
      categoryId,
    });

    res.status(201).json({
      mensaje: "Producto creado correctamente",
      producto: newProduct,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al crear producto",
    });
  }
};

const update = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, description, price, stock, categoryId } = req.body;

    const currentProduct = await productModel.getById(id);
    if (!currentProduct) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    const duplicate = await productModel.alreadyExists(name, categoryId, id);
    if (duplicate) {
      return res.status(400).json({
        error: "Ya existe otro producto con ese nombre en la categoría",
      });
    }

    await productModel.update(id, {
      name,
      description,
      price: Number(price),
      image: req.file ? req.file.filename : currentProduct.image,
      stock: Number(stock),
      categoryId,
    });

    res.status(200).json({
      mensaje: "Producto actualizado correctamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al actualizar el producto",
    });
  }
};

const disable = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const affectedRows = await productModel.disable(id);
    //acá pasa lo mismo que con filasModificadas
    if (affectedRows === 0) {
      return res.status(404).json({
        mensaje: "El producto no fue encontrado",
      });
    }
    res.status(200).json({
      mensaje: "El producto fue eliminado",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al eliminar producto",
    });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  disable,
};
