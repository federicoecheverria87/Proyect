const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "Tech_Store"
});

pool.getConnection().then((connection) => {
    console.log("Connected to database Tech_Store");
    connection.release();
}).catch((error) => {
    console.error("Error connecting to the database:", error);
});

module.exports = pool;