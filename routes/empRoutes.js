import express from "express";
import { addjob, alljobs} from "../controllers/empController.js";
import { getUserById, updateUser } from "../controllers/empController.js";
import { searchJobs } from "../controllers/jobsearchController.js";
import { deletejob } from "../controllers/deleteController.js";
// routes.js
const router = express.Router();

router.post("/addjob", addjob);
router.get("/alljobs/:user_id", alljobs);  // <-- Use param
router.get("/search-jobs",searchJobs);
router.delete("/delete/:id",deletejob);


router.get("/:id", getUserById);
router.put("/:id", updateUser);
// routes.js
router.get("/ping", (req, res) => {
  console.log("Ping route hit!");
  res.send("pong");
});

export default router;
