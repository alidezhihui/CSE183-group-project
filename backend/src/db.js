const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

const query = async (sql, values = []) => {
  const {rows} = await pool.query(sql, values);
  return rows;
}



module.exports = {query, pool};
