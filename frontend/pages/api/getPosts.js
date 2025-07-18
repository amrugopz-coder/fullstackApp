// pages/api/getPosts.js
import pool from '../../backend/db';

export default async function handler(req, res) {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM posts ORDER BY id DESC");
    client.release();

    res.status(200).json({ posts: result.rows });
  } catch (err) {
    console.error("DB fetch error:", err);
    res.status(500).json({ error: "Failed to fetch posts from DB" });
  }
}
