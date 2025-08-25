import express from "express";
import { loginR,registerR,postJob } from "../controllers/recruiterController.js";
import { 
  getApplicationsByCompany, 
  updateApplicationStatus 
} from "../controllers/recruiterController.js";
const router = express.Router();

router.post("/register", registerR);
router.post("/login", loginR);
router.post("/post_job",postJob);
router.get("/applications/:company", getApplicationsByCompany);

// PUT update status of an application
router.put("/update-status/:id_job", updateApplicationStatus);
export default router;