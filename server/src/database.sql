CREATE DATABASE tictactoe_project;

CREATE TABLE tictactoe_results (
  game_id SERIAL PRIMARY KEY,
  name1 VARCHAR(255), 
  name2 VARCHAR(255),
  count INT,
  result VARCHAR(255)
);