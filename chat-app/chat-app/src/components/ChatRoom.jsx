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
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CssBaseline from "@mui/material/CssBaseline";
import { connectWebSocket, sendMessage } from "../websocket/websocket";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

export default function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [rawMessages, setRawMessages] = useState([]);
  const [isFetchRawMessages, setIsFetchRawMessages ] = useState(false);
  const [message, setMessage] = useState("");
  const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL;
  const room = JSON.parse(sessionStorage.getItem("room"));
  const [chatRoomName, setChatRoomName] = useState(room.description);
  const [ipAddress, setIpAddress] = useState("");
  const navigate = useNavigate();
  const socket = connectWebSocket(websocketUrl);
  const API_ROOT = import.meta.env.VITE_API_ROOT;

  React.useEffect(() => {
    const fetchIPAddress = async () => {
      try {
        const response = await fetch("https://api64.ipify.org?format=json");
        const data = await response.json();
        setIpAddress(data.ip); // Extract and set the IP address
      } catch (error) {
        console.error("Failed to fetch IP address:", error);
      }
    };
    fetchIPAddress();
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const strRoom = sessionStorage.getItem("room");
        const room = JSON.parse(strRoom);
        const response = await fetch(
          `${API_ROOT}/chatgroup/messages?roomId=${room.roomid}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            mode: "cors",
          }
        );
        if (!response.ok) {
          console.log(response.status);
        }else{
          const result = await response.json();
          setRawMessages(result.messages);
          let parsedResults = [];
          for (let i = 0; i<result.messages.length; i++) { 
            parsedResults.push(formatMessage(result.messages[i]));
          }
          setMessages(parsedResults);
          setIsFetchRawMessages(true);
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (!isFetchRawMessages) {
      fetchData();
    }
  }, []);

  const comparePrevMessage = (currentMessage) => {
    const index = currentMessage.indexOf("(");
    const prevUserMessage = currentMessage.substring(0, index);
    const username = sessionStorage.getItem("username");
    if (username == prevUserMessage.trim()) return true;
    return false;
  };

  const formatMessage = (response) => {
    return `${response.chatbyname} (${response.createddate}):${response.phrase}`;
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
      ipAddress: ipAddress,
      type: sessionStorage.getItem("userType"),
    };
    sendMessage(JSON.stringify(data));
  };

  return (
    <React.Fragment>
      <CssBaseline enableColorScheme />
      <AppBar position="static" color="primary">
        <Toolbar>
          {/* Back button */}
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate("/home")}
          >
            <ArrowBackIcon /> {/* Back icon */}
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {chatRoomName}
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper
        elevation={3}
        sx={{
          padding: 2,
          width: "60vw", // Default width is 60% of the viewport width
          maxWidth: 800, // Add a maximum width for larger screens
          margin: "0 auto",
          "@media (max-width: 400px)": {
            width: "90vw", // Width changes to 90% of the viewport width for screens <= 400px
          },
        }}
      >
        <List
          sx={{
            height: "60vh",

            overflowY: "auto",
            border: "1px solid #ccc",
            borderRadius: 1,
            marginBottom: 2,
          }}
        >
          {messages.map((msg, index) => (
            <ListItem
              key={index}
              sx={{
                display: "flex",
                justifyContent: comparePrevMessage(msg)
                  ? "flex-start"
                  : "flex-end",
              }}
            >
              <Box
                sx={{
                  backgroundColor: comparePrevMessage(msg)
                    ? "success.main"
                    : "primary.main", // Use Material-UI's primary color
                  color: "white", // Font color
                  display: "inline-block", // Wrap only the content
                  padding: 1, // Padding around the text
                  borderRadius: 2, // Rounded bubble effect
                  maxWidth: "70%", // Limit the chat bubble's width
                  textAlign: "left", // Align text inside the bubble
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "12px",
                  }}
                >
                  {msg}
                </Typography>
              </Box>
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
