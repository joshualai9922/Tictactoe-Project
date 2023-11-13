CREATE DATABASE tictactoe_project;

-- CREATE TABLE tictactoe_1 (
--   game_id SERIAL PRIMARY KEY,
--   name1 VARCHAR(255), -- assuming user IDs are strings, adjust the length if needed
--   name2 VARCHAR(255),
--   move1 INT,
--   move2 INT,
--   move3 INT,
--   move4 INT,
--   move5 INT,
--   move6 INT,
--   move7 INT,
--   move8 INT,
--   move9 INT,
--   gameresult VARCHAR(255)
-- );

CREATE TABLE tictactoe_results (
  game_id SERIAL PRIMARY KEY,
  name1 VARCHAR(255), 
  name2 VARCHAR(255),
  count INT,
  result VARCHAR(255)
);