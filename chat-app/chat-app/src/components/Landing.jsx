import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FormControl from "@mui/material/FormControl";
import { useNavigate } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";

export default function Landing() {
  const API_ROOT = import.meta.env.VITE_API_ROOT;
  const navigate = useNavigate();
  const handlerOnCreate = async () => {
    navigate("/createroom");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const data = new FormData(event.currentTarget);
      const name = data.get("name");
      const description = data.get("description");
      const passphrase = data.get("passphrase");

      const response = await fetch(`${API_ROOT}/joinroom`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: name,
          description: description,
          roomPassPhrase:passphrase,
          type:2,
          userId:0
        }),
        mode: "cors",
      });

      if (response.ok) {
        const data = await response.json();
        const { token, status, username , room} = data;

        if (status == 200) {
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("username", username);
          sessionStorage.setItem("userType", 2);
          sessionStorage.setItem("room", JSON.stringify(room));

          navigate(`/chatroom/${description}/${passphrase}`);
        }
      } else {
        const results = await response.json();
        console.log(results);
      }
    } catch (err) {
      console.error("Error:", err);
    }

  };

  const validateInputs = () =>
  {
    return true;
  }

  return (
    <React.Fragment>
      <CssBaseline enableColorScheme />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <WhatsAppIcon style={{ fontSize: "50px" }} />
        <h1>InstaChat</h1>
      </div>
      <div>
        <p
          style={{
            minWidth: "300px",
            maxWidth: "600px",
            lineHeight: "1.6",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          Welcome to InstaChat – your gateway to seamless connections. Create or
          join chat rooms instantly and engage in real time. Start your
          conversation journey today!
        </p>
      </div>
      <div>
      <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop:5, fontSize:10 }}
          >
            <FormControl>
            <TextField size="small" placeholder="name" id="name" name="name"></TextField>
          </FormControl>
          <FormControl>
            <TextField size="small" placeholder="id" id="description" name="description"></TextField>
          </FormControl>
          <FormControl>
            <TextField size="small" placeholder="password" id="passphrase" name="passphrase"></TextField>
          </FormControl>
          <Button variant="contained" size="small" type="submit" onClick={validateInputs}> JOIN AS GUEST</Button>
        
        <Button variant="text" onClick={handlerOnCreate}>
          {" "}
          Create{" "}
        </Button>
        </Box>
      </div>
    </React.Fragment>
  );
}
