// controllers/jobController.js
import db from "../config/db.js"; // make sure your db connection is imported correctly

export const searchJobs = async (req, res) => {
  try {
    const { keyword } = req.query;

    let query = "SELECT * FROM posted_job";
    let params = [];

    if (keyword && keyword.trim() !== "") {
      query += " WHERE jobrole LIKE ? OR location LIKE ? OR offer LIKE ?";
      params = [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`];
    }

    // using promise-based query
    const [rows] = await db.query(query, params);

    return res.json(rows);
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database error", details: error.message });
  }
};
