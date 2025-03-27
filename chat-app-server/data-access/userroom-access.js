const pool = require('../db');

const joinRoom = async (roomId, userId) => {
    const result = await pool.query(
      'INSERT INTO userroom (roomid, userid) VALUES ($1, $2) RETURNING *',
      [roomId, userId]
    );
    return result.rows[0];
};

const getAllRoomUser = async(roomId) =>{
    const result = await pool.query('SELECT * FROM userroom where roomid = $1',[roomId]);
    return result.rows;
}

module.exports = { joinRoom ,getAllRoomUser};