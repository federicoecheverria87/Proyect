const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");


// GET - GET USERS
// =========================
const getAllActive = async (req, res) => {
    try {
        const users = await userModel.getAllActive(req.user.id);

        res.status(200).json(users);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al obtener los usuarios"
        });
    }
};

const getAllInactive = async (req, res) => {
    try {
        const users = await userModel.getAllInactive();

        res.status(200).json(users);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al obtener los usuarios"
        });
    }
};

const getById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await userModel.getById(id);

        if (!user) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }

        res.status(200).json(user);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al obtener el usuario"
        });
    }
};

const getMy = async (req, res) => {
    try {
        const user = await userModel.getById(req.user.id);

        if (!user) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al obtener el perfil"
        });
    }
};


// POST - CREATE USER (admin)
// =========================
const create = async (req, res) => {

    const { name, email, password, role } = req.body;
    const photo = req.file ? req.file.filename : null;

    let selectedRole = role == "Admin" ? role : "User";

    try {

        if (!name || !email || !password || !selectedRole) {
            return res.status(400).json({
                mensaje: "Todos los campos son obligatorios"
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const id = await userModel.create(
            name,
            email,
            passwordHash,
            photo,
            selectedRole
        );

        res.status(201).json({
            mensaje: "Usuario creado correctamente",
            id
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al crear el usuario"
        });
    }
};


// DELETE (LOGIC)
// =========================
const disable = async(req, res) => {

    try {
        const { id } = req.params;

        await userModel.disable(id);

        res.status(200).json({
            mensaje: "Usuario eliminado correctamente"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al eliminar el usuario"
        });
    }
};


// PUT - UPDATE USER
// =========================
const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, role } = req.body;
        const photo = req.file ? req.file.filename : null;

        // Validate ID
        if (!id || isNaN(id)) {
            return res.status(400).json({
                error: "Id not valid"
            });
        }

        if (!name || !email || (!req.isSelfUpdate && !role)) {
            return res.status(400).json({
                mensaje: "Nombre, email y rol son obligatorios"
            });
        }

        const passwordHash = password ? await bcrypt.hash(password, 10) : null;

        await userModel.update(
            id,
            name,
            email,
            passwordHash,
            photo,
            req.isSelfUpdate ? null : role || null
        );

        const response = {
            mensaje: "Usuario modificado correctamente"
        };
        if (req.isSelfUpdate) {
            response.usuario = await userModel.getById(id);
        }

        res.status(200).json(response);

    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                codigo: "EMAIL_ALREADY_EXISTS",
                mensaje: "Ese correo electrónico ya está registrado. Elegí otro para este usuario."
            });
        }

        console.error(error);

        res.status(500).json({
            mensaje: "Error al modificar el usuario"
        });
    }
};

// POST - REGISTER USER (public)
// =========================
const register = async (req, res) => {
    req.body.role = "User";
    return create(req, res);
}

// PUT - UPDATE MY USER
// =========================
const updateMy = async (req, res) => {
    const id = req.user.id;
    req.params.id = id;
    req.isSelfUpdate = true;
    return update(req, res);
};

module.exports = {
    register,
    getMy,
    updateMy,
    getAllActive,
    getAllInactive,
    getById,
    create,
    update,
    disable
};