CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30),
  email VARCHAR(30),
  password VARCHAR,
  curr_generation_index INTEGER NOT NULL
);

CREATE TABLE generations (
  id SERIAL PRIMARY KEY,
  index VARCHAR(30),
  data JSONB,
  password VARCHAR,
  user_id SERIAL,
  FOREIGN KEY (user_id) REFERENCES users (id)
);

