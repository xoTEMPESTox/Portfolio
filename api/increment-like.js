import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  // 1. Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.body;

  // 2. Validate that an ID was provided
  if (!id) {
    return res.status(400).json({ error: "Blog ID is required" });
  }

  try {
    // 3. Increment the likes atomically and return the new value
    // We use the RETURNING clause so the frontend can update its state immediately
    const result = await sql`
      UPDATE blogs 
      SET likes = likes + 1 
      WHERE id = ${id}
      RETURNING likes;
    `;

    // 4. Handle case where the ID doesn't exist in the DB
    if (result.length === 0) {
      return res.status(404).json({ error: "Blog post not found in database" });
    }

    // 5. Return the updated likes count
    res.status(200).json({ likes: result[0].likes });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to update likes" });
  }
}