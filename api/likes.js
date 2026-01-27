import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  try {
    const { id, title = "Unknown Title" } = JSON.parse(req.body);

    // Try to increment likes
    let blog = await sql`
      UPDATE blogs
      SET likes = likes + 1
      WHERE id = ${id}
      RETURNING *;
    `;

    // If no row exists, create one
    if (blog.length === 0) {
      blog = await sql`
        INSERT INTO blogs (id, title, likes, views)
        VALUES (${id}, ${title}, 1, 0)
        RETURNING *;
      `;
    }

    res.status(200).json(blog[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}
