const pool = require('../db');

// Get all users
const getUsers = async () => {
  const result = await pool.query('SELECT * FROM "user"');
  return result.rows;
};

// Get a user by ID
const getUserById = async (id) => {
  const result = await pool.query('SELECT * FROM "user" WHERE userid = $1', [id]);
  return result.rows[0];
};

// Get a user by ID
const getUserByName = async (username) => {
  const result = await pool.query('SELECT * FROM "user" WHERE username = $1', [username]);
  return result.rows[0];
};

// Add a new user
const addUser = async (username, email, password) => {
    const result = await pool.query(
      'INSERT INTO "user" (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, password]
    );
    return result.rows[0];
};

// Update a user
const updateUser = async (id, type, username, email, password, status) => {
  const result = await pool.query(
    `UPDATE "user" 
     SET type = $1, username = $2, email = $3, password = $4, status = $5 
     WHERE userid = $6 RETURNING *`,
    [type, username, email, password, status, id]
  );
  return result.rows[0];
};

// Delete a user
const deleteUser = async (id) => {
  const result = await pool.query('DELETE FROM "user" WHERE userid = $1 RETURNING *', [id]);
  return result.rows[0];
};

module.exports = { getUsers, getUserById, addUser, updateUser, deleteUser ,getUserByName };
