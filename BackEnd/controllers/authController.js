const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                mensaje: "Email y contraseña son obligatorios"
            });
        }

        // Find by email and active = true
        const user = await userModel.findByEmail(email);

        if (!user) {
            return res.status(401).json({
                mensaje: "Credenciales incorrectas"
            });
        }

        // Validate password with bcrypt.compare
        const passwordMatch = await bcrypt.compare(
            String(password),
            user.Password
        );
        
        if (!passwordMatch) {
            return res.status(401).json({
                mensaje: "Credenciales incorrectas"
            });
        }

        //Build token
        const token = jwt.sign(
            {
                id: user.Id,
                role: user.Role
            },
            "secretKey", // Clave secreta para firmar el TOKEN
            {
                expiresIn: "1h"
            }
        );

        res.status(200).json({
            //devuelvo el token a login.jsx (frontend)
            mensaje: "Login successful",
            token,
            usuario: {
                id: user.Id,
                name: user.Name,
                email: user.Email,
                photo: user.Photo,
                role: user.Role
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error interno del servidor"
        });
    }
};

module.exports = {
    login
};