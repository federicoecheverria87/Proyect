const express = require('express');
const cors = require('cors');
const fs = require("fs");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const usersRoutes = require("./routes/usersRoutes");
const productsRoutes = require("./routes/productsRoutes");
const categoriesRoutes = require("./routes/categoriesRoutes");
const app = express();
const uploadsDirectory = path.join(__dirname, "uploads");
const legacyUploadsDirectory = path.join(__dirname, "../FrontEnd/Uploads");

fs.mkdirSync(uploadsDirectory, { recursive: true });

app.use(express.json());
app.use(cors());
app.use(
    "/uploads",
    express.static(uploadsDirectory),
    express.static(legacyUploadsDirectory)
);

// Rutas
app.use("/auth", authRoutes);
app.use("/products", productsRoutes);
app.use("/users", usersRoutes);
app.use("/categories", categoriesRoutes);

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});