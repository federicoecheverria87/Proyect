const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const token = require("../middlewares/validateAuthentication");
const usersController = require("../controllers/usersController");
const validate = require("../middlewares/validateUser");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });


router.post("/register", upload.single("photo"), validate.validateUser, usersController.register);
router.get("/my", token.validateToken, usersController.getMy);
router.put("/my", token.validateToken, upload.single("photo"), validate.validateUser, usersController.updateMy);

router.get("/", token.validateToken, token.validateAdmin, usersController.getAllActive);
router.get("/inactive", token.validateToken, token.validateAdmin, usersController.getAllInactive);
router.get("/:id", token.validateToken, token.validateAdmin, validate.validateId, usersController.getById);
//router.post("/", token.validateToken, token.validateAdmin, upload.single("photo"), validate.validateUser, validate.validateRole, usersController.create);
router.put("/:id", token.validateToken, token.validateAdmin, upload.single("photo"), validate.validateId, validate.validateUser, validate.validateRole, usersController.update);
router.delete("/:id", token.validateToken, token.validateAdmin, validate.validateId, usersController.disable);

module.exports = router;