const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

const productsController = require("../controllers/productsController");
const token = require("../middlewares/validateAuthentication");
const validator = require("../middlewares/validateProduct");

router.get("/", token.validateToken, productsController.getAll);

router.get("/:id", token.validateToken, validator.validateId, productsController.getById);

router.post("/", token.validateToken, token.validateAdmin, upload.single("image"), validator.validateProduct, productsController.create);

router.put("/:id", token.validateToken, token.validateAdmin, upload.single("image"), validator.validateId, validator.validateProduct, productsController.update);

router.delete("/:id", token.validateToken, token.validateAdmin, validator.validateId, productsController.disable);

module.exports = router;