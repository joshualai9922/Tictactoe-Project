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
const api_secret = "pup8x6n984h4va9guk4bftvhyp479ajdrxqeayxfp8ggar9fwaebr99j87rhhwgw";
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

//create a game

app.post("/game", async (req, res) => {
  try {
    const { names } = req.body;
    const newGame = await pool.query(
      "INSERT INTO tictactoe_1 (name1, name2) VALUES ($1, $2) RETURNING *",
      [names[0], names[1]]
    );

    res.json(newGame.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//update a game

app.put("/game/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { move } = req.body; //move = [move number, square number]
    const updateMove = await pool.query(
      `UPDATE tictactoe_1 SET move${move[0]} = $1 WHERE todo_id = $2`,
      [move[1], id]
    );

    res.json("game was updated!");
  } catch (err) {
    console.error(err.message);
  }
});

//get a game

app.get("/game/:name", async (req, res) => {
  try {
    const { name } = req.params;
    
    const games = await pool.query(
      "SELECT * FROM tictactoe_1 WHERE name1 = $1 OR name2 = $1",
      [name]
    );

    res.json(games.rows);
  } catch (err) {
    console.error(err.message);
  }
});


app.listen(3001, () => {
  console.log("Server is running on port 3001");
});