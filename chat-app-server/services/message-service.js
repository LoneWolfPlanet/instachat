const {
  addMessage: accessAddMessage,
  addMessageGuest: accessAddMessageGuest,
  getMessagesByRoomId:accessGetMessagesByRoomId,
} = require("../data-access/message-access");

const addMessage = async (roomId, userId, phrase, username, type) => {
  if (type == 1) {
    return await accessAddMessage(roomId, userId, phrase);
  } else {
    return await accessAddMessageGuest(roomId, username, phrase);
  }
};

const getMessagesByRoomId = async(roomId) =>
{
   return await accessGetMessagesByRoomId(roomId);
}

module.exports = { addMessage ,getMessagesByRoomId};
