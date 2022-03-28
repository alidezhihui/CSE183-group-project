-- Dummy table --
DROP TABLE IF EXISTS dummy;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS workspace;
DROP TABLE IF EXISTS channel;
DROP TABLE IF EXISTS directm;
DROP TABLE IF EXISTS publicm;
DROP TABLE IF EXISTS publicc;
-- Your database schema goes here --

-- password looks like a key word --
CREATE TABLE dummy(created TIMESTAMP WITH TIME ZONE);
CREATE TABLE users(id SERIAL PRIMARY KEY , email VARCHAR(60), keyword VARCHAR(255), users_name VARCHAR(60), mystatus INT, mythoughts VARCHAR(255));
CREATE TABLE workspace(id SERIAL PRIMARY KEY, workspace_name VARCHAR(60));
CREATE TABLE channel(id SERIAL PRIMARY KEY, channel_name VARCHAR(60), workspace_id INT, created TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp);
CREATE TABLE workspace_user(id SERIAL PRIMARY KEY, users_id INT, workspace_id INT);

-- currently working on this!
CREATE TABLE publicm(id SERIAL PRIMARY KEY, users_id INT, channel_id INT, content VARCHAR(1000), parent_id INT NULL, created TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp);
CREATE TABLE directm(id SERIAL PRIMARY KEY, from_id INT, to_id INT, workspace_id INT, content VARCHAR(1000), created TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp);


-- CREATE TABLE directm(id SERIAL PRIMARY KEY, toEmail VARCHAR (60), fromEmail VARCHAR(60), atworkspace_id INT, directm jsonb);

-- Future Tables Model, m stands for message, c stands for comments


-- CREATE TABLE publicc(id UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), publicc jsonb);

-- 
