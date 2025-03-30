const {
  addRoom: accessAddRoom,
  getRoomById: accessGetRoomById,
  getRoomByDescription: accessGetRoomByDescription,
  getRoomsByUserId:accessGetRoomsByUserId
} = require("../data-access/room-access");

const addRoom = async (description, userId) => {
    return await accessAddRoom(description, userId);
};

const getRoomById = async (roomId) => {
    return await accessGetRoomById(roomId);
};

const getRoomByDescription = async (description) => {
    return await accessGetRoomByDescription(description)
};

const getRoomsByUserId = async(userId) => {
  return await accessGetRoomsByUserId(userId);
};

module.exports = { addRoom,getRoomById,getRoomByDescription ,getRoomsByUserId };
