import React, { useState } from "react";
import Board from "./Board";
import Button from "@mui/material/Button";
import { styled } from "@mui/system";

function Game({ channel, setChannel }) {
  const [playersJoined, setPlayersJoined] = useState(
    channel.state.watcher_count === 2
  );
  const [result, setResult] = useState({ winner: "none", state: "none" });
  const Container = styled("div")({
    width: "500px",
    height: "500px",
    backgroundColor: (theme) => theme.palette.background.default,
    border: (theme) => `1px solid ${theme.palette.background.paper}`,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  });

  channel.on("user.watching.start", (event) => {
    setPlayersJoined(event.watcher_count === 2);
  });
  if (!playersJoined) {
    return <Container>Waiting for other player to join...</Container>;
  }
  return (
    <div className="gameContainer">
      <Board result={result} setResult={setResult} />

      <Button
        onClick={async () => {
          await channel.stopWatching();
          setChannel(null);
        }}
        variant="contained"
        style={{
          maxWidth: "57px",
          height: "60px",
          minWidth: "120px",
          position: "absolute",
          top: "84%",
          left: "64%",
          transform: "translate(-50%, -50%)",
        }}
      >
        Leave Game
      </Button>

      {result.state === "won" && <div> {result.winner} Won The Game</div>}
      {result.state === "tie" && <div> Game Tied!</div>}
    </div>
  );
}

export default Game;
