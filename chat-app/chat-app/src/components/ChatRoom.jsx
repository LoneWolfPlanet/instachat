import React, { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CssBaseline from "@mui/material/CssBaseline";
import { connectWebSocket, sendMessage } from "../websocket/websocket";

export default function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [rawMessages, setRawMessages] = useState([]);
  const [message, setMessage] = useState("");
  const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL;

  const socket = connectWebSocket(websocketUrl);

  const formatMessage = (response) => {
    return `${response.userName} (${response.datetime}):${response.phrase}`;
  };

  if (socket) {
    socket.onmessage = (event) => {
      try {
        console.log("Message received:", event.data);
        const response = JSON.parse(event.data);
        const chatPhrase = formatMessage(response);
        setRawMessages((prevRawMessages) => [...prevRawMessages, response]);
        setMessages((prevMessages) => [...prevMessages, chatPhrase]);
      } catch (error) {
        console.log(error.message);
      }
    };
  }

  const handleSendMessage = () => {
    const strRoom = sessionStorage.getItem("room");
    const room = JSON.parse(strRoom);
    const data = {
      token: sessionStorage.getItem("token"),
      userId: sessionStorage.getItem("userId"),
      username: sessionStorage.getItem("username"),
      phrase: message,
      roomId: room.roomid,
      type: sessionStorage.getItem("userType"),
    };
    sendMessage(JSON.stringify(data));
  };

  return (
    <React.Fragment>
      <CssBaseline enableColorScheme />
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <WhatsAppIcon style={{ fontSize: "50px" }} />
        <h1>InstaChat</h1>
      </div>

      <Paper elevation={3} sx={{ padding: 2, maxWidth: 800, margin: "0 auto" }}>
        <Typography variant="h5" sx={{ textAlign: "center", marginBottom: 2 }}>
          Chat Room Name
        </Typography>

        <List
          sx={{
            maxHeight: 400,
            minHeight: 200,
            overflowY: "auto",
            border: "1px solid #ccc",
            borderRadius: 1,
            marginBottom: 2,
            maxWidth: 700
          }}
        >
          {messages.map((msg, index) => (
            <ListItem key={index} sx={{ justifyContent: index % 2 === 0 ? "flex-start" : "flex-end" }}>
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ fontSize: "12px" }}>
                    {msg}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>

        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            variant="outlined"
            size="small"
            fullWidth
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
            size="small"
            sx={{
              outline: "none",
              "&:focus": {
                outline: "none",
                boxShadow: "none",
              },
            }}
          >
            <SendIcon />
          </Button>
        </Box>
      </Paper>
    </React.Fragment>
  );
}
