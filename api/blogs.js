import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  try {
    // Fetch all blogs from DB
    let blogs = await sql`SELECT * FROM blogs ORDER BY id ASC;`;

    // Optional: Merge JSON data IDs (fallback creation)
    // Example JSON IDs - you could pass this from frontend if needed
    const frontendIds = req.body?.ids || []; // array of blog ids from JSON

    for (let id of frontendIds) {
      const exists = blogs.find(b => b.id === id);
      if (!exists) {
        // Insert new row with 0 likes/views
        const newBlog = await sql`
          INSERT INTO blogs (id, title, likes, views)
          VALUES (${id}, 'Unknown Title', 0, 0)
          RETURNING *;
        `;
        blogs.push(newBlog[0]);
      }
    }

    res.status(200).json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}
