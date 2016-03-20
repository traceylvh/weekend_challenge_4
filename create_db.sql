CREATE TABLE todo_list (
    id SERIAL PRIMARY KEY,
    task varchar NOT NULL,
    status boolean DEFAULT TRUE
  );
