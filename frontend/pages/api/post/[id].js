// /pages/api/post/[id].js
import pool from "../../../backend/db";

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  console.log("🛠️ API hit:", method, "for ID:", id);

  try {
    if (method === "GET") {
      console.log("🔍 GET post with ID:", id);
      const result = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);

      if (result.rows.length === 0) {
        console.warn("⚠️ No post found for ID:", id);
        return res.status(404).json({ error: "Post not found" });
      }

      res.status(200).json(result.rows[0]);
    } else if (method === "PUT") {
      const { title } = req.body;
      console.log("✏️ PUT update title to:", title, "for ID:", id);

      const result = await pool.query(
        "UPDATE posts SET title = $1 WHERE id = $2 RETURNING *",
        [title, id]
      );

      if (result.rows.length === 0) {
        console.warn("⚠️ No post found to update for ID:", id);
        return res.status(404).json({ error: "Post not found for update" });
      }

      res.status(200).json(result.rows[0]);
    } else {
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error("❌ API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
