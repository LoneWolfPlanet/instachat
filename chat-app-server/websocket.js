const WebSocket = require("ws");
const { verifyToken } = require("./authenticator/tokenizer");
const { addMessage } = require("./services/message-service");
const { getUserById } = require("./data-access/user-access");
const { format } = require("date-fns");

const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("New WebSocket connection established");

    // Handle incoming messages
    ws.on("message", async (message) => {
      try {
        const { token, userId, roomId, phrase, username , type } = JSON.parse(message);
        if (verifyToken(token)) {
          await addMessage(roomId, userId, phrase, username, type);
        }

        const user = await getUserById(userId);

        const currentDateTime = new Date();

        const response = {
          roomId: roomId,
          userId: userId,
          userName: type ==2?username:user.username,
          phrase: phrase,
          datetime: format(currentDateTime, "yyyy-MM-dd HH:mm:ss"),
        };
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(response));
          }
        });
      } catch (error) {
        const errorResponse = {
          error: error.message,
          status: 400,
        };
        ws.send(`Echo: ${errorResponse}`);
      }
    });

    // Handle WebSocket disconnection
    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });

    ws.on("error", () => {
      console.log("WebSocket error occured.");
    });
  });

  console.log("WebSocket server is set up");
};

module.exports = setupWebSocket;
