const db_connection = require("../config/connectionDB");


//---------------------------GETS--------------------------
const getAllActive = async (excludedUserId) => {
    const [users] = await db_connection.execute(
        "SELECT id, name, email, photo, role, status FROM users WHERE Status = 'Active' AND id <> ?",
        [excludedUserId]
    );

    return users;
};

const getAllInactive = async () => {
    const [users] = await db_connection.execute(
        "SELECT id, name, email, photo, role, status FROM users WHERE Status = 'Inactive'"
    );

    return users;
};

const getById = async (id) => {
    const [users] = await db_connection.execute(
        "SELECT id, name, email, photo, role, status FROM users WHERE id = ? AND Status = 'Active'",
        [id]
    );

    return users[0];
};

// Find by email (used for login)
const findByEmail = async (email) => {
    const [users] = await db_connection.execute(
        "SELECT * FROM Users WHERE email = ? AND Status = 'Active'",
        [email]
    );

    return users[0];
};

// Create
const create = async (name, email, password, photo, role) => {

    const [result] = await db_connection.execute(
        `INSERT INTO Users (Name, Email, Password, Photo, Role, Status) VALUES (?, ?, ?, ?, ?, ?)`,
        [name, email, password, photo, role, 'Active']
    );

    return result.insertId;
};


// Update
const update = async (id, name, email, password, photo, role) => {
    await db_connection.execute(
        "UPDATE users SET name = ?, email = ?, password = COALESCE(?, password), photo = COALESCE(?, photo), role = COALESCE(?, role) WHERE id = ? AND Status = 'Active'",
        [name, email, password, photo, role, id]
    );
};


// Delete (soft delete)
const disable = async (id) => {
    await db_connection.execute(
        "UPDATE Users SET Status = 'Inactive' WHERE id = ?",
        [id]
    );
};




module.exports = {
    getAllActive,
    getAllInactive,
    getById,
    findByEmail,
    create,
    update,
    disable,
};