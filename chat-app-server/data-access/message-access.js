const pool = require('../db');
const { getUserById } = require('./user-access');

const addMessage = async (roomId, userId, phrase) => {
    const user = await getUserById(userId);
    const result = await pool.query(
      'INSERT INTO message (roomid, chatbyid,chatbyname, phrase, usertype) VALUES ($1, $2 ,$3,$4, $5) RETURNING *',
      [roomId, userId,user.username, phrase, 1]
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

const getMessagesByRoomId =  async (roomId) => {
  const result = await pool.query('SELECT * FROM message WHERE roomid = $1', [roomId]);
  return result.rows;
};

module.exports = { addMessage,addMessageGuest ,getMessagesByRoomId };