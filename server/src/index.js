import express from "express";
import cors from "cors";
import { StreamChat } from "stream-chat";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import pool from "./db.js";

const app = express();

app.use(cors());
app.use(express.json());
const api_key = "najz5nb7sgzt";
const api_secret =
  "pup8x6n984h4va9guk4bftvhyp479ajdrxqeayxfp8ggar9fwaebr99j87rhhwgw";
const serverClient = StreamChat.getInstance(api_key, api_secret);

// ROUTES //

//AUTHENTICATION
app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, username, password } = req.body;
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = serverClient.createToken(userId);
    res.json({ token, userId, firstName, lastName, username, hashedPassword });
  } catch (error) {
    res.json(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const { users } = await serverClient.queryUsers({ name: username });
    if (users.length === 0) return res.json({ message: "User not found" });

    const token = serverClient.createToken(users[0].id);
    const passwordMatch = await bcrypt.compare(
      password,
      users[0].hashedPassword
    );

    if (passwordMatch) {
      res.json({
        token,
        firstName: users[0].firstName,
        lastName: users[0].lastName,
        username,
        userId: users[0].id,
      });
    }
  } catch (error) {
    res.json(error);
  }
});

// POSTGRESQL DB ROUTES //

//At 1st move, create a game and input player 1 name and increment count

app.post("/game", async (req, res) => {
  try {
    const { name } = req.body;
    const count = 1; // Assuming you want to set count to 1
    const newGame = await pool.query(
      "INSERT INTO tictactoe_results (name1, count) VALUES ($1, $2) RETURNING *",
      [name, count]
    );

    res.json(newGame["rows"][0]["game_id"]);
  } catch (err) {
    console.error(err.message);
  }
});

//At 2nd move, input player 2 name and increment count

app.put("/game/playertwo", async (req, res) => {
  try {
    const { name } = req.body;

    // Find the latest row
    const latestGame = await pool.query(
      "SELECT * FROM tictactoe_results ORDER BY game_id DESC LIMIT 1"
    );

    if (latestGame.rows.length > 0) {
      const latestRow = latestGame.rows[0];

      // Update name2 with your name and increment count by 1
      const updatedGame = await pool.query(
        "UPDATE tictactoe_results SET name2 = $1, count = count + 1 WHERE game_id = $2 RETURNING *",
        [name, latestRow.game_id]
      );

      res.json(updatedGame.rows[0]); // Return the updated row
    }
  } catch (err) {
    console.error(`ERROR FROM UPDATE PLAYER 2 BLOCK: ${err.message}`);
  }
});

//At 3rd move onwards, increment count at every turn

app.put("/game/incrementCount", async (req, res) => {
  try {
    const { name } = req.body;

    // Find the latest row
    const latestGame = await pool.query(
      "SELECT * FROM tictactoe_results ORDER BY game_id DESC LIMIT 1"
    );

    if (latestGame.rows.length > 0) {
      const latestRow = latestGame.rows[0];

      // Update name2 with your name and increment count by 1
      const updatedGame = await pool.query(
        "UPDATE tictactoe_results SET count = count + 1 WHERE game_id = $1 RETURNING *",
        [latestRow.game_id]
      );

      res.json(updatedGame.rows[0]); // Return the updated row
    }
  } catch (err) {
    console.error(`ERROR FROM INCREMENT COUNT BLOCK: ${err.message}`);
  }
});

//Input Game end result

app.put("/game/endResult", async (req, res) => {
  try {
    const { endResult } = req.body;

    // Find the latest row
    const latestGame = await pool.query(
      "SELECT * FROM tictactoe_results ORDER BY game_id DESC LIMIT 1"
    );

    if (latestGame.rows.length > 0) {
      const latestRow = latestGame.rows[0];

      // Update name2 with your name and increment count by 1
      const updatedGame = await pool.query(
        "UPDATE tictactoe_results SET result = $1  WHERE game_id = $2 RETURNING *",
        [endResult, latestRow.game_id]
      );

      res.json(updatedGame.rows[0]); // Return the updated row
    }
  } catch (err) {
    console.error(`ERROR FROM endResult BLOCK: ${err.message}`);
  }
});

//get the latest game

app.get("/game", async (req, res) => {
  try {
    const games = await pool.query(
      "SELECT * FROM tictactoe_results ORDER BY game_id DESC LIMIT 1"
    );

    res.json(games.rows[0]); // Assuming you want to return a single row, the latest one
  } catch (err) {
    console.error(err.message);
  }
});

//get all the game history

app.get("/gameHistory", async (req, res) => {
  try {
    const games = await pool.query("SELECT * FROM tictactoe_results");

    res.json(games.rows); // Return all rows, not just the first one
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(3001, () => {
  // Server listening on port 3001
});
