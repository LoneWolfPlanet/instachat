const {
  addUser,
  getUserByName,
  getUserById
} = require("./services/user-service");
const {
  encryptPassword,
  validatePassword,
} = require("./authenticator/encryptor");
const { generateToken ,authenticateToken } = require("./authenticator/tokenizer");
const { addRoom ,getRoomById,getRoomByDescription, getRoomsByUserId} = require("./services/room-service");
const {joinRoom,validateRoom, joinRoomAsGuest} = require("./services/userroom-service");
const express = require("express");
const setupWebSocket = require('./websocket'); 

const app = express();
const cors = require('cors');
const port = 3000;
const http = require('http');

app.use(express.json());
const chatroomRoutes = express.Router();

chatroomRoutes.post("/sign-in", async(req, res) => {
  try {
    const { username, password, id } = req.body;

    const user = await getUserByName(username);
    if(user == null) throw new Error("User does not exist");

    if (!(await validatePassword(password, user.password))){
        res.status(400).send({
            token: "",
            status: 400,
            message: "Authentication error. Please check your credentials.",
            user: null
          });
          return;
    }

    const token = generateToken(user);
    res.status(200).send({
      token: token,
      status: 200,
      message: "User authentication succesful.",
      user: user
    });
  } catch (error) {
    res.status(400).send({
      token: "",
      status: 400,
      message: error.message,
      user: null
    });
  }

});

chatroomRoutes.post("/sign-up", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await encryptPassword(password);
    const user = await addUser(username, email, hashedPassword);
    const token = generateToken(user);

    res.status(200).send({
      token,
      status: 200,
      message: "Successfully signed up.",
      user,
    });
  } catch (error) {
    res.status(400).send({
      token: "",
      status: 400,
      message: error.message,
      user: null,
    });
  }
});

chatroomRoutes.post("/createroom", authenticateToken, async(req, res) => {
    try{
        const{description, userId} = req.body;
        const currentRoom = await getRoomByDescription(description);
        if(currentRoom != null) throw new Error("Room already exist");

        const room = await addRoom(description, userId);
        await joinRoom(room.roomid, userId);

        res.status(200).send({
            message:"Succesfully created room.",
            status:200,
            room
        });
    }catch(error){
        res.status(400).send({
            message:error.message,
            status:400,
            room:null
        });
    }
});

chatroomRoutes.post("/joinroom", async(req, res) => {
  try{
        const{userId, username, description, roomPassPhrase, type}= req.body;
        const room = await validateRoom(description, roomPassPhrase);
        if(!room){
            res.status(400).send({
                message:"Failed to join room. Check your credentials.",
                status: 400,
                roomId:null
            });
            return;
        }
       
        if(type == 2){ //Join as guest
              await joinRoomAsGuest(room.roomid, username);
        }else{
          await joinRoom(room.roomid, userId);
        }

        const token = generateToken(username);
        res.status(200).send({
            message:"Successfully joined room.",
            status: 200,
            token:token,
            username:username,
            room:room
        });
  }catch(error){
    res.status(400).send({
        message:error.message,
        status: 400,
        roomId:null
    });
  }
});

chatroomRoutes.get("/chatgroups", authenticateToken, async(req, res) => {
  try{
      const userId = req.query.userId;
      const rooms = getRoomsByUserId(userId);

      res.status(200).send({
          status:200,
          rooms:rooms
      });

  }catch(error){
      res.status(400).send({
          message:error.message,
          status:400,
          rooms:null
      });
  }
});

// Enable CORS for all origins(For development purpose only. remove this on production)
app.use(cors());

// Attach the router to the "chatroom/v1" base path
app.use('/chatroom/v1', chatroomRoutes);

// Create an HTTP server instance
const server = http.createServer(app);
setupWebSocket(server);

// Start the server
server.listen(port, () => {
  console.log(`Web service running at http://localhost:${port}`);
});
