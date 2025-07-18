import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: 'posts_db',
  password: 'password',
  port: parseInt(process.env.DB_PORT) || 5433,
});

export default pool;