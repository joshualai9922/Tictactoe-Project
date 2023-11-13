import React, { useEffect, useState,useRef } from "react";
import { useChannelStateContext, useChatContext } from "stream-chat-react";
import Square from "./Square";
import { Patterns } from "../WinningPatterns";
import Cookies from "universal-cookie";
import cookies from "./SignUp";

function Board({ result, setResult }) {
  const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
  const [player, setPlayer] = useState("X");
  const [turn, setTurn] = useState("X");
  const [pos, setPos] = useState("");
  const [moveNumber, setMoveNumber] = useState(1);
  const [squareNumber, setSquareNumber] = useState("");
  const [gameID, setGameID] = useState(null);

  const { channel } = useChannelStateContext();
  const { client } = useChatContext();
  const isFirstRender = useRef(true);
  const anotherIsFirstRender = useRef(true);
  const isEnd =useRef(false)

  /////to get cookie by name
  function getCookieValue(cookieName) {
    const cookies = document.cookie.split(";").map(cookie => cookie.trim().split("="));
    for (const [name, value] of cookies) {
      if (name === cookieName) {
        return value;
      }
    }
    return null; // Return null if the cookie is not found
  }

//alert for welcome msg
  useEffect(() => {
    window.alert(`Welcome to a new game of tictactoe! The first player to select 3 squares in a straight line wins.`);
    
    
    
  }, []);

//alert for move
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

  
  //check every turn whether got win/tie
  useEffect(() => {
    checkIfTie();
    checkWin();
  }, [pos]);

 
// if got change in result, announce winner
  // useEffect(() => {
  //   if (anotherIsFirstRender.current) {
  //     anotherIsFirstRender.current = false;
  //     return;
  //   }
  //   else{
  //     if (result.winner==="none") {
  //       const endText="it's a tie!"
  //       channel.sendEvent({
  //         type: "endMessage",
  //         data: { endText },
  //       });
        
  //     }
  //     else{
  //  const endText=`${result.winner} Won The Game`
  //   channel.sendEvent({
  //     type: "endMessage",
  //     data: { endText },
  //   });
  //   }
  // }}, [result]);

  function fetchAndCheckResult() {
    return fetch("http://localhost:3001/game")
      .then(response => response.json())
      .then(data => {
        return data.result === null;
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        // You might want to handle the error here or rethrow it
        throw error;
      });
  }

  function fetchAndCheckName2() {
    return fetch("http://localhost:3001/game")
      .then(response => response.json())
      .then(data => {
        return data.name2 === null;
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        // You might want to handle the error here or rethrow it
        throw error;
      });
  }





  //function for user choose square
  const chooseSquare = async (square) => {
    if (!isEnd.current){
      
    if (turn === player && board[square] === "") {
      setTurn(player === "X" ? "O" : "X");
      await channel.sendEvent({
        type: "game-move",
        data: { square, player },
      });

      const latestNoResult = await fetchAndCheckResult();
      const latestNoName2 = await fetchAndCheckName2();
      //if first move made, store the player1 name and update state for gameID
      if (!latestNoResult) { //got results
        const name = getCookieValue("firstName");
        try {
          console.log('FIRST TRY BLOCK OF CHOOSE SQ EXECTUTED')
          const body = {name };
          const response = await fetch("http://localhost:3001/game", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
          });
          
          
        } catch (err) {
          console.error(err.message);
         
        }
      }
      else if (latestNoName2){
          const name = getCookieValue("firstName");
        try {
          console.log('SECOND TRY BLOCK OF CHOOSE SQ EXECTUTED')
          const body = {name};
          const response = await fetch(`http://localhost:3001/game/playertwo`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
          });
          
        } catch (err) {
          console.error(err.message);
          console.log('error at the second try block in client')
        }
      }
      else {
        
      try {
        console.log('THIRD TRY BLOCK OF CHOOSE SQ EXECTUTED')
        const response = await fetch(`http://localhost:3001/game/incrementCount`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        });
        
      } catch (err) {
        console.error(err.message);
        console.log('error at the third try block in client')
      }
    }
        
        
  
  
          
      // else if (moveNumber===2){
      //   const name = getCookieValue("firstName");
      //   try {
      //     const body = {name};
      //     const response = await fetch(`http://localhost:3001/game/playertwo/${gameID}`, {
      //       method: "PUT",
      //       headers: { "Content-Type": "application/json" },
      //       body: JSON.stringify(body)
      //     });
      //    const heree = await response.json();
      //    console.log(heree);
          
      //   } catch (err) {
      //     console.error(err.message);
      //   }

      // }


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//everytime a square is clicked(all the time here), put sq number into server

      
        
        
        // try {
        //   const body = {name}
        //   const response = await fetch("http://localhost:3001/game", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify(body)
        //   });
        //   const resGameID= await response.json();
        //   setGameID(resGameID);
        // } catch (err) {
        //   console.error(err.message);
        // }
        // // setMoveNumber(2) ++


      







      //update the moves every time
        
      //if moveNumber==1 
      //post new game [name1,name2].   name1 is the player who made the move

      //put  [moveNumber,squareNumber] to backend
      // moveNumber ++


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
    }}
  
//function to check win
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
        if (!isEnd.current){
        setResult({ winner: board[currPattern[0]], state: "won" });
        isEnd.current = true;
        try {
          const endResult = "win"
          console.log('RESULT FUNCTION EXECUTED')
          const body = {endResult};
          const response =  fetch(`http://localhost:3001/game/endResult`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
          });
          const endText = `${board[currPattern[0]]} has won`
          channel.sendEvent({
            type: "endMessage",
            data: { endText },
          });

        } catch (err) {
          console.error(err.message);
          console.log('error in updating end result')
        }
        }
    }})
  };

//function to check tie
  const checkIfTie = () => {
    if (!isEnd.current){
    let filled = true;
    board.forEach((square) => {
      if (square == "") {
        filled = false;
      }
    });

    if (filled) {
      setResult({ winner: "none", state: "tie" })
      isEnd.current = true;
        try {
          const endResult = "tie"
          console.log('RESULT FUNCTION EXECUTED')
          const body = {endResult};
          const response =  fetch(`http://localhost:3001/game/endResult`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
          });
          console.log(`Result state is ${result.state}`);
        } catch (err) {
          console.error(err.message);
          console.log('error in updating end result')
        };
        const endText = "It's a tie!"
        channel.sendEvent({
          type: "endMessage",
          data: { endText },
        });
      
    }
  }
  };

//handle channel events
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