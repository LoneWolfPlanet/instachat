const WebSocket = require("ws");
const { verifyToken } = require("./authenticator/tokenizer");
const { addMessage } = require("./services/message-service");
const { getUserById } = require("./data-access/user-access");
const { format } = require("date-fns");
const Client = require("./models/client");

let clients = [];

const addClient = (client, roomId, ipAddress) => {
  let found = false;
  for (let i = 0; i < clients.length; i++) {
    if (clients[i].ipAddress == ipAddress) {
      //clients[i] = client;
      found = true;
      break;
    }
  }
  if (!found) {
    clients.push(new Client(client, roomId, ipAddress));
  }
};

const removeClient = (client) => {
  const updatedClients = clients.filter((c) => c != client);
  clients = updatedClients;
};

const broadCastToClients = (roomId, message) => {
  const receivers = clients.filter((c) => c.roomId == roomId);

  receivers.forEach((receiver) => {
    if (receiver.client.readyState === WebSocket.OPEN) {
      receiver.client.send(JSON.stringify(message));
    }
  });
};

const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("New WebSocket connection established");

    // Handle incoming messages
    ws.on("message", async (message) => {
      try {
        const { token, userId, roomId, phrase, username, type, ipAddress } =
          JSON.parse(message);
        if (verifyToken(token)) {
          await addMessage(roomId, userId, phrase, username, type);
        }

        addClient(ws, roomId, ipAddress);
        const currentDateTime = new Date();
        const response = {
          roomId: roomId,
          userId: userId,
          chatbyname: username,
          phrase: phrase,
          createddate: format(currentDateTime, "yyyy-MM-dd HH:mm:ss"),
        };

        broadCastToClients(roomId, response);
      } catch (error) {
        const errorResponse = {
          error: error.message,
          status: 400,
        };
        ws.send(`Echo: ${errorResponse}`);
      }
    });

    // Handle WebSocket disconnection
    ws.on("close", (req) => {
      console.log(req);
      removeClient(ws);
      console.log("WebSocket connection closed");
    });

    ws.on("error", () => {
      removeClient(ws);
      console.log("WebSocket error occured.");
    });
  });

  console.log("WebSocket server is set up");
};

module.exports = setupWebSocket;
