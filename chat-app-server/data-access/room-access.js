const pool = require('../db');

const addRoom = async (description, userId) => {
    const result = await pool.query(
      'INSERT INTO room (description, createdby) VALUES ($1, $2) RETURNING *',
      [description, userId]
    );
    return result.rows[0];
};

const getRoomById = async (roomId) => {
    const result = await pool.query('SELECT * FROM room WHERE roomId = $1', [roomId]);
    return result.rows[0];
};

const getRoomByDescription = async (description) => {
    const result = await pool.query('SELECT * FROM room WHERE description = $1', [description]);
    return result.rows[0];
};

const getRoomsByUserId = async (userId) => {
    const result = await pool.query('SELECT * FROM room WHERE createdby = $1', [userId]);
    return result.rows;
};

module.exports = { addRoom, getRoomById, getRoomByDescription ,getRoomsByUserId };