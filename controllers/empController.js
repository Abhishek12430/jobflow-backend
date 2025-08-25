import db from "../config/db.js";

// alljobs controller
export const alljobs = async (req, res) => {
  try {
    const { user_id } = req.params;
    console.log("Fetching jobs for user:", user_id);

    if (!user_id) {
      return res.status(400).json({ message: "User ID missing" });
    }

    // Promise API: result comes as [rows, fields]
    const [rows] = await db.query("SELECT * FROM addjobs WHERE user_id = ?", [user_id]);

    if (rows.length === 0) {
      console.log("❌ No jobs found for this user");
      return res.status(200).json([]); // return empty array
    }

    console.log("✅ Jobs fetched:", rows);
    return res.status(200).json(rows);

  } catch (error) {
    console.error("❌ Database error:", error);
    return res.status(500).json({ message: "Database error" });
  }
};

export const addjob = async (req, res) => {
  try {
    const { company, status1, position, location, application_date, note, user_id } = req.body;

    // Validate required fields
    if (!company || !status1 || !position || !location || !application_date || !user_id) {
      console.log("❌ Missing fields:", req.body);
      return res.status(400).json({ message: "Enter full data" });
    }

    const sql = `
      INSERT INTO addjobs 
      (company, status1, position, location, application_date, note, user_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      company, status1, position, location, application_date, note, user_id,
    ]);

    console.log("✅ Job inserted, ID:", result.insertId);
    return res.status(201).json({ message: "Data entered successfully", jobId: result.insertId });

  } catch (err) {
    console.error("❌ DB Error:", err);
    return res.status(500).json({ message: "Database error", error: err });
  }
};

//-----------------------------------------------------------------------------------""

export const getUserById = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, full_name, email, skills, status, created_at FROM users WHERE id = ?",
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: "User not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user" });
  }
};

export const updateUser = async (req, res) => {
  const { skills, status } = req.body;
  try {
    await db.query(
      "UPDATE users SET skills = ?, status = ? WHERE id = ?",
      [skills, status, req.params.id]
    );
    res.json({ message: "Profile updated" });
  } catch (err) {
    res.status(500).json({ message: "Error updating user" });
  }
};
