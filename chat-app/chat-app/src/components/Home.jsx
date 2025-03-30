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

const testData = [
    {
        description: "Family-Picnic",
        messages: [
          "Ali (2024-10-11): Hello Guys...",
          "Ali (2024-10-11): Hello Guys...",
        ],
      },
      {
        description: "Project-101",
        messages: [
          "Bane (2024-10-11): Will start to work on...",
          "Bane (2024-10-11): Will start to work on",
        ],
      },
      {
        description: "Reunion-2025",
        messages: [
          "Ado (2024-10-11): Booking a function room for...",
          "Ado (2024-10-11): Booking a function room for...",
        ],
      },
];

export default function Home() {
  const [chatGroups, setChatGroups] = React.useState([]);
  const navigate = useNavigate();
  const onClickCreateRoomHandler = () => {
    navigate("/createroom");
  };

  return (
    <Stack direction="column" spacing={2}>
      <div></div>
      <Paper
        elevation={1}
        sx={{
          width: "100%",
          maxWidth: 500,
          bgcolor: "background.paper",
          padding: 2,
          minHeight:300,
          minWidth:300
        }}
      >
        <List>
          {testData.length == 0 ? (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ textAlign: "center", mt: 2 }}
            >
              No chat group yet.
            </Typography>
          ) : (
            testData.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem
                  alignItems="flex-start"
                  button // Make the ListItem clickable
                  sx={{ cursor: "pointer" }} // Optional styling for hover effect
                >
                  <ListItemText
                    primary={
                      <Typography
                        component="span"
                        sx={{ fontWeight: "bold", fontSize: "16px" }} // Bold and larger primary text
                      >
                        {item.description}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        component="span"
                        variant="body2" // Smaller text for secondary
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
                {index < testData.length - 1 && <Divider />} {/* Add Divider */}
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
  );
}
