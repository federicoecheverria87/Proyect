const categoryModel = require("../models/categoryModel");

const getById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const [category] = await categoryModel.getById(id);
        if (!category) {
            return res.status(404).json({
                mensaje: "No existe una categoría con ese ID"
            });
        }

        res.status(200).json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al obtener la categoría"
        });
    }
};

const getAll = async (req, res) => {
    try {
        const categories = await categoryModel.getAll();
        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al obtener las categorías"
        });
    }
};

const create = async (req, res) => {
    try {
        const name = typeof req.body.name === "string" ? req.body.name.trim() : "";

        if (await categoryModel.alreadyExists(name)) {
            return res.status(400).json({
                error: "La categoría ya existe"
            });
        }

        const result = await categoryModel.create({ name });
        res.status(201).json({
            mensaje: "Categoría creada correctamente",
            categoria: {
                id: result.insertId,
                name
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al crear la categoría"
        });
    }
};

const update = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const name = typeof req.body.name === "string" ? req.body.name.trim() : "";

        const [category] = await categoryModel.getById(id);
        if (!category) {
            return res.status(404).json({
                error: "Categoría no encontrada"
            });
        }

        if (await categoryModel.alreadyExists(name, id)) {
            return res.status(400).json({
                error: "Ya existe otra categoría con ese nombre"
            });
        }

        await categoryModel.update(id, { name });
        res.status(200).json({
            mensaje: "Categoría actualizada correctamente"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al actualizar la categoría"
        });
    }
};

const disable = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                error: "ID inválido"
            });
        }

        const productsInCategory = await categoryModel.getProductsInCategory(id);
        if (productsInCategory.length > 0) {
            return res.status(400).json({
                mensaje: "No se puede eliminar la categoría porque tiene productos asociados"
            });
        }

        const affectedRows = await categoryModel.disable(id);
        if (affectedRows === 0) {
            return res.status(404).json({
                mensaje: "La categoría no fue encontrada"
            });
        }

        res.status(200).json({
            mensaje: "La categoría fue eliminada"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al eliminar la categoría"
        });
    }
};

module.exports = {
    getById,
    getAll,
    create,
    update,
    disable
};