// controllers/recruiterController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js"; // make sure this path is correct

// ===================== REGISTER =====================
export const registerR = async (req, res) => {
  const { company_name, password } = req.body;

  if (!company_name || !password) {
    return res.status(400).json({ message: "Company name and password are required" });
  }

  try {
    // check if recruiter already exists
    const [rows] = await db.query("SELECT * FROM recruiterss WHERE company_name = ?", [
      company_name,
    ]);

    if (rows.length > 0) {
      return res.status(400).json({ message: "Company already registered" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert recruiter
    await db.query("INSERT INTO recruiterss (company_name, password) VALUES (?, ?)", [
      company_name,
      hashedPassword,
    ]);

    res.status(201).json({ message: "Recruiter registered successfully" });
  } catch (err) {
    console.error("Error in registerR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===================== LOGIN =====================
export const loginR = async (req, res) => {
  const { company_name, password } = req.body;

  try {
    // check recruiter exists
    const [rows] = await db.query("SELECT * FROM recruiterss WHERE company_name = ?", [company_name]);

    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid company name or password" });
    }

    const recruiter = rows[0];

    // compare password
    const isMatch = await bcrypt.compare(password, recruiter.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid company name or password" });
    }

    // sign JWT
    const token = jwt.sign(
      {
        company_id: recruiter.company_id,
        company_name: recruiter.company_name,
      },
      process.env.JWT_SECRET2, // recruiter secret
      { expiresIn: "1h" }
    );

    return res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Error in recruiter login:", err);
    return res.status(500).json({ message: "Database error" });
  }
};
/// post for job 
 // controllers/recruiterController.js
  // your mysql2/promise connection pool

// Post a job
export const postJob = async (req, res) => {
  try {
    const { company_name, jobrole, offer, location, skills, description } = req.body;

    if (!company_name || !jobrole || !offer || !location || !skills || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if recruiter exists
    const [recruiter] = await db.query(
      "SELECT * FROM recruiterss WHERE company_name = ?",
      [company_name]
    );

    if (recruiter.length === 0) {
      return res.status(404).json({ message: "Recruiter not found" });
    }

    // Insert job
    await db.query(
      "INSERT INTO posted_job (jobrole, offer, location, skills, description, company_name) VALUES (?, ?, ?, ?, ?, ?)",
      [jobrole, offer, location, skills, description, company_name]
    );

    return res.status(201).json({ message: "Job posted successfully ✅" });
  } catch (error) {
    console.error("Error posting job:", error);
    return res.status(500).json({ message: "Server error while posting job" });
  }
};

// Get all jobs (optional to test)

// Get all job applications for a recruiter
export const getApplicationsByCompany = async (req, res) => {
  const { company } = req.params;

  const query = `
    SELECT 
      addjobs.id_job,
      addjobs.company,
      addjobs.status1,
      addjobs.position,
      addjobs.location,
      addjobs.application_date,
      addjobs.note,
      users.full_name,
      users.email,
      users.status AS user_status
    FROM addjobs
    INNER JOIN users ON addjobs.user_id = users.id
    WHERE addjobs.company = ?;
  `;

  try {
    const [rows] = await db.query(query, [company]);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching applications:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// Update application status
export const updateApplicationStatus = async (req, res) => {
  const { id_job } = req.params;
  const { status1 } = req.body;

  const query = `UPDATE addjobs SET status1 = ? WHERE id_job = ?`;

  try {
    await db.query(query, [status1, id_job]);
    res.json({ message: "✅ Status updated successfully" });
  } catch (err) {
    console.error("❌ Error updating status:", err);
    res.status(500).json({ error: "Database error" });
  }
};
