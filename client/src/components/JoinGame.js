import React, { Fragment, useState, useEffect } from "react";
import { useChatContext, Channel } from "stream-chat-react";
import Game from "./Game";
import CustomInput from "./CustomInput";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { sizing } from "@mui/system";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import yourImage from "../pic.jpg";

function JoinGame() {
  const [rivalUsername, setRivalUsername] = useState("");
  const { client } = useChatContext();
  const [channel, setChannel] = useState(null);
  const createChannel = async () => {
    const response = await client.queryUsers({ name: { $eq: rivalUsername } });

    if (response.users.length === 0) {
      alert("User not found");
      return;
    }

    const newChannel = await client.channel("messaging", {
      members: [client.userID, response.users[0].id],
    });

    await newChannel.watch();
    setChannel(newChannel);
  };

  ////////////////GAME HISTORY//////////////

  /////to get cookie by name
  function getCookieValue(cookieName) {
    const cookies = document.cookie
      .split(";")
      .map((cookie) => cookie.trim().split("="));
    for (const [name, value] of cookies) {
      if (name === cookieName) {
        return value;
      }
    }
    return null; // Return null if the cookie is not found
  }

  const userName = getCookieValue("firstName");

  const [gameHistory, setGameHistory] = useState([]);
  const getHistory = async () => {
    try {
      const response = await fetch("http://localhost:3001/gameHistory");
      const jsonData = await response.json();
      console.log("GET GAME HISTORY EXECUTED");
      setGameHistory(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getHistory();
  }, []);

  //DATA LOGIC//

  // Filter games where userName is in either name1 or name2
  const filteredGames = gameHistory.filter(
    (history) => history.name1 === userName || history.name2 === userName
  );

  // Modify the result based on the conditions
  const modifiedGames = filteredGames.map((history) => {
    let opponentName =
      history.name1 === userName ? history.name2 : history.name1;

    if (history.result === "tie") {
      return {
        ...history,
        result: "tie",
        name: opponentName,
      };
    } else if (history.result === "win") {
      const isOddCount = history.count % 2 !== 0;
      const isUserWinner =
        (history.name1 === userName && isOddCount) ||
        (history.name2 === userName && !isOddCount);

      return {
        ...history,
        result: isUserWinner ? "win" : "lose",
        name: opponentName,
      };
    } else {
      // Handle other cases if needed
      return history;
    }
  });

  //////for the table/////
  const columns = [
    { id: "player", label: "Name", minWidth: 170 },

    {
      id: "result",
      label: "Result",
      minWidth: "50%",
      align: "middle",
      format: (value) => value.toFixed(2),
    },
  ];

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const rows = modifiedGames.map((history) => {
    return {
      player: history.name,
      result: history.result,
    };
  });

  console.log(`rows: ${rows}`);

  return (
    <>
      {channel ? (
        <Channel channel={channel} Input={CustomInput}>
          <Game channel={channel} setChannel={setChannel} />
        </Channel>
      ) : (
        <div className="joinGame">
          <div>
            <img
              role="presentation"
              src={yourImage}
              alt="tictactoe"
              style={{
                position: "absolute",
                top: "2%",
                left: "42%",
                width: "230px", // Adjust the width as needed
                height: "auto",
              }}
            />
            <TextField
              inputProps={{
                "aria-label": "input the username of your opponent",
              }}
              style={{
                position: "absolute",
                top: "31%",
                left: "47%",
                transform: "translate(-50%, -50%)",
                width: "400px", // Adjust the left position as needed
              }}
              id="outlined-basic"
              label="Username of opponent"
              variant="outlined"
              onChange={(event) => {
                setRivalUsername(event.target.value);
              }}
            />
            <Button
              style={{
                maxWidth: "57px",
                maxHeight: "56px",
                minWidth: "120px",
                minHeight: "56px",
                position: "absolute",
                top: "31%",
                left: "65%",
                transform: "translate(-50%, -50%)",
              }}
              variant="contained"
              onClick={createChannel}
            >
              {" "}
              Join Game
            </Button>{" "}
          </div>
          <div>
            <Fragment>
              {" "}
              <div
                style={{
                  position: "absolute",
                  top: "67%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <Paper sx={{ width: "100%", overflow: "hidden" }}>
                  <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                      <caption>
                        This is a table containing information about your
                        previous game results. The first column will be the
                        player name, and the second column will be the game
                        result. Each row represents a game.
                      </caption>
                      <TableHead>
                        <TableRow>
                          {columns.map((column) => (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              style={{ minWidth: column.minWidth }}
                              id={column.id + "-header"}
                              scope="col"
                            >
                              {column.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((row) => {
                            return (
                              <TableRow
                                hover
                                key={row.code}
                                tabIndex={-1}
                                role="row"
                              >
                                {columns.map((column) => {
                                  const value = row[column.id];
                                  return (
                                    <TableCell
                                      key={column.id}
                                      align={column.align}
                                      scope="row"
                                      role="cell"
                                    >
                                      {column.format &&
                                      typeof value === "number"
                                        ? column.format(value)
                                        : value}
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Paper>
              </div>
            </Fragment>
          </div>
        </div>
      )}
    </>
  );
}

export default JoinGame;
