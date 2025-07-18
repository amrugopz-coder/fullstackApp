import pool from '../../backend/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const posts = await response.json();

    const client = await pool.connect();
    try {
      for (const post of posts) {
        await client.query(
          `INSERT INTO posts (id, title, body) 
           VALUES ($1, $2, $3)
           ON CONFLICT (id) DO NOTHING;`, // Avoid duplicates
          [post.id, post.title, post.body]
        );
      }
      res.status(200).json({ message: 'Posts synced to DB' });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Sync error:', err);
    res.status(500).json({ error: 'Failed to sync posts' });
  }
}