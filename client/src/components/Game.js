import React, { useState } from "react";
import Board from "./Board";


function Game({ channel, setChannel }) {
  const [playersJoined, setPlayersJoined] = useState(
    channel.state.watcher_count === 2
  );
  const [result, setResult] = useState({ winner: "none", state: "none" });

  // if (result.state !== "none") {
  //   const endResult = result.state;
  //   try {
  //     console.log('RESULT FUNCTION EXECUTED')
  //     const body = {endResult};
  //     const response =  fetch(`http://localhost:3001/game/playertwo`, {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(body)
  //     });
  //     console.log(`Result state is ${result.state}`);
  //   } catch (err) {
  //     console.error(err.message);
  //     console.log('error in updating end result')
  //   }
    
  // }
 

  

  channel.on("user.watching.start", (event) => {
    setPlayersJoined(event.watcher_count === 2);
  });
  if (!playersJoined) {
    return <div> Waiting for other player to join...</div>;
  }
  return (
    <div className="gameContainer">
      <Board result={result} setResult={setResult} />
      
      <button
        onClick={async () => {
          await channel.stopWatching();
          setChannel(null);
        }}
      >
        {" "}
        Leave Game
      </button>
      {result.state === "won" && <div> {result.winner} Won The Game</div>}
      {result.state === "tie" && <div> Game Tied!</div>}
      
    </div>
  );
}

export default Game;
