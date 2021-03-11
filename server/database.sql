CREATE DATABASE pern_jwt;

--set extention
CREATE TABLE users(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

--insert example
INSERT INTO users (name, email, password)
VALUES ('Lucas', 'lucas@mail.com', '1234');