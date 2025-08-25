import db from "../config/db.js";

export const deletejob = async (req, res) => {
  const { id } = req.params;  // match ":id" from route
  try {
    const [result] = await db.query("DELETE FROM addjobs WHERE id_job = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    return res.status(500).json({ message: "Server problem" });
  }
};

