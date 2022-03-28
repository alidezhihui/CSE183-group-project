const { Pool } = require('pg');
const db = require('./db');
// const router = require('express').Router();

// const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

// -- DATA BASE --
const getMyWorkspaces = async (userId) => {
  const select = `
  SELECT 
  workspace.id,
  workspace.workspace_name, 
  users.users_name 
  FROM workspace
  JOIN workspace_user ON workspace_user.workspace_id = workspace.id
  JOIN users ON users.id = workspace_user.users_id 
  WHERE users.id = $1;
  `;
  return await db.query(select, [userId]);
};

const getUser = async (userId, access) => {
  let fields = `id, users_name, mystatus, mythoughts`;
  if(access){
    fields += `, email`
  }
  const select = `
  SELECT
  ${fields}
  FROM users
  WHERE users.id = $1;
  `;
  return await db.query(select, [userId]);
}

const getChannelsByWorkspace = async (workspaceId) => {
  const select = `
  SELECT
  channel.*
  FROM channel
  WHERE workspace_id = $1;
  `;
  return await db.query(select, [workspaceId])
}

const getDirectMessageInChannel = async (channelID) => {
  const select = `
  SELECT
  m.*,
  u.users_name,
  u.mystatus
  FROM publicm m
  LEFT JOIN users u ON u.id = m.users_id
  WHERE m.channel_id = $1
  ORDER BY m.created ASC
  LIMIT 300 
  `;
  return await db.query(select, [channelID]);
}

const getDirectMessageInWorkspace = async (workspaceId, userID) => {
  const select = `
  SELECT
  directm.*
  FROM directm
  WHERE workspace_id = $1
  AND (to_id = $2 OR from_id = $2)
  ORDER BY created ASC
  LIMIT 200
  `;
  return await db.query(select, [workspaceId, userID]);
}

const sendNewMessage = async (myId, channelId, myContent, parentId) => {
  // INSERT INTO publicm(users_id, channel_id, content) VALUES (1, 1, 'Hello Class, my name is molly!');
  const insert = `
  INSERT INTO publicm(users_id, channel_id, content, parent_id)
  VALUES($1,$2,$3,$4) RETURNING *
  `;
  const query = {
    text: insert,
    values: [myId, channelId, myContent, parentId],
  };
  try{
    return await db.pool.query(query);
  } catch(e){
    console.log(e)
    return false;
  }
}

const updateUserThoughts = async (newThoughts, myId) => {
  
  const update = `
  UPDATE users
  SET mythoughts = $1
  WHERE id = $2 RETURNING *
  `;
  const query = {
    text: update,
    values: [newThoughts, myId]
  }
  return await db.pool.query(query);
}

const sendPrivateMessage = async (newMessage, toId, myId, workspaceId) => {
  const post = `
  INSERT INTO directm(from_id, to_id, workspace_id, content)
  VALUES ($1, $2, $3, $4) RETURNING *
  `;
  const query = {
    text: post,
    values: [myId, toId, workspaceId, newMessage]
  }
  return await db.pool.query(query);
}

const logMeOut = async (myId) => {
  const update = 'UPDATE users SET mystatus = $1 WHERE id = $2';
  const query = {
    text: update,
    values: [0, myId],
  };
  return await db.pool.query(query);
}

const sameId = (id1, id2) => {
  return id1 === id2
}

// -- (MIDDLE WARE) CONTROLLERS --
exports.getWorkspaces = async (req, res) => {
  console.log(req.user);
  const allWorkspaces = await getMyWorkspaces(req.user.id);
  res.status(200).json(allWorkspaces);
}

// app.put('/v0/logout', auth.check, users.logout);
exports.logout = async (req, res) => {
  await logMeOut(req.user.id);
  res.status(200).json({msg:'logged out'});
}

exports.getChannels = async (req, res) => {
  const workSpaceId = Number(req.params.workspaceId);
  // security
  const mine = await getMyWorkspaces(req.user.id);
  if (!mine.find(ws => ws.id === workSpaceId)) {
    return res.status(401)
  }
  res.status(200).json(await getChannelsByWorkspace(workSpaceId))
}

exports.getDirectMessage = async (req, res) => {
  const channelID = req.params.channelID;
  res.status(200).json(await getDirectMessageInChannel(channelID));
}

// app.get('/v0/users/:userId', auth.check, users.getUsersInformation);
exports.getUsersInformation = async (req, res) => {
  const thisUser = Number(req.params.userId);
  const access = sameId(thisUser,  Number(req.user.id))
  
  res.status(200).json(await getUser(thisUser, access));
}

// app.get('/v0/privatemessage/:workspaceID', auth.check, user.getPrivateMessage);
exports.getPrivateMessage = async (req, res) => {
  console.log(req.params.workspaceId);
  const workspaceID = Number(req.params.workspaceId);
  const userID = req.user.id;
  const allMessages = await getDirectMessageInWorkspace(workspaceID, userID);
  res.status(200).json(allMessages);
}

// app.post('/v0/directmessage/:channelID', auth.check, users.postDirectMessage);
// check if parent_id is set -> insert accordingly
exports.postDirectMessage = async (req, res) => {
  const myId = req.user.id;
  const channelId = req.params.channelID;
  const myContent = req.body.content;
  console.log(myId, channelId, myContent)
  
  const parent_id = req.body.parent_id ? req.body.parent_id : null;
  const {rows} = await sendNewMessage(myId, channelId, myContent, parent_id);
  const answer = {...rows[0], users_name: req.user.users_name}
  res.status(200).json(answer);
}

// app.put('/v0/users', auth.check, users.putUserThoughts);
// update user's status
exports.putUserThoughts = async (req, res) => {
  const newThoughts = req.body.content;
  const myId = req.user.id;
  await updateUserThoughts(newThoughts, myId);
  res.status(200).json({msg: 'updated'});;
}
// Have Problems In!
exports.postPrivateMessage = async (req, res) => {
  const newMessage = req.body.content;
  const toId = req.body.toId;
  const myId = req.user.id;
  const workspaceId = req.body.workspaceId;
  const result = await sendPrivateMessage(newMessage, toId, myId, workspaceId);
  return res.status(200).json(result.rows[0]);
}