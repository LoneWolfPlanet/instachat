import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { Button, Divider, Fab, Stack } from "@mui/material";
import Paper from "@mui/material/Paper";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import CssBaseline from "@mui/material/CssBaseline";

export default function Home() {
  const [chatGroups, setChatGroups] = React.useState([]);
  const [rawData, setRawData] = React.useState([]);
  const navigate = useNavigate();
  const API_ROOT = import.meta.env.VITE_API_ROOT;
  const onClickCreateRoomHandler = () => {
    navigate("/createroom");
  };


  const onClickChatGroupHandler = (index) =>{
    const room = rawData[index];
    sessionStorage.setItem("room", JSON.stringify(room));
    sessionStorage.setItem("userType", 1);
    navigate(`/chatroom/${room.description}/${room.roomPassPhrase}`);
  }

  const parseChatGroupResponse = (data) => {
    let results = [];
    for (let i = 0; i < data.rooms.length; i++) {
      const room = data.rooms[i];
      const result = {
        roomId: room.roomid,
        description: room.description,
        messages: "",
      };
      results.push(result);
    }
    return results;
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = sessionStorage.getItem("userId");
        const response = await fetch(
          `${API_ROOT}/chatgroups?userId=${userId}`,
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
        }
        const result = await response.json();
        const data = parseChatGroupResponse(result);
        setChatGroups(data);
        setRawData(result.rooms);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return (
      <React.Fragment>
        <CssBaseline enableColorScheme />
    <Stack direction="column" spacing={2}>
      <div></div>
      <Paper
        elevation={1}
        sx={{
          width: "50vw",
          bgcolor: "background.paper",
          padding: 2,
          height: "60vh",
        }}
      >
        <List
          sx={{
            height: "55vh",
            overflowY: "auto",
            padding:2
          }}
        >
          {chatGroups.length == 0 ? (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                textAlign: "center",
                mt: 2,
              }}
            >
              No chat group yet.
            </Typography>
          ) : (
            chatGroups.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem
                  alignItems="flex-start"
                  button
                  sx={{ cursor: "pointer" }}
                  onClick={() => onClickChatGroupHandler(index)}
                  key ={index}
                >
                  <ListItemText
                    primary={
                      <Typography
                        component="span"
                        sx={{ fontWeight: "bold", fontSize: "16px" }} 
                      >
                        {item.description}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{ color: "text.secondary", display: "block" }}
                      >
                        {item.messages[0]}
                      </Typography>
                    }
                  />
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
                {index < chatGroups.length - 1 && <Divider />}{" "}
                {/* Add Divider */}
              </React.Fragment>
            ))
          )}
        </List>
      </Paper>
      <Tooltip title="Create room" arrow>
        <Fab
          color="primary"
          aria-label="add"
          onClick={onClickCreateRoomHandler}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
    </Stack>
    </React.Fragment>
  );
}
