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
    const { name } = req.body;
    const newGame = await pool.query(
      "INSERT INTO tictactoe_1 (name1) VALUES ($1) RETURNING *",
      [name]
    );
  
    res.json(newGame["rows"][0]["game_id"]);
    
  } catch (err) {
    console.error(err.message);
  }
});

//update a game

app.put("/game/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { move } = req.body; //move = [move number, square number]
    const columnName = `move${move[0]}`;
    const updateMove = await pool.query(
      `UPDATE tictactoe_1 SET ${columnName} = $1 WHERE game_id = $2`,
      [move[1], id]
    );

    res.json("game was updated!");
  } catch (err) {
    console.error(err.message);
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//update player 2
app.put("/game/playertwo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    const updatePlayerTwo = await pool.query(
      "UPDATE tictactoe_1 SET name2 = $1 WHERE game_id = $2",
      [name,id]
    );
    res.json("player 2 updated!")
    
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