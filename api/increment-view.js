// api/blogs/increment-view.js
import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { id } = req.body;

  try {
    const result = await sql`
      UPDATE blogs 
      SET views = views + 1 
      WHERE id = ${id}
      RETURNING views;
    `;
    
    res.status(200).json({ views: result[0].views });
  } catch (err) {
    res.status(500).json({ error: "Could not update views" });
  }
}