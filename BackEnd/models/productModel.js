const db_connection = require("../config/connectionDB");

const getAll = async () =>{
    const [products] = await db_connection.query(
        "SELECT id, name, description, price, image, stock, id_category as categoryId FROM products WHERE status = 'Active' ORDER BY 1 DESC"
    );
    return products;
};

const getById = async (id)=>{
    const [product] = await db_connection.execute(
        `SELECT 
            id, 
            name, 
            description,
            price,
            image,
            stock,
            id_category AS categoryId
        FROM products
        WHERE status = 'Active' AND id = ?
    `,
        [id]
    );

    return product[0];
};

const alreadyExists = async (name, categoryId, excludeId = null) => {
    const query = excludeId === null
        ? "SELECT id FROM products WHERE name = ? AND id_category = ? AND status = 'Active'"
        : "SELECT id FROM products WHERE name = ? AND id_category = ? AND status = 'Active' AND id <> ?";
    const params = excludeId === null ? [name, categoryId] : [name, categoryId, excludeId];
    const [products] = await db_connection.execute(query, params);

    return products.length > 0;
}

const create = async (producto) => {

    const { name, description, image, price, stock, categoryId } = producto;

    const [result] = await db_connection.execute(

        `INSERT INTO products(name, description, image, price, stock, id_category, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,

        [name, description, image, price, stock, categoryId, 'Active']

    );

    return {

        id: result.insertId,
        name,
        description,
        image,
        price,
        stock,
        categoryId

    };

};

const update = async(id, producto)=>{
    const { name, description, price, image, stock, categoryId } = producto;
    const [result] = await db_connection.execute(
        `UPDATE products 
        SET name = ?, description = ?, price = ?, image = ?, stock = ?, id_category = ?
        WHERE id =?`, [name, description, price, image, stock, categoryId, id]
    );
    return result.affectedRows;
};

//Delete    
const disable = async(id)=>{
    const [result] = await db_connection.execute(
        "UPDATE products SET status = 'Inactive' WHERE id =?",
        [id]
    );
    return result.affectedRows;
};

module.exports = {
    getAll,
    getById,
    alreadyExists,
    create,
    update,
    disable
}