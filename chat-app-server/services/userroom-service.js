const {joinRoom: accessJoinRoom} = require("../data-access/userroom-access");
const {getRoomByDescription}= require("../data-access/room-access");

const validateRoom = async (description, roomPassPhrase) => {
    const room = await getRoomByDescription(description);
    if(room == null) throw new Error("Room does not exist");

    if(room.passpharse == roomPassPhrase)return room;

    return null;
};

const joinRoom = async(roomId, userId) =>{
    return await accessJoinRoom(roomId, userId);
};

const joinRoomAsGuest = async(roomId, username) =>{ //Placeholde for guest
   return;
};

module.exports = {joinRoom,validateRoom ,joinRoomAsGuest};