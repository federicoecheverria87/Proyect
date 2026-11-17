const db_connection = require("../config/connectionDB");

const getAll = async () =>{
    const [categories] = await db_connection.query(
        "SELECT id, name FROM categories WHERE status = 'Active' ORDER BY id DESC"
    );
    return categories;
}

const getById = async (id)=>{
    const [category] = await db_connection.execute(
        "SELECT id, name FROM categories WHERE status = 'Active' AND id = ?",
        [id]
    );
    return category;
};

const alreadyExists = async (name, excludeId = null) => {
    const [categories] = await db_connection.execute(
        "SELECT `Id` FROM `Categories` WHERE `Name` = ? AND `Status` = 'Active' AND (? IS NULL OR `Id` <> ?)",
        [name, excludeId, excludeId]
    );

    return categories.length > 0;
};

const create = async (category) => {
    const { name } = category;

    const [result] = await db_connection.execute(
        "INSERT INTO `Categories` (`Name`, `Status`) VALUES (?, 'Active')",
        [name]
    );

    return result;
};

const update = async (id, category) => {
    const { name } = category;

    const [result] = await db_connection.execute(
        "UPDATE categories SET name = ? WHERE id = ? AND status = 'Active'",
        [name, id]
    );
    return result.affectedRows;
};

const disable = async (id) => {
    const [result] = await db_connection.execute(
        "UPDATE categories SET status = 'Inactive' WHERE id = ? AND status = 'Active'",
        [id]
    );
    return result.affectedRows;
};

const getProductsInCategory = async (categoryId) => {
    const [products] = await db_connection.execute(
        "SELECT id FROM products WHERE id_category = ? AND status = 'Active'",
        [categoryId]
    );
    return products;
};

module.exports = {
    getAll,
    getById,
    alreadyExists,
    create,
    update,
    disable,
    getProductsInCategory
}