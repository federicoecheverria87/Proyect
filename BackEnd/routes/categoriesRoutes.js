const express = require("express");
const router = express.Router();

const categoriesController = require("../controllers/categoriesController");
const token = require("../middlewares/validateAuthentication");
const validator = require("../middlewares/validateCategory");


router.get("/", token.validateToken, categoriesController.getAll);
router.get("/:id", token.validateToken, validator.validateId, categoriesController.getById);
router.post("/", token.validateToken, token.validateAdmin, validator.validateName, categoriesController.create);
router.put("/:id", token.validateToken, token.validateAdmin, validator.validateId, validator.validateName, categoriesController.update);
router.delete("/:id", token.validateToken, token.validateAdmin, validator.validateId, categoriesController.disable);

module.exports = router;