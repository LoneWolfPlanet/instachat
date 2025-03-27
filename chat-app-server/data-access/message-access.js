const pool = require('../db');

const addMessage = async (roomId, userId, phrase) => {
    const result = await pool.query(
      'INSERT INTO message (roomid, chatby, phrase) VALUES ($1, $2 ,$3) RETURNING *',
      [roomId, userId, phrase]
    );
    return result.rows[0];
};

const addMessageGuest = async (roomId, username, phrase) => {
  const result = await pool.query(
    'INSERT INTO message (roomid, chatbyname, phrase) VALUES ($1, $2 ,$3) RETURNING *',
    [roomId, username, phrase]
  );
  return result.rows[0];
};

module.exports = { addMessage,addMessageGuest };