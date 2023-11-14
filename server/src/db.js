import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  user: "postgres",
  password: "joshua9922",
  host: "localhost",
  port: 5432,
  database: "tictactoe_project",
});

export default pool;
