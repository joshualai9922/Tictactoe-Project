import "./App.css";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import Cookies from "universal-cookie";
import { useState } from "react";
import JoinGame from "./components/JoinGame";
import "./App.css";
import Button from "@mui/material/Button";

function App() {
  const api_key = REACT_APP_api_key;
  const cookies = new Cookies();
  const token = cookies.get("token");
  const client = StreamChat.getInstance(api_key);
  const [isAuth, setIsAuth] = useState(false);
  const [gotAcc, setGotAcc] = useState(false);

  const logOut = () => {
    cookies.remove("token");
    cookies.remove("userId");
    cookies.remove("firstName");
    cookies.remove("lastName");
    cookies.remove("hashedPassword");
    cookies.remove("channelName");
    cookies.remove("username");
    client.disconnectUser();
    setIsAuth(false);
  };

  if (token && client.user === undefined) {
    client
      .connectUser(
        {
          id: cookies.get("userId"),
          name: cookies.get("username"),
          firstName: cookies.get("firstName"),
          lastName: cookies.get("lastName"),
          hashedPassword: cookies.get("hashedPassword"),
        },
        token
      )
      .then((user) => {
        setIsAuth(true);
      });
  }
  return (
    <div className="App">
      {isAuth ? (
        <Chat client={client}>
          <JoinGame />
          <Button
            variant="outlined"
            color="error"
            className="logoutButton"
            onClick={logOut}
          >
            {" "}
            Logout
          </Button>
        </Chat>
      ) : gotAcc ? (
        <Login setIsAuth={setIsAuth} setGotAcc={setGotAcc} />
      ) : (
        <SignUp setIsAuth={setIsAuth} setGotAcc={setGotAcc} />
      )}
    </div>
  );
}

export default App;
