const express = require('express');
const cors = require('cors');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');

// DataBase
const db = require('./db');
// Auth
const auth = require('./auth');
// Users
const users = require('./users');
const dummy = require('./dummy');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const apiSpec = path.join(__dirname, '../api/openapi.yaml');

const apidoc = yaml.load(fs.readFileSync(apiSpec, 'utf8'));
app.use('/v0/api-docs', swaggerUi.serve, swaggerUi.setup(apidoc));

// authenticate
app.post('/v0/authenticate',  auth.authenticate);


app.use(
     OpenApiValidator.middleware({
       apiSpec: apiSpec,
       validateRequests: true,
       validateResponses: true,
     }),
 );

app.get('/v0/test', async (req, res) => {
  const {rows} = await db.query("SELECT NOW()");
  res.json(rows);
});
app.get('/v0/dummy', dummy.get);
// Your routes go here
app.get('/v0/workspace', auth.check, users.getWorkspaces); // get logged in user's workspaces
app.get('/v0/channels/:workspaceId', auth.check, users.getChannels); // get the channels in the choosen workspace
app.get('/v0/directmessage/:channelID', auth.check, users.getDirectMessage); // get all the messages in a channel
app.post('/v0/directmessage/:channelID', auth.check, users.postDirectMessage); // send a message in a channel
app.get('/v0/privatemessage/:workspaceId', auth.check, users.getPrivateMessage); // get all direct message in a channel
app.get('/v0/users/:userId', auth.check, users.getUsersInformation); // get a user's information (either anna or molly)
app.put('/v0/users', auth.check, users.putUserThoughts); // update a user's thoughts
app.post('/v0/privatemessage', auth.check, users.postPrivateMessage); // send direct message to a user
app.put('/v0/logout', auth.check, users.logout); // update user's status as logout


app.use((err, req, res, next) => {
  res.status(err.status).json({
    message: err.message,
    errors: err.errors,
    status: err.status,
  });
});

module.exports = app;
