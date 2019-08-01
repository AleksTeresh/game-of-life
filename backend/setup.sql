CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30),
  email VARCHAR(30),
  password VARCHAR
);

CREATE TABLE generations (
  id SERIAL PRIMARY KEY,
  index VARCHAR(30),
  data JSONB,
  password VARCHAR
);

