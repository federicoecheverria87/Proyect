const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {

    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({
            mensaje: "Token no enviado"
        });
    }

    const token = authorization.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            mensaje: "Token inválido"
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            "secretKey"
        );

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            mensaje: "Token inválido o vencido"
        });
    }
};

const validateAdmin = (req, res, next) => {
    if (req.user.role?.toLowerCase() !== "admin") {

        return res.status(403).json({
            mensaje: "No tiene permisos para realizar esta acción"
        });

    }

    next();
};

module.exports = {  
    validateToken,
    validateAdmin,
 } ;