const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

const jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

const secrets = require('../data/secrets');

// function authenticate works
exports.authenticate = async (req, res) => {
  const { email, password } = req.body;
  console.log(email,password);
  const select = 'SELECT email, keyword, id, users_name, mythoughts FROM users WHERE email = $1';
  const query = {
    text: select,
    values: [email],
  };
  const {rows} = await pool.query(query);
  if (rows.length === 0) {
    res.status(401).send('Username does not exist!');
  } else if (!bcrypt.compareSync(password, rows[0].keyword)) {
    res.status(401).send('Your Password is incorrect!');
  } else {
    // set the status to online !!!!!!!!!!!!
    const update = 'UPDATE users SET mystatus = $1 WHERE id = $2';
    const query = {
      text: update,
      values: [1, rows[0].id],
    };
    await pool.query(query);
    const accessToken = jwt.sign(
      rows[0],   // , role: user.role
      secrets.accessToken, {
        expiresIn: '30m',
        algorithm: 'HS256'
      });
    res.status(200).json({user: rows[0], accessToken: accessToken});
  }
};

exports.check = (req, res, next) => {
  const authHeader = req.headers.authorization; // bearer A3erdifu08au3hnasdfoaeuef.asdf34ef
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, secrets.accessToken, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user; // {id, user_name, email}
      next();
    });
  } else {
    console.log('unauthenticated call')
    return res.sendStatus(401).end();
  }
};

