import * as React from "react";
import { TextField, Button, Stack } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import CssBaseline from "@mui/material/CssBaseline";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";

export default function CreateRoom() {
  const navigate = useNavigate();
  const API_ROOT = import.meta.env.VITE_API_ROOT;

  const validateInputs = () => {
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const data = new FormData(event.currentTarget);

      const description = data.get("description");
      const maxUsers = data.get("maxUsers");

      const response = await fetch(`${API_ROOT}/createroom`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          description: description,
          maxUsers: maxUsers,
          userId: sessionStorage.getItem("userId"),
        }),
        mode: "cors",
      });

      if (response.ok) {
        const data = await response.json();
        const { room, status } = data;

        if (status) {
          sessionStorage.setItem("room", JSON.stringify(room));
          navigate(`/chatroom/${room.description}/${room.passpharse}`);
        }
      } else {
        const results = await response.json();
        console.log(results);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <React.Fragment>
      <CssBaseline enableColorScheme />
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <p>Input necessary information below:</p>
        <Stack direction="column" spacing={2} sx={{ marginTop: 2 }}>
          <FormControl>
            <TextField
              size="small"
              variant="outlined"
              label="Chatroom name"
              name="description"
              id="description"
            />
          </FormControl>
          <FormControl>
            <TextField
              size="small"
              variant="outlined"
              label="maximum users"
              name="maxUsers"
              id="maxUsers"
            />
          </FormControl>
        </Stack>
        <Button
          type="submit"
          variant="contained"
          size="small"
          sx={{ minWidth: 200, marginTop: 2 }}
          onClick={validateInputs}
        >
          Proceed
        </Button>
      </Box>
    </React.Fragment>
  );
}
