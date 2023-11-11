import React, { useEffect, useState,useRef } from "react";
import { useChannelStateContext, useChatContext } from "stream-chat-react";
import Square from "./Square";
import { Patterns } from "../WinningPatterns";
function Board({ result, setResult }) {
  const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
  const [player, setPlayer] = useState("X");
  const [turn, setTurn] = useState("X");

  const [pos, setPos] = useState("");

  const { channel } = useChannelStateContext();
  const { client } = useChatContext();
  const isFirstRender = useRef(true);
  const anotherIsFirstRender = useRef(true);

  useEffect(() => {
    window.alert(`Welcome to a new game of tictactoe! The first player to select 3 squares in a straight line wins.`);
  }, []);


  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }else{
    const symbol = turn === 'O' ? 'cross' : 'circle';
    const text = `A ${symbol} has been placed at ${pos}`
    channel.sendEvent({
      type: "message",
      data: { text },
    });
  }
  }, [pos]);

  
  useEffect(() => {
    checkIfTie();
    checkWin();
  }, [board]);

 

  useEffect(() => {
    if (anotherIsFirstRender.current) {
      anotherIsFirstRender.current = false;
      return;
    }
    else{
      if (result.winner==="none") {
        const endText="it's a tie!"
        channel.sendEvent({
          type: "endMessage",
          data: { endText },
        });
        
      }
      else{
   const endText=`${result.winner} Won The Game`
    channel.sendEvent({
      type: "endMessage",
      data: { endText },
    });
    }
  }}, [result]);

  





  //choosing square
  const chooseSquare = async (square) => {
    if (turn === player && board[square] === "") {
      setTurn(player === "X" ? "O" : "X");
      await channel.sendEvent({
        type: "game-move",
        data: { square, player },
      });
      
      setBoard(
        board.map((val, idx) => {
          if (idx === square && val === "") {
            return player;
          }
          return val;
        })
      );
      let row, column;

      if (square === 0) {
        row = 1;
        column = 1;
      } else if (square === 1) {
        row = 1;
        column = 2;
      } else if (square === 2) {
        row = 1;
        column = 3;
      } else if (square === 3) {
        row = 2;
        column = 1;
      } else if (square === 4) {
        row = 2;
        column = 2;
      } else if (square === 5) {
        row = 2;
        column = 3;
      } else if (square === 6) {
        row = 3;
        column = 1;
      } else if (square === 7) {
        row = 3;
        column = 2;
      } else if (square === 8) {
        row = 3;
        column = 3;
      }

        setPos(`Row ${row} Column ${column}`);
      }
    }
  

  const checkWin = () => {
    Patterns.forEach((currPattern) => {
      const firstPlayer = board[currPattern[0]];
      if (firstPlayer == "") return;
      let foundWinningPattern = true;
      currPattern.forEach((idx) => {
        if (board[idx] != firstPlayer) {
          foundWinningPattern = false;
        }
      });

      if (foundWinningPattern) {
        setResult({ winner: board[currPattern[0]], state: "won" });
        
    }})
  };

  const checkIfTie = () => {
    let filled = true;
    board.forEach((square) => {
      if (square == "") {
        filled = false;
      }
    });

    if (filled) {
      setResult({ winner: "none", state: "tie" });
      
    }
  };

  channel.on((event) => {
    if (event.type == "game-move" && event.user.id !== client.userID) {
      const currentPlayer = event.data.player === "X" ? "O" : "X";
      setPlayer(currentPlayer);
      setTurn(currentPlayer);
      setBoard(
        board.map((val, idx) => {
          if (idx === event.data.square && val === "") {
            return event.data.player;
          }
          return val;
        })
      );
    }
    if (event.type == "message" ){
      window.alert(event.data.text);
      
      channel.removeAllListeners();
    }

    if (event.type == "endMessage" ){
      window.alert(event.data.endText);
      channel.removeAllListeners();
    }
  });


  
  const checkEmptySquare = (squareValue) => {
    if (squareValue === "") {
      return "empty";
    } else {
      return squareValue;
    }
  };
    

  return (
    <div className="board" aria-label="tictactoe game" tabIndex="0">
      <div className="row">
        <Square 
          val={board[0]}
          chooseSquare={() => {
            chooseSquare(0);
          }}
          row = '1'
          column = '1'
        />
        <Square
          val={board[1]}
          chooseSquare={() => {
            chooseSquare(1);
          }}
          row = '1'
          column = '2'
        />
        <Square
          val={board[2]}
          chooseSquare={() => {
            chooseSquare(2);
          }}
          row = '1'
          column = '3'
        />
      </div>
      <div className="row">
        <Square
          val={board[3]}
          chooseSquare={() => {
            chooseSquare(3);
          }}
          row = '2'
          column = '1'
          
        />
        <Square
          val={board[4]}
          chooseSquare={() => {
            chooseSquare(4);
          }}
          row = '2'
          column = '2'
        />
        <Square
          val={board[5]}
          chooseSquare={() => {
            chooseSquare(5);
          }}
          row = '2'
          column = '3'
        />
      </div>
      <div className="row">
        <Square
          val={board[6]}
          chooseSquare={() => {
            chooseSquare(6);
          }}
          row = '3'
          column = '1'
        />
        <Square
          val={board[7]}
          chooseSquare={() => {
            chooseSquare(7);
          }}
          row = '3'
          column = '2'
        />
        <Square
          val={board[8]}
          chooseSquare={() => {
            chooseSquare(8);
          }}
          row = '3'
          column = '3'
        />
      </div>
    </div>
  );
}

export default Board;
