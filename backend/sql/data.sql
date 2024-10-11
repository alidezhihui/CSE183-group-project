-- Dummy Data --
INSERT INTO dummy (created) VALUES (current_timestamp);

-- Populate Your Tables Here --
-- Table users
-- NOTICE When mystatus = 0 means outline, mystatus = 1 means online, mystatus = 2 means busy!!!
-- userid = 1
INSERT INTO users(email, keyword, users_name, mystatus, mythoughts) VALUES ('molly@books.com', '$2b$10$Y00XOZD/f5gBSpDusPUgU.iJufk6Nxx6gAoHRG8t2eHyGgoP2bK4y', 'molly', 0, 'nice day');
-- userid = 2
INSERT INTO users(email, keyword, users_name, mystatus, mythoughts) VALUES ('anna@books.com', '$2b$10$Y00XOZD/f5gBSpDusPUgU.G1ohpR3oQbbBHK4KzX7dU219Pv/lzze', 'anna', 0, 'hello world');


-- Table workspace
-- id = 1
INSERT INTO workspace(workspace_name) VALUES ('CSE183 Summer 2023');
-- id = 2
INSERT INTO workspace(workspace_name) VALUES ('CSE183 Fall 2023');

-- Connect users to workspaces
INSERT INTO workspace_user(users_id, workspace_id) VALUES(1,1);
INSERT INTO workspace_user(users_id, workspace_id) VALUES(2,1);
INSERT INTO workspace_user(users_id, workspace_id) VALUES(2,2);

-- Table channel
INSERT INTO channel(channel_name, workspace_id) VALUES('Assignment 1', 1);
INSERT INTO channel(channel_name, workspace_id) VALUES('Assignment 2', 1);
INSERT INTO channel(channel_name, workspace_id) VALUES('Assignment 3', 1);
INSERT INTO channel(channel_name, workspace_id) VALUES('Assignment 4', 1);
INSERT INTO channel(channel_name, workspace_id) VALUES('General', 1);
INSERT INTO channel(channel_name, workspace_id) VALUES('General', 2);

-- Table channel message
INSERT INTO publicm(users_id, channel_id, content) VALUES (1, 1, 'Hello Class, my name is molly!');
INSERT INTO publicm(users_id, channel_id, content, parent_id) VALUES (2, 1, 'Hello Class, my name is anna!', 1);
INSERT INTO publicm(users_id, channel_id, content) VALUES (2, 2, 'Anna don know how to start this assignment!');
INSERT INTO publicm(users_id, channel_id, content) VALUES (2, 6, 'Dr.Harrison, Anna Back Again!');
-- Table Direct Message
INSERT INTO directm(from_id, to_id, workspace_id, content) VALUES (1, 2, 1, 'Nice to meet you Anna! Lets Study!');
INSERT INTO directm(from_id, to_id, workspace_id, content) VALUES (2, 1, 1, 'Weeeeeeeeeee!?No, Molly,lets play!');
INSERT INTO directm(from_id, to_id, workspace_id, content) VALUES (1, 2, 1, 'Sorry, I prefer play After Study');
INSERT INTO directm(from_id, to_id, workspace_id, content) VALUES (2, 1, 1, 'Okayyyyyyyy...');
-- INSERT INTO directm(from_id, to_id, workspace_id, content) VALUES (2, 1, 2, 'Molly, I am gonna retake this class next fall...');

